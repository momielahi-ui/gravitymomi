import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function main() {
    console.log('--- Checking Latest Payment Request ---');

    const { data, error } = await supabase
        .from('payment_requests')
        .select('id, created_at, email, status, payment_reference')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching request:', error);
        return;
    }

    if (!data) {
        console.log('No payment requests found.');
        return;
    }

    console.log('Latest Request Details:');
    console.log(`- ID: ${data.id}`);
    console.log(`- Date: ${new Date(data.created_at).toLocaleString()}`);
    console.log(`- Reference: ${data.payment_reference}`);
    console.log(`- Status: ${data.status}`);
    console.log(`- Email Stored: ${data.email ? data.email : '❌ NULL (Missing!)'}`);

    if (!data.email) {
        console.log('\n⚠️ DIAGNOSIS: The email field is empty!');
        console.log('This means this payment request was created BEFORE the email code was deployed.');
        console.log('SOLUTION: Please submit a NEW payment request from the Billing page, then approve that one.');
    } else {
        console.log('\n✅ Email is stored correctly.');
        console.log('If you did not receive it, the issue is likely your SENDER_EMAIL or EMAIL_PASSWORD credentials in Render.');
    }
}

main();
