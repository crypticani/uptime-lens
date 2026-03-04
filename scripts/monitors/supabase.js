import fetch from 'node-fetch';

export async function checkSupabase() {
    try {
        // Supabase uses statuspage.io
        const res = await fetch('https://status.supabase.com/api/v2/status.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return {
            status: data.status.indicator === 'none' ? 'UP' : 'DEGRADED',
            description: data.status.description,
            url: 'https://status.supabase.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://status.supabase.com/' };
    }
}
