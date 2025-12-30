
async function probeSetup() {
    console.log("Probing https://gravitymomi.onrender.com/api/setup...");
    try {
        const res = await fetch('https://gravitymomi.onrender.com/api/setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: "probe" }) // payload doesn't matter for 404 check, but auth is needed for 401 vs 404
        });

        console.log(`Status: ${res.status}`);
        // If 401, the route exists (auth middleware caught it).
        // If 404, the route does not exist.
        // If 200/500, it exists.

        const text = await res.text();
        console.log(`Body: ${text}`);

    } catch (e) {
        console.error("Error:", e);
    }
}

probeSetup();
