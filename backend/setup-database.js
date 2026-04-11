// Database Setup Script
// Run this once to create the database tables: npm run setup-db

const { query, pool } = require('./database');

async function setupDatabase() {
    try {
        console.log('🔄 Setting up database tables...');

        // Drop existing table if it has wrong structure (fixes "column does not exist" error)
        console.log('Checking existing table structure...');
        try {
            const tableExists = await query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'orders'
                )
            `);
            
            if (tableExists.rows[0].exists) {
                // Check if order_id column exists
                const columnCheck = await query(`
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'orders' AND column_name = 'order_id'
                `);
                
                if (columnCheck.rows.length === 0) {
                    console.log('⚠️  Table exists but missing order_id column. Dropping and recreating...');
                    await query('DROP TABLE IF EXISTS orders CASCADE');
                }
            }
        } catch (error) {
            console.log('Checking table structure:', error.message);
        }

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

        // Create index on order_id for faster lookups (only if column exists)
        await query(`
            CREATE INDEX IF NOT EXISTS idx_order_id ON orders(order_id)
        `);
        console.log('✅ Index created on order_id');

        // Create index on customer_email for faster lookups
        await query(`
            CREATE INDEX IF NOT EXISTS idx_customer_email ON orders(customer_email)
        `);
        console.log('✅ Index created on customer_email');

        // Create index on created_at for sorting
        await query(`
            CREATE INDEX IF NOT EXISTS idx_created_at ON orders(created_at DESC)
        `);
        console.log('✅ Index created on created_at');

        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run setup
setupDatabase().catch(err => {
    console.error('Setup failed:', err);
    process.exit(1);
});
