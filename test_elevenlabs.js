import fetch from 'node-fetch';

const API_URL = 'http://localhost:3002/api'; // Change to your live URL if testing remote

async function testTTS() {
    console.log("Testing ElevenLabs TTS Proxy...");

    try {
        const response = await fetch(`${API_URL}/voice/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: "Hello! This is a test of the natural AI voice system.",
                isDemo: true
            })
        });

        if (response.ok) {
            console.log("✅ Success! Received audio stream.");
            console.log("Content-Type:", response.headers.get('content-type'));
        } else {
            const err = await response.json().catch(() => ({ error: 'Unknown Error' }));
            console.error("❌ Failed:", response.status, err);
            if (response.status === 503) {
                console.log("Tip: Ensure ELEVENLABS_API_KEY is set in your environment.");
            }
        }
    } catch (e) {
        console.error("❌ Connection Error:", e.message);
    }
}

testTTS();
