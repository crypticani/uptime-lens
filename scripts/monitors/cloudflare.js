import fetch from 'node-fetch';

export async function checkCloudflare() {
    try {
        const res = await fetch('https://yh6f0r4529hb.statuspage.io/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description,
            url: 'https://www.cloudflarestatus.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://www.cloudflarestatus.com/' };
    }
}
