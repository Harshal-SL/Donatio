# Supabase Free Tier Keep-Alive Solution

## Overview
Supabase automatically pauses projects on the Free tier after **7 consecutive days of inactivity** (no API requests, direct database queries, or dashboard logins). 

To prevent this from happening, a complete keep-alive mechanism has been implemented that executes a lightweight read query (`organization_profiles` / `donation_needs`) **every 3 days**.

---

## 🛠️ What Was Implemented

### 1. GitHub Actions Automated Scheduled Workflow (Recommended)
📁 File: [`.github/workflows/supabase-keep-alive.yml`](file:///.github/workflows/supabase-keep-alive.yml)
- **Schedule**: Runs automatically every 3 days at `00:00 UTC` (`cron: '0 0 */3 * *'`).
- **Completely Independent**: Runs on GitHub's free runners in the cloud. It works **even if the Render backend server is sleeping or spun down**.
- **Manual Trigger**: Can be manually triggered at any time from the GitHub repository (`Actions` tab > `Supabase Keep-Alive` > `Run workflow`).

### 2. Standalone Node.js Keep-Alive Script
📁 File: [`backend/scripts/supabase-keep-alive.js`](file:///backend/scripts/supabase-keep-alive.js)
- Executes an HTTPS read request directly to Supabase REST API PostgREST endpoint.
- Zero extra dependencies required (uses built-in `https` module).
- Checks multiple tables (`organization_profiles`, `donation_needs`, `user_profiles`) with automatic fallback.
- Run anytime locally or in CI/CD:
  ```bash
  cd backend
  npm run supabase:ping
  ```

### 3. Backend Health & Keep-Alive Routes
📁 File: [`backend/src/routes/healthRoutes.js`](file:///backend/src/routes/healthRoutes.js)
Mounted at:
- `GET /health` or `GET /api/health` — Returns basic server health, uptime, and last Supabase ping stats.
- `GET /health/supabase` or `GET /api/health/supabase` — Executes an on-demand read request to Supabase, returning live latency (in ms) and resetting the 7-day inactivity timer immediately.
- `GET /health/status` — Returns keep-alive service schedule and diagnostic metrics.

### 4. Background In-Process Keep-Alive Service
📁 File: [`backend/src/services/supabaseKeepAlive.js`](file:///backend/src/services/supabaseKeepAlive.js)
- When the backend server is running, this service runs in the background.
- It triggers an initial ping 5 seconds after server startup.
- It runs a recurring ping every 72 hours (3 days) automatically.
- Can be customized via environment variable `SUPABASE_PING_INTERVAL_HOURS` (default: `72`).

---

## 🚀 How to Test & Verify

### Option A: Via Terminal (Local Test)
```bash
cd backend
npm run supabase:ping
```
Expected output:
```text
============================================================
📡 [Supabase Keep-Alive] Starting keep-alive read request
⏰ Time: 2026-09-26T...
🌐 Target: https://xtalowxxymzlsyhajway.supabase.co
============================================================

🔍 Performing read query on 'organization_profiles'...
✅ Success! HTTP Status: 200 (150ms)
📊 Sample data: [1 records returned]

🎉 Supabase free tier inactivity timer successfully reset!
🔒 Project will remain active for at least 7 more days.

============================================================
✅ [Supabase Keep-Alive] Completed successfully in 150ms
============================================================
```

### Option B: Via Backend API Endpoint
Start the backend and visit:
```
http://localhost:8080/api/health/supabase
```
Expected JSON response:
```json
{
  "success": true,
  "status": "healthy",
  "service": "supabase",
  "message": "Supabase read request completed successfully. Inactivity timer reset.",
  "durationMs": 54,
  "timestamp": "2026-09-26T14:10:00.000Z",
  "totalPings": 1
}
```

### Option C: Via GitHub Actions
1. Push your code to GitHub.
2. Go to the **Actions** tab on your GitHub repository.
3. Select **Supabase Keep-Alive** on the left sidebar.
4. Click **Run workflow**.

---

## ⚙️ Optional Environment Variables & GitHub Secrets

The script and GitHub Action already include fallbacks to your project URL. To use custom or environment-specific values, configure:

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | `https://xtalowxxymzlsyhajway.supabase.co` |
| `SUPABASE_ANON_KEY` | Public Anon API Key | (configured in repository) |
| `SUPABASE_PING_INTERVAL_HOURS` | In-process service ping frequency | `72` (every 3 days) |
| `ENABLE_SUPABASE_KEEP_ALIVE` | Enable/disable in-process service | `true` |
