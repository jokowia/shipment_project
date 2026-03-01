import { fetch } from 'undici';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupWebhook() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        console.error("❌ Error: TELEGRAM_BOT_TOKEN is missing in .env.local");
        process.exit(1);
    }

    // Capture URL from command line arg
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("❌ Error: Please provide your HTTPS domain as an argument.");
        console.error("Usage: tsx scripts/set_telegram_webhook.ts https://your-ngrok-url.ngrok-free.app");
        process.exit(1);
    }

    let url = args[0];

    // Ensure URL has no trailing slash and append the webhook path
    url = url.replace(/\/$/, '') + '/api/telegram-webhook';

    console.log(`📡 Registering Telegram Webhook to: ${url}`);

    const apiUrl = `https://api.telegram.org/bot${token}/setWebhook`;

    try {
        const response: any = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url
            })
        });

        const data: any = await response.json();

        if (data.ok) {
            console.log("✅ Success! Telegram Webhook has been successfully set.");
            console.log(data.description);
        } else {
            console.error("❌ Failed to set webhook:", data.description);
        }
    } catch (e) {
        console.error("❌ Network Error:", e);
    }
}

setupWebhook();
