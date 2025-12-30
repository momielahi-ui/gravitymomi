import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserPlan() {
    // Get all businesses and their subscription plans
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('id, user_id, business_name, subscription_plan, minutes_limit, minutes_used')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching businesses:', error);
        return;
    }

    console.log('\n=== Current Business Plans ===\n');
    businesses.forEach(b => {
        console.log(`Business: ${b.business_name}`);
        console.log(`  ID: ${b.id}`);
        console.log(`  User ID: ${b.user_id}`);
        console.log(`  Plan: ${b.subscription_plan || 'NOT SET (defaults to free)'}`);
        console.log(`  Minutes: ${b.minutes_used || 0}/${b.minutes_limit || 10}`);
        console.log('---');
    });

    // Also check payment requests
    const { data: payments } = await supabase
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    console.log('\n=== Recent Payment Requests ===\n');
    payments?.forEach(p => {
        console.log(`Plan: ${p.plan}`);
        console.log(`  Status: ${p.status}`);
        console.log(`  Business ID: ${p.business_id}`);
        console.log(`  Created: ${p.created_at}`);
        console.log('---');
    });
}

checkUserPlan();
