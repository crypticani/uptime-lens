import fetch from 'node-fetch';

export async function checkNpm() {
    try {
        const res = await fetch('https://status.npmjs.org/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description,
            url: 'https://status.npmjs.org/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://status.npmjs.org/' };
    }
}
