const supabase = require('../services/supabase');

// GET /api/orders/pending — fetch pending/preparing orders with items
const getPending = async (req, res) => {
    try {
        // Fetch orders that are pending or preparing
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .in('status', ['pending', 'preparing'])
            .order('created_at', { ascending: true });

        if (ordersError) {
            console.error('Orders fetch error:', ordersError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!orders || orders.length === 0) {
            return res.json([]);
        }

        // Fetch order items with menu names for each order
        const orderIds = orders.map(o => o.id);
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*, menu(name)')
            .in('order_id', orderIds);

        if (itemsError) {
            console.error('Order items fetch error:', itemsError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        // Attach items to their respective orders
        const result = orders.map(order => ({
            ...order,
            items: (orderItems || [])
                .filter(item => item.order_id === order.id)
                .map(item => ({
                    name: item.menu ? item.menu.name : 'Unknown Item',
                    quantity: item.quantity,
                })),
        }));

        res.json(result);
    } catch (err) {
        console.error('getPending error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// GET /api/orders/completed — fetch completed orders
const getCompleted = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Completed orders fetch error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        res.json(data);
    } catch (err) {
        console.error('getCompleted error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// POST /api/orders — create a new order
const create = async (req, res) => {
    try {
        const { table_number, order_type, items } = req.body;

        // Fetch menu prices to calculate total
        const menuIds = items.map(i => i.menu_id);
        const { data: menuItems, error: menuError } = await supabase
            .from('menu')
            .select('id, price')
            .in('id', menuIds);

        if (menuError) {
            console.error('Menu fetch error:', menuError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        // Build a price map
        const priceMap = {};
        (menuItems || []).forEach(m => { priceMap[m.id] = m.price; });

        // Calculate total
        let totalAmount = 0;
        items.forEach(item => {
            const price = priceMap[item.menu_id] || 0;
            totalAmount += price * item.quantity;
        });

        // Insert order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                table_number,
                order_type: order_type || 'dine-in',
                status: 'pending',
                total_amount: totalAmount,
            }])
            .select();

        if (orderError) {
            console.error('Order insert error:', orderError);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        const order = orderData[0];

        // Insert order items
        const orderItemsData = items.map(item => ({
            order_id: order.id,
            menu_id: item.menu_id,
            quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Order items insert error:', itemsError);
            // Order was created but items failed — still return success with warning
        }

        res.status(201).json(order);
    } catch (err) {
        console.error('Order create error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PUT /api/orders/:id/complete — mark order as completed
const complete = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Order complete error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(data[0]);
    } catch (err) {
        console.error('Order complete error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

module.exports = { getPending, getCompleted, create, complete };
