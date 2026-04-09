import { loadData, saveData, sendTelegramAlert } from './utils.js';
import { checkAWS } from './monitors/aws.js';
import { checkAzure } from './monitors/azure.js';
import { checkGCP } from './monitors/gcp.js';
import { checkOCI } from './monitors/oci.js';
import { checkSupabase } from './monitors/supabase.js';
import { checkGitHub } from './monitors/github.js';
import { checkCloudflare } from './monitors/cloudflare.js';
import { checkVercel } from './monitors/vercel.js';
import { checkNetlify } from './monitors/netlify.js';
import { checkAtlassian } from './monitors/atlassian.js';
import { checkNpm } from './monitors/npm.js';
import { checkTwilio } from './monitors/twilio.js';
import { checkDigitalOcean } from './monitors/digitalocean.js';
import { checkPyPI } from './monitors/pypi.js';
import { checkDockerHub } from './monitors/dockerhub.js';
import { checkFirebase } from './monitors/firebase.js';
import { checkSendGrid } from './monitors/sendgrid.js';
import { checkMongoDB } from './monitors/mongodb.js';
import { checkClaude } from './monitors/claude.js';

const monitors = {
    AWS: checkAWS,
    Azure: checkAzure,
    GCP: checkGCP,
    OCI: checkOCI,
    Supabase: checkSupabase,
    GitHub: checkGitHub,
    Cloudflare: checkCloudflare,
    Vercel: checkVercel,
    Netlify: checkNetlify,
    Atlassian: checkAtlassian,
    npm: checkNpm,
    Twilio: checkTwilio,
    DigitalOcean: checkDigitalOcean,
    PyPI: checkPyPI,
    DockerHub: checkDockerHub,
    Firebase: checkFirebase,
    SendGrid: checkSendGrid,
    'MongoDB Atlas': checkMongoDB,
    Claude: checkClaude
};

async function runAllChecks() {
    console.log('Starting uptime checks...');

    // Load previous status history
    let statusData = await loadData();
    let hasChanges = false;

    const now = new Date().toISOString();

    for (const [provider, checkFunc] of Object.entries(monitors)) {
        console.log(`Checking ${provider}...`);
        try {
            const result = await checkFunc();
            const currentStatus = result.status;

            // Initialize if not present
            if (!statusData[provider]) {
                statusData[provider] = {
                    status: currentStatus,
                    description: result.description,
                    url: result.url || '',
                    history: [],
                    lastChecked: now
                };
                hasChanges = true;

                // Alert if a newly added service is already degraded or down
                if (currentStatus !== 'UP') {
                    console.log(`[ALERT] ${provider} detected as ${currentStatus} on first check`);
                    await sendTelegramAlert(`🚨 Uptime Lens Alert 🚨\n\nProvider: ${provider}\nStatus: ${currentStatus}\nDetails: ${result.description}`);
                }
            }

            const previousStatus = statusData[provider].status;

            // If status changed, send alert and record history
            if (previousStatus !== currentStatus) {
                console.log(`[ALERT] ${provider} changed from ${previousStatus} to ${currentStatus}`);

                await sendTelegramAlert(`🚨 Uptime Lens Alert 🚨\n\nProvider: ${provider}\nStatus: ${previousStatus} ➡️ ${currentStatus}\nDetails: ${result.description}`);

                statusData[provider].history.unshift({
                    status: currentStatus,
                    timestamp: now,
                    description: result.description
                });

                // Keep only last 100 history items to prevent file bloat
                if (statusData[provider].history.length > 100) {
                    statusData[provider].history.pop();
                }

                hasChanges = true;
            }

            // Update current status & timestamp regardless
            statusData[provider].status = currentStatus;
            statusData[provider].description = result.description;
            statusData[provider].url = result.url || '';
            statusData[provider].lastChecked = now;

        } catch (error) {
            console.error(`Error checking ${provider}:`, error);
        }
    }

    // Save the updated JSON so the frontend / next run has it
    await saveData(statusData);
    if (hasChanges) {
        console.log('Detected changes. status.json has been updated.');
    } else {
        console.log('No status changes detected.');
    }
}

runAllChecks()
    .then(() => console.log('Finished uptime checks.'))
    .catch(err => console.error('Monitor run failed:', err));
