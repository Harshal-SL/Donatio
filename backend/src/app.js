const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const publicRoutes = require('./routes/publicRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Donate Connect API',
    version: '1.0.0'
  });
});

// Health check and Supabase keep-alive routes
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

app.use('/api/users', userRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/public', publicRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
