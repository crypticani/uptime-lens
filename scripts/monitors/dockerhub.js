import fetch from 'node-fetch';

export async function checkDockerHub() {
    try {
        // Docker Hub uses status.io (not statuspage.io); page ID: 533c6539221ae15e3f000031
        const res = await fetch('https://api.status.io/1.0/status/533c6539221ae15e3f000031');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const overall = data.result?.status_overall;
        const isUp = overall?.status_code === 100; // 100 = Operational

        return {
            status: isUp ? 'UP' : 'DEGRADED',
            description: overall?.status || 'Unknown',
            url: 'https://www.dockerstatus.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://www.dockerstatus.com/' };
    }
}
