import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function main() {
    console.log('Checking schema...');

    // Check if column exists by trying to select it
    const { error } = await supabase.from('payment_requests').select('email').limit(1);

    if (!error) {
        console.log('Email column already exists.');
        return;
    }

    // If error, likely column missing. Run raw SQL (requires Editor usually, but we can try RPC or just tell user)
    // Supabase JS client cannot run DDL (alter table) unless via specific function.
    // So I will output the SQL for the user to run.
    console.log('SQL Required. Please run this in Supabase SQL Editor:');
    console.log('\nALTER TABLE payment_requests ADD COLUMN IF NOT EXISTS email text;\n');
}

main();
