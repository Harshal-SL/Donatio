const { supabase, supabaseAdmin } = require('../config/supabase');

class SupabaseKeepAliveService {
  constructor() {
    this.timer = null;
    this.lastPing = null;
    this.lastError = null;
    this.totalPings = 0;
    // Default: 3 days (72 hours) in milliseconds
    const hours = parseFloat(process.env.SUPABASE_PING_INTERVAL_HOURS) || 72;
    this.intervalMs = hours * 60 * 60 * 1000;
  }

  /**
   * Executes a lightweight read request to Supabase to prevent project pausing
   */
  async ping() {
    const startTime = Date.now();
    try {
      const client = supabaseAdmin || supabase;
      if (!client) {
        throw new Error('Supabase client is not initialized');
      }

      // Perform a minimal read query on organization_profiles
      let { data, error } = await client
        .from('organization_profiles')
        .select('id')
        .limit(1);

      // Fallback query if organization_profiles has RLS restrictions
      if (error) {
        const fallback = await client
          .from('donation_needs')
          .select('id')
          .limit(1);

        if (fallback.error) {
          throw error;
        }
        data = fallback.data;
      }

      const durationMs = Date.now() - startTime;
      const timestamp = new Date().toISOString();

      this.lastPing = {
        timestamp,
        durationMs,
        success: true
      };
      this.lastError = null;
      this.totalPings++;

      console.log(`[Supabase Keep-Alive] ✅ Read query successful (${durationMs}ms) at ${timestamp}. Total pings: ${this.totalPings}`);
      return { 
        success: true, 
        durationMs, 
        timestamp, 
        totalPings: this.totalPings 
      };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const timestamp = new Date().toISOString();

      this.lastError = {
        timestamp,
        error: err.message,
        durationMs
      };
      console.error(`[Supabase Keep-Alive] ❌ Read query failed (${durationMs}ms):`, err.message);
      return { 
        success: false, 
        error: err.message, 
        durationMs,
        timestamp 
      };
    }
  }

  /**
   * Starts the recurring keep-alive interval (runs every 3 days)
   */
  start() {
    if (this.timer) {
      return;
    }

    const intervalHours = this.intervalMs / (1000 * 60 * 60);
    console.log(`[Supabase Keep-Alive] 🚀 Service started. Schedule: every ${intervalHours}h (${intervalHours / 24} days).`);

    // Initial ping 5 seconds after server startup to verify connection
    setTimeout(() => {
      this.ping();
    }, 5000);

    // Setup recurring interval every 3 days
    this.timer = setInterval(() => {
      this.ping();
    }, this.intervalMs);

    if (this.timer.unref) {
      this.timer.unref();
    }
  }

  /**
   * Stops the keep-alive service
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[Supabase Keep-Alive] 🛑 Service stopped.');
    }
  }

  /**
   * Returns current keep-alive stats
   */
  getStatus() {
    const intervalHours = this.intervalMs / (1000 * 60 * 60);
    return {
      running: !!this.timer,
      intervalHours,
      intervalDays: intervalHours / 24,
      totalPings: this.totalPings,
      lastPing: this.lastPing,
      lastError: this.lastError
    };
  }
}

const instance = new SupabaseKeepAliveService();
module.exports = instance;
