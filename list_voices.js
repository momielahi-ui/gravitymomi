
import fetch from 'node-fetch';

const apiKey = process.env.ELEVENLABS_API_KEY;

async function listVoices() {
    if (!apiKey) {
        console.error('ELEVENLABS_API_KEY is not set');
        return;
    }

    try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            method: 'GET',
            headers: {
                'xi-api-key': apiKey
            }
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Failed to list voices:', err);
            return;
        }

        const data = await response.json();
        console.log('Available Voices:');
        data.voices.forEach(v => {
            console.log(`- ${v.name}: ${v.voice_id} (${v.category})`);
        });
    } catch (error) {
        console.error('Error fetching voices:', error);
    }
}

listVoices();
