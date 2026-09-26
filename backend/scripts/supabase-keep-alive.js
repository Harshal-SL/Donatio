/**
 * Supabase Keep-Alive Script
 *
 * Executes a simple, lightweight read request against the Supabase database.
 * Supabase free projects pause after 7 days of inactivity.
 * Running this script resets the 7-day inactivity timer and keeps the database active.
 *
 * Usage:
 *   node backend/scripts/supabase-keep-alive.js
 */

const path = require('path');
const https = require('https');
const http = require('http');

// Try loading environment variables from backend/.env or root .env
try {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
} catch (e) {}

// Fallback to project defaults if env vars not provided
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xtalowxxymzlsyhajway.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_ANON_KEY || 
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWxvd3h4eW16bHN5aGFqd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDA1NzksImV4cCI6MjA3ODYxNjU3OX0.sdRHKbe2YO1DIsyviFVLHrSegLaJ-VD0ZRF86pni5J0';

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const req = client.request(parsedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data ? safeJsonParse(data) : null
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timed out after 15 seconds'));
    });

    req.end();
  });
}

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

async function runKeepAlive() {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log('='.repeat(60));
  console.log(`📡 [Supabase Keep-Alive] Starting keep-alive read request`);
  console.log(`⏰ Time: ${timestamp}`);
  console.log(`🌐 Target: ${SUPABASE_URL}`);
  console.log('='.repeat(60));

  // Table to query for keep-alive read
  const tables = ['organization_profiles', 'donation_needs', 'user_profiles'];
  let successful = false;

  for (const table of tables) {
    const queryUrl = `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=1`;
    console.log(`\n🔍 Performing read query on '${table}'...`);

    try {
      const response = await makeRequest(queryUrl, {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      });

      const durationMs = Date.now() - startTime;

      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log(`✅ Success! HTTP Status: ${response.statusCode} (${durationMs}ms)`);
        console.log(`📊 Sample data:`, Array.isArray(response.data) ? `[${response.data.length} records returned]` : response.data);
        console.log(`\n🎉 Supabase free tier inactivity timer successfully reset!`);
        console.log(`🔒 Project will remain active for at least 7 more days.`);
        successful = true;
        break;
      } else {
        console.warn(`⚠️ Table '${table}' returned status ${response.statusCode}:`, response.data);
      }
    } catch (err) {
      console.warn(`⚠️ Could not query '${table}': ${err.message}`);
    }
  }

  const totalDuration = Date.now() - startTime;
  console.log('\n' + '='.repeat(60));

  if (successful) {
    console.log(`✅ [Supabase Keep-Alive] Completed successfully in ${totalDuration}ms`);
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.error(`❌ [Supabase Keep-Alive] Failed to query any table in ${totalDuration}ms`);
    console.log('='.repeat(60) + '\n');
    process.exit(1);
  }
}

runKeepAlive();
