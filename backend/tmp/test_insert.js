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

async function testInsert() {
    console.log('Testing insert with order_type...');
    const { data: o1, error: e1 } = await supabase.from('orders').insert([{ 
        table_number: 99, 
        order_type: 'dine-in', 
        status: 'pending', 
        total_amount: 0 
    }]).select();
    
    if (e1) {
        console.error('order_type failed:', e1.message);
    } else {
        console.log('order_type success!');
    }

    console.log('\nTesting insert with type...');
    const { data: o2, error: e2 } = await supabase.from('orders').insert([{ 
        table_number: 98, 
        type: 'dine-in', 
        status: 'pending', 
        total_amount: 0 
    }]).select();
    
    if (e2) {
        console.error('type failed:', e2.message);
    } else {
        console.log('type success!');
    }
    
    process.exit(0);
}

testInsert();
