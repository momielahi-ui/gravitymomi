import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY; // Fallback to Anon if Service Role missing (might hit RLS)

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRecentBusinesses() {
    console.log('Checking last 5 businesses...');

    const { data, error } = await supabase
        .from('businesses')
        .select('id, user_id, business_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching businesses:', error);
    } else {
        console.log('Recent Businesses:', data);
    }
}

checkRecentBusinesses();
