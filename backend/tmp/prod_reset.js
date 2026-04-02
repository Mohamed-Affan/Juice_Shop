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
    console.log('--- STARTING PRODUCTION RESET ---');

    // 1. Clear Data (Delete records)
    console.log('Clearing database records...');
    
    // Use neq('id', '00000000-0000-0000-0000-000000000000') as a catch-all to delete everything
    const allQuery = '00000000-0000-0000-0000-000000000000';

    try {
        // Delete items first (due to foreign keys)
        await supabase.from('order_items').delete().neq('id', -1);
        console.log('Clearing orders...');
        await supabase.from('orders').delete().neq('id', allQuery);
        console.log('Clearing menu and menu_items...');
        await supabase.from('menu').delete().neq('id', -1);
        await supabase.from('menu_items').delete().neq('id', -1);
        console.log('Clearing users...');
        await supabase.from('users').delete().neq('id', allQuery);
    } catch (err) {
        console.error('Data clear error:', err.message);
    }

    // 2. Clear Storage
    console.log('Clearing storage bucket (menu-images)...');
    try {
        const { data: files, error: listError } = await supabase.storage.from('menu-images').list('menu');
        if (!listError && files && files.length > 0) {
            const filesToRemove = files.map(f => `menu/${f.name}`);
            const { error: removeError } = await supabase.storage.from('menu-images').remove(filesToRemove);
            if (removeError) console.error('Storage remove error:', removeError.message);
            else console.log(`Deleted ${filesToRemove.length} files from storage.`);
        } else {
            console.log('No files found in storage to delete.');
        }
    } catch (err) {
        console.error('Storage clear error:', err.message);
    }

    // 3. Recreate Default Users
    console.log('Recreating default users...');
    try {
        const salt = await bcrypt.genSalt(10);
        
        const defaultUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'pos', password: 'pos123', role: 'pos' },
            { username: 'kitchen', password: 'kitchen123', role: 'kitchen' }
        ];

        for (const u of defaultUsers) {
            const password_hash = await bcrypt.hash(u.password, salt);
            const { error } = await supabase.from('users').insert([{
                username: u.username,
                password_hash,
                role: u.role
            }]);
            if (error) console.error(`Failed to create ${u.username}:`, error.message);
            else console.log(`Created user: ${u.username}`);
        }
    } catch (err) {
        console.error('User recreation error:', err.message);
    }

    console.log('--- RESET COMPLETE ---');
    process.exit(0);
}

resetSystem();
