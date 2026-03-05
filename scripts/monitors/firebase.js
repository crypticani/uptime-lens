import fetch from 'node-fetch';

export async function checkFirebase() {
    try {
        const res = await fetch('https://status.firebase.google.com/incidents.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const incidents = await res.json();

        // An active incident has no 'end' field or its most recent update status is not 'AVAILABLE'
        const activeIncidents = incidents.filter(incident => {
            if (!incident.end) return true;
            const recentStatus = incident.most_recent_update?.status;
            return recentStatus === 'SERVICE_OUTAGE' || recentStatus === 'SERVICE_DISRUPTION';
        });

        if (activeIncidents.length > 0) {
            const latest = activeIncidents[0];
            return {
                status: 'DEGRADED',
                description: latest.external_desc || 'Active incident detected',
                url: 'https://status.firebase.google.com/'
            };
        }

        return {
            status: 'UP',
            description: 'All Firebase services are operating normally.',
            url: 'https://status.firebase.google.com/'
        };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://status.firebase.google.com/' };
    }
}
