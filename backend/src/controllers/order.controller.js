const supabase = require('../services/supabase');

// GET /api/orders/active — fetch pending/preparing orders with items
const getActive = async (req, res) => {
    try {
        console.log('Kitchen fetch requested (Separate Fetch Logic - Standardized)...');
        
        // 1. Fetch pending orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (ordersError) {
            console.error('Orders fetch error:', ordersError);
            return res.status(500).json({ message: 'Something went wrong fetching orders.' });
        }

        if (!orders || orders.length === 0) {
            console.log('No pending/preparing orders found.');
            return res.json([]);
        }

        const orderIds = orders.map(o => o.id);

        // 2. Fetch order_items for these orders
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);

        if (itemsError) {
            console.error('Order items fetch error:', itemsError);
            return res.status(500).json({ message: 'Something went wrong fetching order items.' });
        }

        // 3. Fetch ONLY relevant menu items from the standard 'menu' table
        const menuIds = [...new Set((orderItems || []).map(i => i.menu_id))];
        const { data: menuData, error: menuFetchError } = await supabase
            .from('menu')
            .select('id, name')
            .in('id', menuIds);
        
        if (menuFetchError) {
            console.warn('Menu fetch failed in getActive, using fallback names:', menuFetchError.message);
        }

        const menuMap = {};
        (menuData || []).forEach(m => { menuMap[m.id] = m.name; });

        // 4. Combine in memory
        const result = orders.map(order => {
            const items = (orderItems || [])
                .filter(item => item.order_id === order.id)
                .map(item => ({
                    menu_id: item.menu_id,
                    name: menuMap[item.menu_id] || 'Unknown Item',
                    quantity: item.quantity,
                }));
            
            return {
                ...order,
                items
            };
        });

        console.log('Kitchen fetch successful. Returning', result.length, 'orders with manual joins.');
        res.json(result);
    } catch (err) {
        console.error('getActive error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// GET /api/orders/recent — fetch 10 most recent orders (regardless of status)
const getRecent = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Recent orders fetch error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        res.json(data);
    } catch (err) {
        console.error('getRecent error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// POST /api/orders — create a new order
const create = async (req, res) => {
    try {
        const { table_number, order_type, items } = req.body;
        console.log('New order placement started:', { table_number, order_type, itemCount: items?.length });

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        // Fetch menu prices to calculate total
        const menuIds = items.map(i => i.menu_id);
        const { data: menuItems, error: menuError } = await supabase
            .from('menu')
            .select('id, price')
            .in('id', menuIds);

        if (menuError) {
            console.error('Menu fetch error:', menuError);
            return res.status(500).json({ message: 'Something went wrong fetching menu items.' });
        }

        // Build a price map
        const priceMap = {};
        (menuItems || []).forEach(m => { priceMap[m.id] = parseFloat(m.price) || 0; });

        // Calculate total
        let totalAmount = 0;
        items.forEach(item => {
            const price = priceMap[item.menu_id] || 0;
            totalAmount += price * item.quantity;
        });

        // 1. Try inserting with all columns (requires billing columns)
        let { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                table_number: parseInt(table_number) || 0,
                order_type: order_type || 'dine-in',
                status: 'pending',
                total_amount: totalAmount,
                payment_status: 'pending'
            }])
            .select();
        
        console.log('Main insert attempt completed. Data:', orderData, 'Error:', orderError);

        // 2. Fallback if new columns are missing
        if (orderError && orderError.message.includes('column') && orderError.message.includes('payment_status')) {
            console.warn('Billing columns missing on insert, falling back:', orderError.message);
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('orders')
                .insert([{
                    table_number: parseInt(table_number) || 0,
                    order_type: order_type || 'dine-in',
                    status: 'pending',
                    total_amount: totalAmount,
                }])
                .select();
            
            orderData = fallbackData;
            orderError = fallbackError;
        }

        if (orderError) {
            console.error('Order insert error:');
            console.dir(orderError);
            return res.status(500).json({ message: 'Failed to place order: ' + (orderError.message || 'Database error') });
        }

        if (!orderData || orderData.length === 0) {
            return res.status(500).json({ message: 'Order creation failed: empty response' });
        }

        const order = orderData[0];

        // Insert order items
        const orderItemsData = items.map(item => ({
            order_id: order.id,
            menu_id: item.menu_id,
            quantity: parseInt(item.quantity) || 1,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Order items insert error:', itemsError);
            // Non-fatal, order exists
        }

        res.status(201).json(order);
    } catch (err) {
        console.error('Order create catch error:', err);
        res.status(500).json({ message: 'Internal Server Error while placing order' });
    }
};

// PUT /api/orders/:id/complete — mark order as completed and generate bill
const complete = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the order first to get total_amount
        const { data: existing, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .limit(1);

        if (fetchError || !existing || existing.length === 0) {
            console.error('Fetch order error:', fetchError);
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = existing[0];
        const bill_no = `BILL-${id.slice(0, 8).toUpperCase()}`;
        const final_amount = order.total_amount;

        // 1. Try updating everything (requires billing columns)
        const { data, error } = await supabase
            .from('orders')
            .update({
                status: 'completed',
                bill_no,
                final_amount,
                payment_status: 'pending',
            })
            .eq('id', id)
            .select();

        // 2. Fallback to just status if columns are missing
        if (error) {
            console.warn('Billing columns missing, falling back to basic completion:', error.message);
            
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', id)
                .select();

            if (fallbackError) {
                console.error('Order complete fallback error:', fallbackError);
                return res.status(500).json({ message: 'Failed to complete order: ' + fallbackError.message });
            }
            
            return res.json(fallbackData[0]);
        }

        res.json(data[0]);
    } catch (err) {
        console.error('Order complete catch error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// DELETE /api/orders/all — clear all orders (admin only)
const clearAll = async (req, res) => {
    try {
        // First delete items to avoid constraint issues (if any)
        await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
        
        const { error } = await supabase
            .from('orders')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
            console.error('Clear orders error:', error);
            return res.status(500).json({ message: 'Failed to clear orders' });
        }

        res.json({ message: 'All order data deleted successfully' });
    } catch (err) {
        console.error('clearAll catch error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { getActive, getRecent, create, complete, clearAll };
