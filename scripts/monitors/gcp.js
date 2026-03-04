import fetch from 'node-fetch';

export async function checkGCP() {
    try {
        // GCP status JSON
        const res = await fetch('https://status.cloud.google.com/incidents.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        let status = 'UP';
        let description = 'GCP services are UP.';

        if (data && data.length > 0) {
            // Get the most recent unresolved incident if any
            const ongoing = data.find(inc => !inc.end);
            if (ongoing) {
                status = 'DEGRADED';
                description = ongoing.external_desc || 'GCP is experiencing ongoing issues.';
            }
        }

        return { status, description };
    } catch (error) {
        return { status: 'DOWN', description: error.message };
    }
}
