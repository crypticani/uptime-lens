# Uptime Lens

A highly-customizable, free-to-host static status page and monitoring system built with **Node.js**, **GitHub Actions**, and a **Vanilla HTML/CSS/JS frontend**.

Uptime Lens checks the status of your core cloud and developer services every 10 minutes and automatically sends a Telegram alert the moment an outage or degradation is detected. The beautiful front-end dashboard updates automatically by fetching the latest status data.

![Uptime Lens Banner](https://via.placeholder.com/1000x300/0a0a0c/ffffff?text=Uptime+Lens)

## 🌟 Features

- **Cost-Free Hosting**: Uses GitHub Actions to run the periodic monitoring scripts and GitHub Pages to host the beautiful frontend dashboard for $0/month.
- **Instant Telegram Alerts**: Be the first to know when a service goes down via instant push notifications to your Telegram channel.
- **Premium UI**: The status dashboard features a modern, dark-mode, glassmorphism design with responsive skeleton loaders and smooth micro-animations.
- **Historical Data**: Maintains a history of up to 100 recent status changes per service.
- **Modular Monitors**: Adding a new service checker takes only a few lines of code in the `scripts/monitors` folder.

## 🔍 Supported Services (Built-in)

- AWS
- Azure
- Google Cloud Platform (GCP)
- Oracle Cloud Infrastructure (OCI)
- Supabase
- GitHub 
- GitLab

## 🚀 Quick Start Guide

### 1. Set up your Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the Prompts to get your **Bot Token**.
3. Create a **New Telegram Channel** for your alerts.
4. Add your newly created Bot as an Administrator in your given Channel.
5. Get your **Channel ID** (it typically looks like `-100...`).

### 2. Fork or Clone the Repository

Create a new GitHub Repository for your status page and copy these files into it.

```bash
git clone https://github.com/your-username/uptime-lens.git
cd uptime-lens
npm install
```

### 3. Configure GitHub Secrets

Go to your repository settings on GitHub -> **Secrets and variables** -> **Actions**. 

Add the following **Repository Secrets**:
- `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather.
- `TELEGRAM_CHAT_ID`: The ID of your Telegram Channel.

### 4. Enable GitHub Pages

Go to your repository settings -> **Pages**.
Under "**Build and deployment**", change the **Source** to **GitHub Actions**.

### 5. Start the Engine!

Push your repository. The GitHub Actions workflows will automatically trigger:
1. `uptime.yml` will run the first check, populate your `data/status.json` file, and commit/push the status history back to your repository.
2. `pages.yml` will deploy your live beautiful status dashboard.

## 🛠️ Local Development

If you want to test or add new monitors locally, use the `.env` file.

```bash
# 1. Rename .env.example to .env
cp .env.example .env

# 2. Add your Telegram credentials to .env
# TELEGRAM_BOT_TOKEN=12345:xxxxxx
# TELEGRAM_CHAT_ID=-100xxxxxx

# 3. Run the monitor script
node scripts/monitor.js
```

## 🧩 Adding a New Monitor

1. Create a new file in `scripts/monitors/my_service.js` that exports a check function returning an object with `status` (UP, DEGRADED, DOWN) and a `description`.
2. Import your module in `scripts/monitor.js`.
3. Add it to the `monitors` object.

## 📄 License
[GNU General Public License v3.0](LICENSE)
