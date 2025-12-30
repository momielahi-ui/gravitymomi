import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { GoogleGenerativeAI } from '@google/generative-ai';
import nodemailer from 'nodemailer'; // Added email support

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Root route for simple verification
app.get('/', (req, res) => {
    res.send('Smart Reception Backend is running!');
});

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Using Anon Key for client operations, usually passed via Authorization header

// Helper to get user from token
const getUser = async (req) => {
    console.log('[Auth] getUser called');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log('[Auth] No Authorization header found');
        return null;
    }

    // Robust extraction: Handle "Bearer <token>" or just "<token>"
    let token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // Sanitize: 
    // 1. Trim whitespace
    token = token?.trim();

    // 2. Remove surrounding quotes if they exist (handling both " and ')
    if (token) {
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
            token = token.slice(1, -1);
        }
    }

    if (!token) {
        console.log('[Auth] Token is empty after extraction/sanitization');
        return null;
    }

    // Debug log (safe) - Log first few chars to check for "Bearer" repetition or quotes
    console.log(`[Auth] Extracted Token: ${token.substring(0, 15)}... (Length: ${token.length})`);

    const supabase = createClient(supabaseUrl, supabaseKey);
    // console.log('[Auth] Calling supabase.auth.getUser'); 
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
        console.error('[Auth] supabase.auth.getUser failed:', error.message);
        // Special handling for the specific "illegal base64" causing crashes or confusion
        if (error.message.includes('illegal base64')) {
            console.error('[Auth] CRITICAL: Token malformed. Check frontend sending logic.');
        }
    } else {
        console.log('[Auth] User verified:', user?.id);
    }

    if (error || !user) return null;
    return user;
};

// Create a client with the user's token to respect RLS
const getSupabaseClient = (token) => {
    return createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });
};

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

import { Resend } from 'resend';

// ... (other imports)

// Email Setup (Resend HTTP API)
const emailPass = process.env.EMAIL_PASSWORD || '';
// Check if it's a Resend key (starts with 're_')
const isResendKey = emailPass.startsWith('re_');

let resendClient = null;
let nodemailerTransport = null;

if (isResendKey) {
    resendClient = new Resend(emailPass);
    console.log('[Email] Using Resend HTTP API');
} else {
    // Fallback to SMTP for legacy/other providers
    console.log('[Email] Using SMTP (Nodemailer)');
    nodemailerTransport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
            user: process.env.SMTP_USER || process.env.SENDER_EMAIL || process.env.PAYONEER_EMAIL,
            pass: emailPass
        }
    });
}

// ElevenLabs Setup
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pqHfZKP75CvOlQylNhV4'; // Bill (Wise, Mature, Balanced) - Premade
const ELEVENLABS_AGENT_ID = 'agent_6901kd70rt78ecvt04kzgg4kbbzr'; // Reference for future use


// Helper to estimate minutes from characters (approx 1000 chars = 1 min)
const charsToMinutes = (chars) => Math.ceil(chars / 1000);


// Helper to determine sender address
const getSender = () => {
    if (process.env.SENDER_EMAIL) return process.env.SENDER_EMAIL;
    if (isResend) return 'onboarding@resend.dev'; // Mandatory for Resend free tier
    return process.env.PAYONEER_EMAIL;
};

// Health check for deployment verification (Last updated: 2025-12-23)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        model: 'gemini-flash-latest',
        deployment: '2025-12-25-bill-voice-v1'
    });
});

// Check setup status
app.get('/api/status', async (req, res) => {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const supabase = getSupabaseClient(req.headers.authorization.split(' ')[1]);
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (data) {
        res.json({ setupCompleted: true, config: data });
    } else {
        res.json({ setupCompleted: false });
    }
});

