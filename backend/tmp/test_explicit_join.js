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

async function testExplicitJoin() {
    console.log('Testing explicit join: order_items!menu_id(menu(name))...');
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items!order_id(
                quantity,
                menu!menu_id(name)
            )
        `)
        .limit(1);

    if (error) {
        console.error('Explicit Join failed:', JSON.stringify(error, null, 2));
    } else {
        console.log('Explicit Join success!');
        console.log('Result sample:', JSON.stringify(data[0], null, 2));
    }
    process.exit(0);
}

testExplicitJoin();
