const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Credentials not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllTables() {
    console.log('Listing tables by trying to query them...');
    
    const tablesToTry = ['menu', 'menu_items', 'orders', 'order_items', 'users'];
    for (const table of tablesToTry) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Table ${table} error: ${error.message}`);
        } else {
            console.log(`Table ${table} EXISTS! Records sample:`, data.length);
        }
    }
    process.exit(0);
}

listAllTables();