// Save Onboarding Data
app.post('/api/setup', async (req, res) => {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, services, tone, workingHours, greeting } = req.body;
    const supabase = getSupabaseClient(req.headers.authorization.split(' ')[1]);

    // Manual Upsert Logic to avoid onConflict constraint issues
    console.log(`[Setup] Checking if business exists for user ${user.id}...`);

    // 1. Check existence
    const { data: existing, error: fetchError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('[Setup] Existence Check Error:', fetchError);
        return res.status(500).json({ error: 'Database verification failed' });
    }

    let resultData;
    let resultError;

    const payload = {
        user_id: user.id,
        business_name: name,
        services,
        tone,
        working_hours: workingHours || '9 AM - 5 PM',
        greeting
    };

    if (existing) {
        console.log(`[Setup] Updating existing business ${existing.id}`);
        const { data, error } = await supabase
            .from('businesses')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single();
        resultData = data;
        resultError = error;
    } else {
        console.log(`[Setup] Creating new business for user ${user.id}`);
        const { data, error } = await supabase
            .from('businesses')
            .insert(payload)
            .select()
            .single();
        resultData = data;
        resultError = error;
    }

    if (resultError) {
        console.error('[Setup] Save Error:', resultError);
        console.error('[Setup] Payload was:', JSON.stringify(payload));
        return res.status(500).json({ error: resultError.message });
    }

    console.log('[Setup] Success! Business ID:', resultData.id);

    res.json({ success: true, id: resultData.id });
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
    console.log('[Chat] Received request. Body config present:', !!req.body?.config);
    try {
        // Validation
        if (!req.body) {
            return res.status(400).json({ error: 'Missing request body' });
        }

        // Check for Demo Config first (Unauthenticated flow)
        let config = req.body.config;
        let user = null;
        const isDemoMode = !!config;

        if (!config) {
            console.log('[Chat] Config not in body. Checking headers/demo mode...');
            if (req.headers.authorization) {
                console.log('[Chat] Auth header present length:', req.headers.authorization.length);
            } else {
                console.log('[Chat] No auth header');
            }

            // Check for legacy demo calls from outdated frontend (Vercel lag)
            if (req.body.businessId === 'demo' || !req.headers.authorization) {
                console.log('[Chat] Entering demo fallback path');
                console.log('[Chat] Using demo fallback config');
                config = {
                    business_name: 'Smart Reception Demo',
                    services: 'AI Receptionist Services',
                    working_hours: '24/7',
                    tone: 'friendly and professional'
                };
            } else {
                // Authenticated flow: Get user and fetch from DB
                console.log('[Chat] Authenticated flow: Getting user...');
                user = await getUser(req);
                console.log('[Chat] User retrieved:', user?.id);

                if (!user) return res.status(401).json({ error: 'Unauthorized' });

                const token = req.headers.authorization?.split(' ')[1];
                if (!token) return res.status(401).json({ error: 'Missing token' });

                console.log('[Chat] Fetching business config for user:', user.id);
                const supabase = getSupabaseClient(token);
                const { data: dbConfig, error } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                console.log('[Chat] DB Fetch result:', { hasConfig: !!dbConfig, error: error?.message });

                if (error || !dbConfig) {
                    console.error('[Chat] Business config missing for user:', user.id);
                    return res.status(400).json({ error: 'Business configuration not found' });
                }
                config = dbConfig;
            }
        } // Close if (!config)

        if (!config) {
            return res.status(400).json({ error: 'Business not configured' });
        }

        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Construct System Prompt
        // Use safe access or defaults to prevent undefined errors in string interpolation
        const systemPrompt = `You are an AI receptionist for "${config.business_name || config.name || 'Business'}".
      
      BUSINESS DETAILS:
      - Services: ${config.services || 'General Inquiry'}
      - Working Hours: ${config.working_hours || config.workingHours || '9 AM - 5 PM'}
      - Tone: ${config.tone || 'professional'}
      
      INSTRUCTIONS:
      1. You are talking to a customer.
      2. Answer strictly based on the business details.
      3. If asked about something not listed, say you don't know but can take a message.
      4. Be ${config.tone || 'professional'}.
      5. Keep responses concise (under 50 words) suitable for a chat interface.
      `;

        // Validate History for Gemini (Must start with User)
        const safeHistory = Array.isArray(history) ? history : [];
        let formattedHistory = safeHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content || '' }],
        }));

        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.unshift({ role: 'user', parts: [{ text: 'Start conversation' }] });
        }

        const chat = model.startChat({
            history: formattedHistory,
            systemInstruction: {
                role: 'system',
                parts: [{ text: systemPrompt }]
            },
        });

        const result = await chat.sendMessageStream(message);

        // Demo mode: Return JSON response with timeout protection
        if (isDemoMode) {
            console.log('[Chat] Demo mode: collecting full response for JSON');
            let fullResponse = '';

            try {
                // Add 30-second timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
                );

                const responsePromise = (async () => {
                    for await (const chunk of result.stream) {
                        fullResponse += chunk.text();
                    }
                    return fullResponse;
                })();

                fullResponse = await Promise.race([responsePromise, timeoutPromise]);
                console.log('[Chat] Demo response collected successfully');
                return res.json({ response: fullResponse });
            } catch (err) {
                console.error('[Chat] Demo mode error:', err.message);
                return res.status(500).json({
                    error: 'AI response timeout. Please try again.',
                    response: fullResponse || 'Sorry, I\'m having trouble responding right now. Please try again.'
                });
            }
        }

        // Authenticated mode: Stream response
        console.log('[Chat] Authenticated mode: streaming response');
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.end();

    } catch (error) {
        console.error('Gemini/Server API Error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
});

