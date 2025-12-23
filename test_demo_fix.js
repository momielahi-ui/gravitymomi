import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Test demo mode
app.post('/api/chat', async (req, res) => {
    console.log('[Test] Received request. Config:', !!req.body?.config);
    try {
        const { message, config } = req.body;
        const isDemoMode = !!config;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        const systemPrompt = `You are an AI receptionist for "${config?.business_name || config?.name || 'Business'}".
Services: ${config?.services || 'General'}
Hours: ${config?.working_hours || config?.workingHours || '9-5'}
Tone: ${config?.tone || 'professional'}`;

        const chat = model.startChat({
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
        });

        const result = await chat.sendMessageStream(message);

        if (isDemoMode) {
            console.log('[Test] Demo mode: collecting JSON response');
            let fullResponse = '';
            for await (const chunk of result.stream) {
                fullResponse += chunk.text();
            }
            return res.json({ response: fullResponse });
        }

        // Streaming for authenticated
        res.setHeader('Content-Type', 'text/plain');
        for await (const chunk of result.stream) {
            res.write(chunk.text());
        }
        res.end();
    } catch (error) {
        console.error('Error:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
});

const port = 3002;
app.listen(port, () => {
    console.log(`\n✅ Test server running on http://localhost:${port}`);
    console.log('\n📝 Test with:');
    console.log('Invoke-WebRequest -Uri http://localhost:3002/api/chat -Method POST -Headers @{"Content-Type"="application/json"} -Body \'{"message": "What are your hours?", "config": {"name": "Test Shop", "services": "Consulting", "tone": "friendly", "workingHours": "9-5", "greeting": "Hi"}}\'');
});
