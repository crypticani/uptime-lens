import fetch from 'node-fetch';

export async function checkMongoDB() {
    try {
        const res = await fetch('https://status.mongodb.com/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description,
            url: 'https://status.mongodb.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://status.mongodb.com/' };
    }
}
