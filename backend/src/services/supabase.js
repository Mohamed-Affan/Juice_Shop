const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_url' || !supabaseKey || supabaseKey === 'your_supabase_anon_key') {
    console.error('\n========================================');
    console.error('  SUPABASE CREDENTIALS NOT CONFIGURED!');
    console.error('  Please update backend/.env with your');
    console.error('  real SUPABASE_URL and SUPABASE_KEY.');
    console.error('========================================\n');
    // Create a mock client that will fail gracefully at request time
    const handler = {
        get: function(target, prop) {
            if (prop === 'from') {
                return () => ({
                    select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                    insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
                    update: () => ({ eq: () => ({ select: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
                    delete: () => ({ eq: () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
                    eq: () => ({ limit: () => ({ data: null, error: { message: 'Supabase not configured' } }) }),
                });
            }
            return undefined;
        }
    };
    module.exports = new Proxy({}, handler);
} else {
    const supabase = createClient(supabaseUrl, supabaseKey);
    module.exports = supabase;
}
