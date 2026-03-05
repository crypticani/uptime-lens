import fetch from 'node-fetch';

export async function checkDigitalOcean() {
    try {
        const res = await fetch('https://status.digitalocean.com/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description,
            url: 'https://status.digitalocean.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://status.digitalocean.com/' };
    }
}
