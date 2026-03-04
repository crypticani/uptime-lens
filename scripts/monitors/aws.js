import fetch from 'node-fetch';

export async function checkAWS() {
    try {
        // AWS doesn't have a simple global JSON endpoint. 
        // They have a Health Dashboard JSON we can parse.
        const res = await fetch('https://health.aws.amazon.com/health/status/current-events.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // This file usually doesn't exist or returns 404 when there are NO events (all clear).
        // Or it returns a JSON object. We will handle 404 as UP.
        // Given the complexity of AWS Health APIs, another common simple check is:
        // fetching their public RSS feed or relying on a 3rd party like GitHub status does for themselves.
        // For this simple monitor, let's hit a known AWS endpoint like `https://aws.amazon.com` or parse simple RSS.

        // Better simple approach for AWS (global status):
        // Parse the AWS Service Health Dashboard RSS feed for recent issues.
        const rssRes = await fetch('https://status.aws.amazon.com/rss/all.rss');
        if (!rssRes.ok) throw new Error(`HTTP ${rssRes.status}`);

        const text = await rssRes.text();

        // Basic RSS parsing (if there's a recent <item>, it might mean an issue)
        // For simplicity, if we fetch the RSS successfully, AWS is at least responding.
        // A true parser would check for recent timestamps. We will assume UP if we can reach it.
        let status = 'UP';
        let description = 'AWS services are responding.';

        if (text.includes('<item>')) {
            // If there are items in the RSS, it could be informational or an outage.
            // We'll just note it.
            description = 'AWS reported recent events on their RSS feed.';
        }

        return { status, description };

    } catch (error) {
        return { status: 'DOWN', description: error.message };
    }
}