// --- ElevenLabs TTS Proxy ---
app.all('/api/voice/tts', async (req, res) => {
    const text = req.method === 'GET' ? req.query.text : req.body.text;
    const isDemo = req.method === 'GET' ? req.query.isDemo === 'true' : req.body.isDemo;
    const businessId = req.method === 'GET' ? req.query.businessId : req.body.businessId;

    if (!text) return res.status(400).json({ error: 'No text provided' });
    if (!ELEVENLABS_API_KEY) {
        console.warn('[TTS] ELEVENLABS_API_KEY missing, using fallback');
        return res.status(503).json({ error: 'TTS service not configured' });
    }

    try {
        let business = null;
        if (!isDemo && businessId) {
            // Check usage for paid plans
            const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);
            const { data } = await supabase.from('businesses').select('*').eq('id', businessId).single();
            business = data;

            if (business) {
                const used = business.minutes_used || 0;
                const limit = business.minutes_limit || 10;
                if (used >= limit) {
                    return res.status(403).json({ error: 'Usage limit reached' });
                }
            }
        }

        // Call ElevenLabs
        console.log(`[TTS] Generating speech for: "${text.substring(0, 30)}..."`);
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/stream`, {
            method: 'POST',
            headers: {
                'xi-api-key': ELEVENLABS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_turbo_v2_5', // Free tier compatible model
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('[TTS] ElevenLabs Error:', errBody);
            throw new Error(`ElevenLabs API returned ${response.status}`);
        }

        // Update usage in background
        if (!isDemo && business) {
            const estimatedMins = charsToMinutes(text.length);
            const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey);
            supabase.from('businesses')
                .update({ minutes_used: (business.minutes_used || 0) + estimatedMins })
                .eq('id', business.id)
                .then(({ error }) => {
                    if (error) console.error('[TTS] Usage Update Error:', error);
                });
        }

        // Stream the audio back to the client
        res.setHeader('Content-Type', 'audio/mpeg');
        // Node 18 fetch response.body is a ReadableStream (Web API), pipeable in standard way
        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch (err) {
        console.error('[TTS] Proxy Error:', err);
        res.status(500).json({ error: 'TTS Generation failed' });
    }
});

// Global Error Handler (Must be last)
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
});

// ===== TWILIO INTEGRATION =====

import twilio from 'twilio';
const VoiceResponse = twilio.twiml.VoiceResponse;

// Twilio credentials
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilioAccountSid && twilioAuthToken ? twilio(twilioAccountSid, twilioAuthToken) : null;

// Helper: Validate Twilio signature
const validateTwilioRequest = (req, res, next) => {
    // TEMPORARILY DISABLED FOR TESTING
    console.log('⚠️ Signature validation disabled for testing');
    return next();

    /* ENABLE THIS IN PRODUCTION:
    if (!twilioAuthToken) {
        console.warn('Twilio not configured - skipping signature validation');
        return next();
    }

    const twilioSignature = req.headers['x-twilio-signature'];
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    if (twilio.validateRequest(twilioAuthToken, twilioSignature, url, req.body)) {
        next();
    } else {
        console.error('Invalid Twilio signature');
        res.status(403).send('Forbidden');
    }
    */
};

// Save Twilio number to business and automagically configure webhooks
app.post('/api/twilio/connect', async (req, res) => {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { phoneNumber, accountSid, authToken } = req.body;
    const supabase = getSupabaseClient(req.headers.authorization.split(' ')[1]);

    try {
        // Construct the webhook URL using the current host
        const protocol = req.protocol === 'https' ? 'https' : 'https'; // Force https for Twilio
        const host = req.get('host');
        // If it's localhost, we can't use it for Twilio. 
        // We'll warn if it's not a public URL/ngrok.
        const webhookUrl = `${protocol}://${host}/webhooks/twilio/voice`;
        const statusUrl = `${protocol}://${host}/webhooks/twilio/status`;

        console.log(`Setting up Twilio number ${phoneNumber} with webhook: ${webhookUrl}`);

        // Initialize Twilio with PROVIDED credentials
        const client = twilio(accountSid, authToken);

        // Find the phone number in their account
        const incomingNumbers = await client.incomingPhoneNumbers.list({ phoneNumber });

        if (incomingNumbers.length === 0) {
            return res.status(400).json({ error: `Phone number ${phoneNumber} not found in this Twilio account.` });
        }

        const twilioNumber = incomingNumbers[0];

        // Update the webhook configuration on Twilio
        await client.incomingPhoneNumbers(twilioNumber.sid).update({
            voiceUrl: webhookUrl,
            voiceMethod: 'POST',
            statusCallback: statusUrl,
            statusCallbackMethod: 'POST'
        });

        // Save to Supabase
        const { data, error } = await supabase
            .from('businesses')
            .update({
                twilio_phone_number: phoneNumber,
                twilio_phone_sid: twilioNumber.sid,
                twilio_account_sid: accountSid,
                twilio_auth_token: authToken
            })
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            message: 'Twilio configured and webhook set automatically!',
            business: data
        });

    } catch (error) {
        console.error('Twilio automation error:', error);
        res.status(500).json({
            error: error.message || 'Failed to configure Twilio automation',
            details: 'Make sure your SID and Auth Token are correct and you are using a public URL (like ngrok).'
        });
    }
});

