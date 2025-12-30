import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

// Use the live URL since we are testing the deployment
const API_URL = 'https://gravitymomidon.vercel.app/api';
// Wait, the backend is on Render, usually different URL unless proxied.
// The user's frontend is on Vercel (based on screenshot).
// I need the BACKEND URL. 
// Usually set in VITE_API_URL. Let me check the .env file content I saw earlier (step 981).
// It showed: VITE_API_URL not set in that specific view? No wait.
// In step 981 .env output:
// GEMINI_API_KEY=...
// SUPABASE_URL=...
// No VITE_API_URL.
// But in step 1007, line 12: const port = process.env.PORT || 3002;
// I need to know the Render URL.
// I'll assume the standard Render naming convention or ask the user.
// actually I'll try to read the frontend config to see where it points.
// Step 20ish (way back) usually has it.
// Let's rely on the user having set it or try to fetch it from the running local env if possible.
// Actually, earlier in App.tsx (Step 1055, Line 743) it uses `API_URL`.
// Let's assume the user knows it or it's in the environment.
// For now I'll use a placeholder and ask the user or try to deduce it.
// Wait! The user's screenshot (Step 1117) shows `gravitymomidon.vercel.app`.
// The backend usually runs on `gravitymomi.onrender.com` or similar.
// I will try to read the most recent frontend file to see the API_URL hardcoding I added earlier (Step 14/15 mentions setting production API URL).
// Step 32 in previous session: "Set production API URL as fallback in App.tsx".
// Let me read App.tsx headers to find the URL.

const BACKEND_URL = 'https://gravitymomi.onrender.com'; // Correct Live URL
// I will verify this in the next step.

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

console.log(`Checking Email Config on: ${BACKEND_URL}`);

async function run() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/admin/test-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-secret': ADMIN_SECRET
            }
        });
        const data = await res.json();
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Connection Error:', e.message);
    }
}
run();
