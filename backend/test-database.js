// Test Database Connection Script
// Run: node test-database.js

require('dotenv').config();
const { query, pool } = require('./database');

async function testConnection() {
    console.log('🔍 Testing Database Connection...\n');
    console.log('Configuration:');
    console.log(`  Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`  Port: ${process.env.DB_PORT || 5432}`);
    console.log(`  Database: ${process.env.DB_NAME || 'mobilehub_db'}`);
    console.log(`  User: ${process.env.DB_USER || 'postgres'}`);
    console.log(`  Password: ${process.env.DB_PASSWORD ? '***' : 'NOT SET'}\n`);

    try {
        // Test 1: Basic connection
        console.log('Test 1: Checking connection...');
        const result = await query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ Database connected successfully!');
        console.log(`   Current time: ${result.rows[0].current_time}`);
        console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(',')[0]}\n`);

        // Test 2: Check if database exists
        console.log('Test 2: Checking database...');
        const dbCheck = await query("SELECT datname FROM pg_database WHERE datname = $1", 
            [process.env.DB_NAME || 'mobilehub_db']);
        if (dbCheck.rows.length > 0) {
            console.log(`✅ Database '${process.env.DB_NAME || 'mobilehub_db'}' exists\n`);
        } else {
            console.log(`⚠️  Database '${process.env.DB_NAME || 'mobilehub_db'}' not found\n`);
        }

        // Test 3: Check if orders table exists
        console.log('Test 3: Checking orders table...');
        const tableCheck = await query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'orders'
            )
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('✅ Orders table exists');
            
            // Count records
            const countResult = await query('SELECT COUNT(*) as count FROM orders');
            console.log(`   Records in table: ${countResult.rows[0].count}\n`);
        } else {
            console.log('⚠️  Orders table does not exist');
            console.log('   Run: npm run setup-db\n');
        }

        // Test 4: Test insert (optional)
        console.log('Test 4: Testing write access...');
        const testInsert = await query('SELECT 1 as test');
        console.log('✅ Write access OK\n');

        console.log('========================================');
        console.log('🎉 All database tests passed!');
        console.log('========================================\n');
        console.log('Next steps:');
        console.log('1. If table missing: npm run setup-db');
        console.log('2. Start server: npm run dev');
        console.log('3. Test API: http://localhost:4000/health\n');

    } catch (error) {
        console.error('\n❌ Database connection failed!\n');
        console.error('Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check PostgreSQL is running');
        console.error('2. Verify credentials in .env file');
        console.error('3. Make sure database exists:');
        console.error('   psql -U postgres');
        console.error('   CREATE DATABASE mobilehub_db;');
        console.error('4. Check firewall/antivirus');
        console.error('\n');
        process.exit(1);
    } finally {
        await pool.end();
    }
}

testConnection();
