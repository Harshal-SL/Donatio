require('dotenv').config();
const app = require('./app');
const supabaseKeepAlive = require('./services/supabaseKeepAlive');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);

  // Start background keep-alive service for Supabase (every 3 days)
  if (process.env.ENABLE_SUPABASE_KEEP_ALIVE !== 'false') {
    supabaseKeepAlive.start();
  }
});

