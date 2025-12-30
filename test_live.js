
// Native fetch is available in Node 18+
async function testBackend() {
    console.log("Testing https://gravitymomi.onrender.com/api/chat...");
    try {
        const res = await fetch('https://gravitymomi.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: "val" })
        });

        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

testBackend();
