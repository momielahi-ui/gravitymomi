
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_URL = 'http://localhost:3002/api';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

async function main() {
    console.log('--- Starting Payment Verification ---');

    // 1. Setup Supabase
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    // 2. Auth User
    const email = `test.payment.${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Creating user: ${email}`);
    let { data: { user, session }, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.log('SignUp error, trying login...');
        const res = await supabase.auth.signInWithPassword({ email, password });
        user = res.data.user;
        session = res.data.session;
    }

    if (!session) {
        console.error('Failed to get session');
        process.exit(1);
    }

    const token = session.access_token;
    console.log('User Authenticated.');

    // 3. Create Business (needed for payment)
    const { data: business, error: bizError } = await supabase
        .from('businesses')
        .insert({ user_id: user.id, business_name: 'Test Biz', services: 'Tech', tone: 'professional', greeting: 'Hi' })
        .select()
        .single();

    if (bizError) {
        console.error('Business Creation Error:', bizError);
        process.exit(1);
    }
    console.log(`Business Created: ${business.id}`);

    // 4. Submit Payment Request
    console.log('Submitting Payment...');
    const payRes = await fetch(`${API_URL}/billing/pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            businessId: business.id,
            plan: 'starter',
            amount: 29,
            paymentMethod: 'payoneer',
            reference: 'TEST-SCRIPT-REF'
        })
    });

    if (!payRes.ok) {
        console.error('Payment Submission Failed:', await payRes.text());
        process.exit(1);
    }
    console.log('Payment Request Submitted.');

    // 5. Admin List Payments
    console.log('Admin: Listing Payments...');
    const listRes = await fetch(`${API_URL}/admin/payments`, {
        headers: { 'x-admin-secret': ADMIN_SECRET }
    });

    const payments = await listRes.json();
    const myPayment = payments.find(p => p.payment_reference === 'TEST-SCRIPT-REF');

    if (!myPayment) {
        console.error('Payment not found in Admin List');
        process.exit(1);
    }
    console.log(`Found Payment ID: ${myPayment.id}, Status: ${myPayment.status}`);

    // 6. Admin Approve
    console.log('Admin: Approving Payment...');
    const approveRes = await fetch(`${API_URL}/admin/approve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': ADMIN_SECRET
        },
        body: JSON.stringify({ requestId: myPayment.id })
    });

    if (!approveRes.ok) {
        console.error('Approval Failed:', await approveRes.text());
        process.exit(1);
    }
    console.log('Payment Approved.');

    // 7. Verify Status
    const { data: updatedReq } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('id', myPayment.id)
        .single();

    console.log(`Final Payment Status: ${updatedReq.status}`);

    // 8. Verify Business Update
    const { data: updatedBiz } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', business.id)
        .single();

    console.log(`Business Plan: ${updatedBiz.subscription_plan}, Minutes Limit: ${updatedBiz.minutes_limit}`);

    if (updatedBiz.subscription_plan === 'starter' && updatedBiz.minutes_limit === 100) {
        console.log('✅ VERIFICATION SUCCESSFUL');
    } else {
        console.error('❌ VERIFICATION FAILED: Business not updated correctly');
        process.exit(1);
    }
}

main().catch(err => console.error(err));
