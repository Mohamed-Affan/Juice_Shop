const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Credentials not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetSystem() {
    console.log('--- STARTING AGGRESSIVE PRODUCTION RESET ---');

    // Helper for aggressive delete
    const deleteAll = async (table) => {
        console.log(`Deleting all records from ${table}...`);
        // Using gt(id, 0) for numeric and gte('a',' ') for others
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) {
            console.error(`Error deleting ${table}:`, error.message);
            // Try fallback numeric delete if id is numeric
            await supabase.from(table).delete().gt('id', 0);
        }
    };

    try {
        // 1. Delete records in dependency order
        await deleteAll('order_items');
        await deleteAll('orders');
        await deleteAll('menu');
        await deleteAll('menu_items');
        await deleteAll('users');

        // 2. Clear Storage
        console.log('Clearing storage bucket (menu-images)...');
        const { data: files } = await supabase.storage.from('menu-images').list('menu');
        if (files && files.length > 0) {
            const filesToRemove = files.map(f => `menu/${f.name}`);
            await supabase.storage.from('menu-images').remove(filesToRemove);
            console.log(`Deleted ${filesToRemove.length} images.`);
        }

        // 3. Wait for DB to settle
        console.log('Waiting for DB to settle...');
        await new Promise(r => setTimeout(r, 2000));

        // 4. Recreate Default Users
        console.log('Recreating default users...');
        const salt = await bcrypt.genSalt(10);
        const defaultUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'pos', password: 'pos123', role: 'pos' },
            { username: 'kitchen', password: 'kitchen123', role: 'kitchen' }
        ];

        for (const u of defaultUsers) {
            const password_hash = await bcrypt.hash(u.password, salt);
            const { error } = await supabase.from('users').insert({
                username: u.username,
                password_hash,
                role: u.role
            });
            if (error) console.error(`Failed to create ${u.username}:`, error.message);
            else console.log(`Created user: ${u.username}`);
        }

    } catch (err) {
        console.error('CRITICAL RESET ERROR:', err);
    }

    console.log('--- SYSTEM RESET COMPLETE ---');
    process.exit(0);
}

resetSystem();
