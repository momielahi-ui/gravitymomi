// This script creates missing business records for users who have approved payments
// Run this ONCE to fix existing users, then the normal flow will work for new users

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixMissingBusinessRecords() {
    console.log('🔍 Finding approved payments without business records...\n');

    // Get all approved payment requests
    const { data: payments, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching payments:', error);
        return;
    }

    console.log(`Found ${payments.length} approved payments\n`);

    // Group by business_id to avoid duplicates
    const uniqueBusinessIds = [...new Set(payments.map(p => p.business_id))];

    console.log(`Unique business IDs: ${uniqueBusinessIds.length}\n`);

    for (const businessId of uniqueBusinessIds) {
        // Check if business record exists
        const { data: existing } = await supabase
            .from('businesses')
            .select('id')
            .eq('id', businessId)
            .single();

        if (existing) {
            console.log(`✅ Business ${businessId} already exists`);
            continue;
        }

        // Get the latest approved payment for this business
        const payment = payments.find(p => p.business_id === businessId && p.status === 'approved');

        if (!payment) {
            console.log(`⚠️  No approved payment found for ${businessId}`);
            continue;
        }

        console.log(`\n📝 Creating business record for ${businessId}...`);
        console.log(`   User ID: ${payment.user_id}`);
        console.log(`   Plan: ${payment.plan}`);
        console.log(`   Email: ${payment.email}`);

        // Determine minutes limit based on plan
        const limits = {
            'starter': 100,
            'growth': 500,
            'pro': 2000
        };
        const minutesLimit = limits[payment.plan] || 10;

        // Create the business record
        const { data: newBusiness, error: insertError } = await supabase
            .from('businesses')
            .insert({
                id: businessId,
                user_id: payment.user_id,
                business_name: payment.email?.split('@')[0] || 'My Business', // Use email prefix as temp name
                services: 'AI Receptionist Services',
                tone: 'professional and friendly',
                working_hours: '9 AM - 5 PM',
                subscription_plan: payment.plan,
                minutes_limit: minutesLimit,
                minutes_used: 0
            })
            .select()
            .single();

        if (insertError) {
            console.error(`   ❌ Error creating business:`, insertError.message);
        } else {
            console.log(`   ✅ Business created successfully!`);
            console.log(`   Plan: ${newBusiness.subscription_plan}`);
            console.log(`   Limit: ${newBusiness.minutes_limit} minutes`);
        }
    }

    console.log('\n✨ Done! All missing business records have been created.');
    console.log('Users can now log in and see their approved plans.');
}

fixMissingBusinessRecords();
