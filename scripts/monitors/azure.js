import fetch from 'node-fetch';

export async function checkAzure() {
    try {
        // Azure status RSS
        const res = await fetch('https://azure.microsoft.com/en-us/status/feed/');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const text = await res.text();
        let status = 'UP';
        let description = 'Azure Cloud services are responding.';

        if (text.includes('<item>')) {
            description = 'Azure reported recent events on their RSS feed.';
        }

        return { status, description };
    } catch (error) {
        return { status: 'DOWN', description: error.message };
    }
}
