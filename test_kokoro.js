
import fetch from 'node-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:3002/api/voice/tts';

async function testKokoro() {
    console.log("Testing Kokoro-82M TTS via Server API...");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: "Mhm, let's see... I've got your request right here. Don't worry, I'll take care of it for you. Any other questions?"
            })
        });

        if (response.ok) {
            console.log("✅ Success! Received audio stream.");
            console.log("Content-Type:", response.headers.get('content-type'));

            // Save a snippet to verify it's not empty
            const buffer = await response.buffer();
            console.log(`Received ${buffer.length} bytes of audio data.`);
            fs.writeFileSync('api_test_audio.pcm', buffer);
            console.log("Saved to api_test_audio.pcm");
        } else {
            const err = await response.json().catch(() => ({ error: 'Unknown Error' }));
            console.error("❌ Failed:", response.status, err);
        }
    } catch (e) {
        console.error("❌ Connection Error:", e.message);
        console.log("Note: Make sure the server is running on port 3002.");
    }
}

testKokoro();