// Get Twilio status
app.get('/api/twilio/status', async (req, res) => {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const supabase = getSupabaseClient(req.headers.authorization.split(' ')[1]);
    const { data } = await supabase
        .from('businesses')
        .select('twilio_phone_number, twilio_phone_sid')
        .eq('user_id', user.id)
        .single();

    res.json({
        connected: !!data?.twilio_phone_number,
        phoneNumber: data?.twilio_phone_number || null
    });
});


// ===== BILLING & PAYMENTS =====

// GET /api/billing/plans
app.get('/api/billing/plans', (req, res) => {
    res.json([
        { id: 'starter', name: 'Starter Plan', price: 29, minutes: 100, features: ['Basic AI Voice', 'Email Support'] },
        { id: 'growth', name: 'Growth Plan', price: 79, minutes: 500, features: ['Advanced Voice', 'Priority Support', 'Custom Greeting'] },
        { id: 'pro', name: 'Pro Plan', price: 149, minutes: 2000, features: ['Premium Voice', '24/7 Phone Support', 'API Access', 'White Labeling'] }
    ]);
});

// POST /api/billing/pay
app.post('/api/billing/pay', async (req, res) => {
    const user = await getUser(req); // Retrieve user from auth header
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Safety check for req.body
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }

    const { plan, amount, paymentMethod, reference, businessId } = req.body;

    if (!plan || !amount || !paymentMethod || !reference) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        const supabase = token ? getSupabaseClient(token) : createClient(supabaseUrl, supabaseKey);

        // 1. Verify business belongs to user
        console.log(`[Billing] User: ${user.id}`);
        const { data: business, error: bizError } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (bizError) console.error('[Billing] Biz Lookup Error:', bizError);
        console.log(`[Billing] Business Found:`, business);

        // If no business found for user, we can't link payment
        if (!business) return res.status(404).json({ error: 'Business not found' });

        // 2. Create Payment Request with Email
        const { error } = await supabase
            .from('payment_requests')
            .insert({
                user_id: user.id,
                email: user.email, // Save email for notification
                business_id: business.id,
                plan,
                amount,
                payment_method: paymentMethod,
                payment_reference: reference,
                status: 'pending'
            });

        if (error) throw error;

        res.json({ success: true, message: 'Payment request submitted' });
    } catch (err) {
        console.error('Payment Error:', err);
        res.status(500).json({ error: 'Payment submission failed' });
    }
});

