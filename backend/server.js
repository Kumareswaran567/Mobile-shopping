// Express Server with PostgreSQL
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const checkoutRoutes = require('./routes/checkout');
const ordersRoutes = require('./routes/orders');
const { query } = require('./database');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware - Allow all origins including file:// (Chrome) to fix "failed to fetch"
app.use(cors({
    origin: function(origin, callback) {
        callback(null, true); // Allow any origin: file://, null, localhost, etc.
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Test database connection
        await query('SELECT NOW()');
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// API Routes
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🛒 Checkout API: http://localhost:${PORT}/api/checkout`);
    console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
});
