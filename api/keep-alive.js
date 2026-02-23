/**
 * Vercel Cron Job — Keep Render Backend Warm
 * 
 * Runs every 5 minutes to ping the Render backend so it never goes
 * into sleep mode (cold start). Configured via vercel.json crons.
 */
export default async function handler(req, res) {
    const RENDER_URL = 'https://gravitymomi.onrender.com/api/health';

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(RENDER_URL, { signal: controller.signal });
        clearTimeout(timeout);

        const data = await response.json();
        console.log('[Keep-Alive] Render backend pinged successfully:', data);

        return res.status(200).json({
            ok: true,
            timestamp: new Date().toISOString(),
            renderStatus: data
        });
    } catch (err) {
        console.error('[Keep-Alive] Failed to ping Render backend:', err.message);
        return res.status(500).json({
            ok: false,
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
}
