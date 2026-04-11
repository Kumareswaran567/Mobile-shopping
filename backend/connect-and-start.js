// Automated Database Connection and Backend Startup Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 MobileHub Backend Setup & Connection');
console.log('========================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found. Creating from .env.example...');
    const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ .env file created. Please update DB_PASSWORD in .env file!\n');
}

// Load environment variables
require('dotenv').config();

// Test database connection
async function testDatabaseConnection() {
    console.log('📊 Testing database connection...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   User: ${process.env.DB_USER}\n`);
    
    try {
        const { query } = require('./database');
        await query('SELECT NOW()');
        console.log('✅ Database connection successful!\n');
        return true;
    } catch (error) {
        console.log('❌ Database connection failed!');
        console.log(`   Error: ${error.message}\n`);
        console.log('💡 Troubleshooting:');
        console.log('   1. Make sure PostgreSQL is running');
        console.log('   2. Check your credentials in .env file');
        console.log('   3. Create database: CREATE DATABASE mobilehub_db;\n');
        return false;
    }
}

// Setup database tables
async function setupDatabase() {
    console.log('🗄️  Setting up database tables...\n');
    try {
        const { query } = require('./database');
        
        // Create orders table
        await query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) UNIQUE NOT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                card_number_last4 VARCHAR(4),
                mobile_id INTEGER,
                mobile_brand VARCHAR(100),
                mobile_model VARCHAR(100),
                mobile_price DECIMAL(10, 2),
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Orders table created');
        
        // Create indexes
        await query(`CREATE INDEX IF NOT EXISTS idx_order_id ON orders(order_id)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_customer_email ON orders(customer_email)`);
        await query(`CREATE INDEX IF NOT EXISTS idx_created_at ON orders(created_at DESC)`);
        console.log('✅ Indexes created\n');
        
        return true;
    } catch (error) {
        console.log(`❌ Database setup failed: ${error.message}\n`);
        return false;
    }
}

// Start server
function startServer() {
    console.log('🚀 Starting backend server...\n');
    console.log(`   Server URL: http://localhost:${process.env.PORT || 3000}`);
    console.log(`   Health check: http://localhost:${process.env.PORT || 3000}/health`);
    console.log(`   Checkout API: http://localhost:${process.env.PORT || 3000}/api/checkout\n`);
    console.log('📝 Server is running. Press Ctrl+C to stop.\n');
    console.log('========================================\n');
    
    // Start the actual server
    require('./server.js');
}

// Main execution
async function main() {
    try {
        // Test database connection
        const dbConnected = await testDatabaseConnection();
        
        if (!dbConnected) {
            console.log('⚠️  Cannot proceed without database connection.');
            console.log('   Please fix database connection issues and run again.\n');
            process.exit(1);
        }
        
        // Setup database tables
        await setupDatabase();
        
        // Start server
        startServer();
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { testDatabaseConnection, setupDatabase };
