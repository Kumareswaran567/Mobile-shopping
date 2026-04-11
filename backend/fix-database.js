// Fix Database - Drop and recreate table with correct structure
const { query, pool } = require('./database');

async function fixDatabase() {
    try {
        console.log('🔧 Fixing database structure...\n');

        // Drop existing table if it exists (to recreate with correct structure)
        console.log('Step 1: Dropping existing orders table (if exists)...');
        try {
            await query('DROP TABLE IF EXISTS orders CASCADE');
            console.log('✅ Old table dropped\n');
        } catch (error) {
            console.log('⚠️  Could not drop table (might not exist):', error.message);
        }

        // Create orders table with correct structure
        console.log('Step 2: Creating orders table with correct structure...');
        await query(`
            CREATE TABLE orders (
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
        console.log('✅ Orders table created with correct structure\n');

        // Create indexes
        console.log('Step 3: Creating indexes...');
        await query(`CREATE INDEX idx_order_id ON orders(order_id)`);
        console.log('✅ Index created on order_id');

        await query(`CREATE INDEX idx_customer_email ON orders(customer_email)`);
        console.log('✅ Index created on customer_email');

        await query(`CREATE INDEX idx_created_at ON orders(created_at DESC)`);
        console.log('✅ Index created on created_at\n');

        // Verify table structure
        console.log('Step 4: Verifying table structure...');
        const columns = await query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'orders'
            ORDER BY ordinal_position
        `);
        
        console.log('\nTable columns:');
        columns.rows.forEach(col => {
            console.log(`  - ${col.column_name} (${col.data_type})`);
        });

        console.log('\n========================================');
        console.log('🎉 Database fixed successfully!');
        console.log('========================================\n');
        
    } catch (error) {
        console.error('\n❌ Error fixing database:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

fixDatabase().catch(err => {
    console.error('Fix failed:', err);
    process.exit(1);
});
