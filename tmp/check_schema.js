const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Credentials not found in backend/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking orders table...');
    const { data: oData, error: oError } = await supabase.from('orders').select('*').limit(1);
    if (oError) {
        console.error('Orders error:', oError.message);
    } else {
        console.log('Orders columns:', Object.keys(oData[0] || {}).join(', '));
    }

    console.log('\nChecking order_items table...');
    const { data: iData, error: iError } = await supabase.from('order_items').select('*').limit(1);
    if (iError) {
        console.error('Order items error:', iError.message);
    } else {
        console.log('Order items columns:', Object.keys(iData[0] || {}).join(', '));
    }

    console.log('\nChecking menu table...');
    const { data: mData, error: mError } = await supabase.from('menu').select('*').limit(1);
    if (mError) {
        console.error('Menu error:', mError.message);
    } else {
        console.log('Menu columns:', Object.keys(mData[0] || {}).join(', '));
    }
}

checkSchema();
