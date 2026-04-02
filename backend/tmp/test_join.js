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

async function testJoinQuery() {
    console.log('Testing joined query: orders -> order_items -> menu...');
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                quantity,
                menu(name)
            )
        `)
        .limit(1);

    if (error) {
        console.error('Join failed:', JSON.stringify(error, null, 2));
    } else {
        console.log('Join success!');
        console.log('Result sample:', JSON.stringify(data[0], null, 2));
    }
    process.exit(0);
}

testJoinQuery();
