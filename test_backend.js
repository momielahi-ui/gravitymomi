
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api/chat';

async function testChat() {
    const payload = {
        message: "Hello, this is a test.",
        history: [],
        config: {
            business_name: "Test Biz",
            services: "Testing",
            tone: "friendly",
            working_hours: "9-5"
        }
    };

    console.log("Sending payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            console.error("Response error:", await response.text());
            return;
        }

        // Read stream
        const reader = response.body;
        // node-fetch returns a standard node stream

        reader.on('data', (chunk) => {
            console.log("Received chunk:", chunk.toString());
        });

        reader.on('end', () => {
            console.log("Stream ended.");
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testChat();
