import fetch from 'node-fetch';

export async function checkGitHub() {
    try {
        const res = await fetch('https://kctbh9vrtdwd.statuspage.io/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message };
    }
}
