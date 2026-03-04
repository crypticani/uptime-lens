import fetch from 'node-fetch';

export async function checkOCI() {
    try {
        // Oracle Cloud Infrastructure status page (HTML scraping or similar if no JSON available)
        // OCI has a status page at ocistatus.oraclecloud.com. 
        // Usually statuspage.io pages have an api/v2/status.json

        // We will attempt reaching the main HTML.
        const res = await fetch('https://ocistatus.oraclecloud.com/');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Simple check: if it loads, we assume it's up.
        return { status: 'UP', description: 'OCI services are responding.', url: 'https://ocistatus.oraclecloud.com/' };
    } catch (error) {
        return { status: 'DOWN', description: error.message, url: 'https://ocistatus.oraclecloud.com/' };
    }
}
