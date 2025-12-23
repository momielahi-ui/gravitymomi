import fetch from 'node-fetch';

const API_URL = 'https://gravitymomi.onrender.com/api';
const ADMIN_SECRET = 'admin123';

async function main() {
    console.log('Checking pending payments...');
    try {
        const res = await fetch(`${API_URL}/admin/payments`, {
            headers: { 'x-admin-secret': ADMIN_SECRET }
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

        const payments = await res.json();
        const pending = payments.filter(p => p.status === 'pending');

        if (pending.length === 0) {
            console.log('No pending payments found.');
            return;
        }

        console.log(`Found ${pending.length} pending requests.`);

        // Approve the most recent one
        const request = pending[0];
        console.log(`Approving request for ${request.amount} (Ref: ${request.payment_reference})...`);

        const approveRes = await fetch(`${API_URL}/admin/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-secret': ADMIN_SECRET
            },
            body: JSON.stringify({ requestId: request.id })
        });

        if (approveRes.ok) {
            console.log('✅ Payment Approved Successfully!');
        } else {
            console.error('❌ Approval Failed:', await approveRes.text());
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