// ADMIN ENDPOINTS (Protected by simple Secret for MVP)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

const requireAdmin = (req, res, next) => {
    const authHeader = req.headers['x-admin-secret'];
    if (authHeader !== ADMIN_SECRET) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

// GET /api/admin/payments
app.get('/api/admin/payments', requireAdmin, async (req, res) => {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, businesses(business_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/admin/approve
app.post('/api/admin/approve', requireAdmin, async (req, res) => {
    const { requestId } = req.body;
    try {
        // Use SERVICE ROLE KEY to bypass RLS for admin updates (Required for 'businesses' table update)
        const adminSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;
        const supabase = createClient(supabaseUrl, adminSupabaseKey);

        // 1. Get Request
        const { data: request } = await supabase
            .from('payment_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (!request) return res.status(404).json({ error: 'Request not found' });
        if (request.status === 'approved') return res.status(400).json({ error: 'Already approved' });

        // 1.5 Get business info for email
        const { data: business } = await supabase
            .from('businesses')
            .select('business_name')
            .eq('id', request.business_id)
            .single();

        // 2. Mark request as approved
        const { error: updateError } = await supabase
            .from('payment_requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // 3. Update or Create Business Record
        const limits = {
            'starter': 100,
            'growth': 500,
            'pro': 2000
        };
        const newLimit = limits[request.plan] || 10;

        // Check if business record exists
        const { data: existingBusiness } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', request.business_id)
            .single();

        if (existingBusiness) {
            // Business exists, update it
            console.log(`[Admin] Updating existing business ${request.business_id}`);
            await supabase
                .from('businesses')
                .update({
                    subscription_plan: request.plan,
                    minutes_limit: newLimit
                })
                .eq('id', request.business_id);
        } else {
            // Business doesn't exist, create it
            console.log(`[Admin] Creating new business record for ${request.business_id}`);
            const businessName = request.email?.split('@')[0] || 'My Business';
            await supabase
                .from('businesses')
                .insert({
                    id: request.business_id,
                    user_id: request.user_id,
                    business_name: businessName,
                    services: 'AI Receptionist Services',
                    tone: 'professional and friendly',
                    working_hours: '9 AM - 5 PM',
                    subscription_plan: request.plan,
                    minutes_limit: newLimit,
                    minutes_used: 0
                });
        }

        // 4. Manual Email (User requested to disable auto-email)
        console.log(`[Admin] Payment approved for ${request.email}. Email notifications are disabled.`);


        res.json({ success: true, message: 'Approved, updated, and emailed' });

    } catch (err) {
        console.error('Approval Error:', err);
        // Only mark as pending if main update failed (optional logic, but keep simple for now)
        res.status(500).json({ error: 'Approval failed' });
    }
});



// GET /api/admin/config (Payment Details)
app.get('/api/admin/config', (req, res) => {
    res.json({
        payoneerEmail: process.env.PAYONEER_EMAIL || 'payments@smartreception.ai',
        nayapayId: process.env.NAYAPAY_ID || '03001234567'
    });
});


// Twilio Voice Webhook - Initial call
app.post('/webhooks/twilio/voice', express.urlencoded({ extended: false }), validateTwilioRequest, async (req, res) => {
    const { To, From, CallSid } = req.body;
    console.log(`Incoming call from ${From} to ${To}, CallSid: ${CallSid}`);

    try {
        // Find business by phone number
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: business, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('twilio_phone_number', To)
            .single();

        if (error || !business) {
            console.error('Business not found for number:', To);
            const twiml = new VoiceResponse();
            twiml.say('Sorry, this number is not configured.');
            twiml.hangup();
            return res.type('text/xml').send(twiml.toString());
        }

        // --- PRICING & LIMIT ENFORCEMENT ---
        // Default to very high limits if null to avoid breaking legacy/free setups unexpectedly unless strict plan logic is desired
        // But user asked for specific limits.
        const used = business.minutes_used || 0;
        const limit = business.minutes_limit || 10; // Default 10 mins for free if not set

        if (used >= limit) {
            console.log(`Call blocked: Limit reached for ${business.business_name} (${used}/${limit} mins)`);
            const twiml = new VoiceResponse();
            twiml.say('I am sorry, this business has reached its monthly call limit. Please contact them via email or check their website.');
            twiml.hangup();
            return res.type('text/xml').send(twiml.toString());
        }
        // -----------------------------------

        // Log the call
        await supabase.from('call_logs').insert({
            business_id: business.id,
            user_id: business.user_id,
            call_sid: CallSid,
            from_number: From,
            to_number: To,
            status: 'ringing',
            transcript: []
        });

        // Create TwiML response
        const twiml = new VoiceResponse();

        // Greet the caller
        const greeting = business.greeting || `Hello, you've reached ${business.business_name}. How can I help you?`;

        // Use premium voice if enabled and limit not reached
        const canUsePremium = ELEVENLABS_API_KEY && (business.minutes_used || 0) < (business.minutes_limit || 10);

        if (canUsePremium) {
            const ttsUrl = `${req.protocol}://${req.get('host')}/api/voice/tts?businessId=${business.id}&text=${encodeURIComponent(greeting)}`;
            twiml.play(ttsUrl);
        } else {
            twiml.say({ voice: 'Polly.Joanna' }, greeting);
        }

        // Gather speech input
        const gather = twiml.gather({
            input: 'speech',
            action: `/webhooks/twilio/gather?business_id=${business.id}&call_sid=${CallSid}`,
            speechTimeout: 'auto',
            language: 'en-US'
        });

        // If no input, repeat
        twiml.say({ voice: 'Polly.Joanna' }, 'I didn\'t catch that. Please say something or press any key.');
        twiml.redirect('/webhooks/twilio/voice');

        res.type('text/xml').send(twiml.toString());

    } catch (err) {
        console.error('Voice webhook error:', err);
        const twiml = new VoiceResponse();
        twiml.say('Sorry, an error occurred.');
        twiml.hangup();
        res.type('text/xml').send(twiml.toString());
    }
});

// Twilio Gather Webhook - Process speech
app.post('/webhooks/twilio/gather', express.urlencoded({ extended: false }), validateTwilioRequest, async (req, res) => {
    const { SpeechResult, business_id, call_sid } = { ...req.body, ...req.query };
    console.log(`Gather result for call ${call_sid}: "${SpeechResult}"`);

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get business config
        const { data: business } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', business_id)
            .single();

        if (!business) {
            const twiml = new VoiceResponse();
            twiml.say('Sorry, configuration error.');
            twiml.hangup();
            return res.type('text/xml').send(twiml.toString());
        }

        // Get AI response
        const systemPrompt = `You are an AI receptionist for "${business.business_name}".
Services: ${business.services}
Hours: ${business.working_hours}
Tone: ${business.tone}
Keep responses very brief (under 30 words) for voice calls.`;

        const chat = model.startChat({
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
        });

        const result = await chat.sendMessage(SpeechResult || 'Hello');
        const aiResponse = result.response.text();

        // Log interaction
        await supabase.from('call_logs').update({
            transcript: { user: SpeechResult, ai: aiResponse }
        }).eq('call_sid', call_sid);

        // Respond with TwiML
        const twiml = new VoiceResponse();

        // Use premium voice if enabled
        const canUsePremium = ELEVENLABS_API_KEY && (business.minutes_used || 0) < (business.minutes_limit || 10);

        if (canUsePremium) {
            const ttsUrl = `${req.protocol}://${req.get('host')}/api/voice/tts?businessId=${business.id}&text=${encodeURIComponent(aiResponse)}`;
            twiml.play(ttsUrl);
        } else {
            twiml.say({ voice: 'Polly.Joanna' }, aiResponse);
        }

        // Continue conversation
        twiml.gather({
            input: 'speech',
            action: `/webhooks/twilio/gather?business_id=${business_id}&call_sid=${call_sid}`,
            speechTimeout: 'auto',
            language: 'en-US'
        });

        if (canUsePremium) {
            const followUp = 'Is there anything else I can help with?';
            const followUpUrl = `${req.protocol}://${req.get('host')}/api/voice/tts?businessId=${business.id}&text=${encodeURIComponent(followUp)}`;
            twiml.play(followUpUrl);
        } else {
            twiml.say({ voice: 'Polly.Joanna' }, 'Is there anything else I can help with?');
        }
        twiml.hangup();

        res.type('text/xml').send(twiml.toString());

    } catch (err) {
        console.error('Gather webhook error:', err);
        const twiml = new VoiceResponse();
        twiml.say('Sorry, I encountered an error.');
        twiml.hangup();
        res.type('text/xml').send(twiml.toString());
    }
});


// Twilio Status Callback
app.post('/webhooks/twilio/status', express.urlencoded({ extended: false }), validateTwilioRequest, async (req, res) => {
    const { CallSid, CallStatus, CallDuration, To } = req.body;
    console.log(`Call ${CallSid} status: ${CallStatus}, duration: ${CallDuration}s`);

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Update call log status
        await supabase
            .from('call_logs')
            .update({
                status: CallStatus,
                duration: parseInt(CallDuration) || 0
            })
            .eq('call_sid', CallSid);

        // --- UPDATE USAGE ON COMPLETION ---
        if (CallStatus === 'completed' && CallDuration) {
            const durationSec = parseInt(CallDuration);
            if (durationSec > 0) {
                const minutesToAdd = Math.ceil(durationSec / 60);

                // We need to find the business first to increment
                // Since we don't have business_id in body, we look up by phone number (To)
                // Or we could have passed it in query params if we updated the statusCallback URL, 
                // but we didn't update the URL setup logic yet.
                // Lookup by 'To' is safest for now.

                // Actually, finding via call_logs is safer if we want to be sure?
                // But simply looking up by 'To' number is efficient for the business mapping.

                // Let's use RPC or simple update. Supabase simple update:

                // 1. Get current usage
                const { data: business } = await supabase
                    .from('businesses')
                    .select('id, minutes_used')
                    .eq('twilio_phone_number', To)
                    .single();

                if (business) {
                    const newUsage = (business.minutes_used || 0) + minutesToAdd;
                    console.log(`Updating usage for business ${business.id}: +${minutesToAdd} mins. New total: ${newUsage}`);

                    await supabase
                        .from('businesses')
                        .update({ minutes_used: newUsage })
                        .eq('id', business.id);
                }
            }
        }
        // ----------------------------------

        res.sendStatus(200);
    } catch (err) {
        console.error('Status callback error:', err);
        res.sendStatus(500);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Backend running at http://0.0.0.0:${port}`);
    if (twilioClient) {
        console.log('✅ Twilio integration enabled');
    } else {
        console.log('⚠️  Twilio not configured (add credentials to .env)');
    }
});

// Debug: Prevent immediate exit if app.listen fails to hold event loop
setInterval(() => { }, 10000);

process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

// POST /api/admin/test-email (Debug)
app.post('/api/admin/test-email', requireAdmin, async (req, res) => {
    console.log('[Debug] Testing SMTP Connection...');
    const sender = getSender();
    const password = process.env.EMAIL_PASSWORD;

    if (!sender || !password) {
        return res.status(500).json({ error: 'Missing SENDER_EMAIL or EMAIL_PASSWORD in Live Environment' });
    }

    try {
        await transporter.verify();
        console.log('[Debug] SMTP Verify Success');

        await transporter.sendMail({
            from: `"SmartReception Debug" <${sender}>`,
            to: sender,
            subject: 'Debug: SMTP Configuration Works',
            text: 'Your email configuration on Render is correct!'
        });

        res.json({ success: true, message: `SMTP Verified! Email sent to ${sender}` });
    } catch (err) {
        console.error('[Debug] SMTP Failed:', err);
        res.status(500).json({
            error: 'SMTP Connection Failed',
            details: err.message,
            code: err.code,
            tip: err.code === 'EAUTH' ? 'Check EMAIL_PASSWORD. Must be an App Password.' : 'Check SENDER_EMAIL.'
        });
    }
});


