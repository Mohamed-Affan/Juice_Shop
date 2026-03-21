// One-time seed script to create an admin user
// Run: node seed.js

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function seed() {
    console.log('Seeding users...');

    const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'pos', password: 'pos123', role: 'pos' },
        { username: 'kitchen', password: 'kitchen123', role: 'kitchen' },
    ];

    for (const user of users) {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(user.password, salt);

        // Check if user already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('username', user.username)
            .limit(1);

        if (existing && existing.length > 0) {
            console.log(`  User "${user.username}" already exists, skipping.`);
            continue;
        }

        const { error } = await supabase
            .from('users')
            .insert([{ username: user.username, password_hash, role: user.role }]);

        if (error) {
            console.error(`  Failed to create "${user.username}":`, error.message);
        } else {
            console.log(`  Created user "${user.username}" (role: ${user.role})`);
        }
    }

    console.log('Done!');
    console.log('\nDefault credentials:');
    console.log('  admin / admin123');
    console.log('  pos / pos123');
    console.log('  kitchen / kitchen123');
}

seed().catch(console.error);
