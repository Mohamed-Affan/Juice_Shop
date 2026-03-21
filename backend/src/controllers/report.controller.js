const supabase = require('../services/supabase');

// GET /api/reports/dashboard — admin dashboard stats
const getDashboard = async (req, res) => {
    try {
        // Get today's start (midnight UTC)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISO = today.toISOString();

        // Total revenue today (completed orders)
        const { data: revenueData, error: revError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed')
            .gte('created_at', todayISO);

        if (revError) {
            console.error('Revenue fetch error:', revError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        const revenue = (revenueData || []).reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

        // Total orders today (all statuses)
        const { data: ordersData, error: ordError } = await supabase
            .from('orders')
            .select('id')
            .gte('created_at', todayISO);

        if (ordError) {
            console.error('Orders count error:', ordError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        const orders = (ordersData || []).length;

        res.json({ revenue, orders });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

module.exports = { getDashboard };
