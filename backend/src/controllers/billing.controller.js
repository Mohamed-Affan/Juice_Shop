const supabase = require('../services/supabase');

// GET /api/billing/:billNo — fetch bill by bill number
const getBill = async (req, res) => {
    try {
        const { billNo } = req.params;

        // 1. Identify what we are searching for (ID vs Bill Number)
        const idToSearch = billNo.replace(/^(ORD-|DRAFT-)/i, '');
        const isProbablyId = idToSearch && (idToSearch.includes('-') || !isNaN(idToSearch));
        
        let foundId = null;

        if (isProbablyId) {
            // Search by numeric/UUID ID first
            const { data, error } = await supabase.from('orders').select('id').eq('id', idToSearch).limit(1);
            if (!error && data && data.length > 0) {
                foundId = data[0].id;
            }
        }

        // 2. If not found by ID, try searching by bill_no column (if it exists)
        if (!foundId) {
            const { data, error } = await supabase.from('orders').select('id').eq('bill_no', billNo).limit(1);
            if (!error && data && data.length > 0) {
                foundId = data[0].id;
            }
        }

        if (!foundId) {
            return res.status(404).json({ message: `Order/Bill "${billNo}" not found` });
        }

        // 3. Now fetch full details for the specific ID using safe column selection
        // We try the full set, and fallback to the basic set if columns are missing
        let { data: orderData, error: detailsError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', foundId)
            .limit(1);

        if (detailsError && detailsError.message.includes('column')) {
            console.warn('Fallback to basic columns in getBill');
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('orders')
                .select('id, table_number, total_amount, status, created_at')
                .eq('id', foundId)
                .limit(1);
            orderData = fallbackData;
        }

        if (!orderData || orderData.length === 0) {
            return res.status(404).json({ message: 'Order details not found' });
        }

        const order = orderData[0];

        // 4. Fetch order items safely using separate fetches
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

        if (itemsError) {
            console.error('Order items fetch error:', itemsError);
            // Non-fatal, just no items listed
        }

        // 5. Fetch required menu names and prices manually
        const menuIds = [...new Set((orderItems || []).map(i => i.menu_id))];
        const { data: menuData, error: menuFetchError } = await supabase
            .from('menu')
            .select('id, name, price')
            .in('id', menuIds);

        if (menuFetchError) {
            console.error('Menu fetch error in getBill:', menuFetchError);
        }

        const menuMap = {};
        (menuData || []).forEach(m => { menuMap[m.id] = { name: m.name, price: m.price }; });

        // Map database record to frontend-friendly object
        res.json({
            id: order.id,
            bill_no: order.bill_no || `DRAFT-${String(order.id).slice(0, 4).toUpperCase()}`,
            table_number: order.table_number || 0,
            order_type: order.order_type || 'dine-in',
            status: order.status || 'pending',
            payment_status: order.payment_status || 'pending',
            payment_method: order.payment_method || null,
            paid_at: order.paid_at || null,
            total_amount: order.total_amount || 0,
            final_amount: order.final_amount || order.total_amount || 0,
            created_at: order.created_at,
            items: (orderItems || []).map(item => {
                const details = menuMap[item.menu_id] || { name: 'Unknown Item', price: 0 };
                return {
                    name: details.name,
                    price: details.price,
                    quantity: item.quantity,
                    subtotal: details.price * item.quantity
                };
            })
        });
    } catch (err) {
        console.error('getBill catch error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// PUT /api/billing/:id/pay — mark order as paid
const markPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const method = (req.body.method || 'upi').toLowerCase();

        // 1. Check existence safely (using ID only)
        const { data: existing, error: fetchErr } = await supabase
            .from('orders')
            .select('id')
            .eq('id', id)
            .limit(1);

        if (fetchErr || !existing || existing.length === 0) {
            console.error('Check order existence error:', fetchErr);
            return res.status(404).json({ message: 'Order ID not found' });
        }

        // 2. Try updating payment columns
        const { data, error } = await supabase
            .from('orders')
            .update({
                payment_status: 'paid',
                payment_method: method,
                paid_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select();

        // 3. Fallback if columns are missing
        if (error && error.message.includes('column')) {
            console.warn('Payment columns missing during markPaid, skipping DB update');
            // We just return success anyway so the UI updates
            return res.json({
                message: `[MIGRATION REQUIRED] Payment noted via ${method.toUpperCase()}. (Columns missing in DB)`,
                order: { id, payment_status: 'paid' }
            });
        }

        if (error) {
            console.error('markPaid error:', error);
            return res.status(500).json({ message: 'Failed to update payment status' });
        }

        // 4. AUTO-DELETE AFTER PAYMENT DONE (as requested)
        console.log(`Order ${id} paid successfully. Auto-deleting from database...`);
        
        try {
            // Delete items first
            await supabase.from('order_items').delete().eq('order_id', id);
            // Delete order
            await supabase.from('orders').delete().eq('id', id);
            
            console.log(`Order ${id} deleted successfully.`);
        } catch (delErr) {
            console.error('Auto-delete error (non-fatal for client):', delErr);
        }

        res.json({
            message: `Payment recorded via ${method.toUpperCase()}. Order cleared.`,
            order: data[0],
            cleared: true
        });
    } catch (err) {
        console.error('markPaid catch error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// GET /api/billing/recent — Fetch 15 most recent orders for billing
const getRecentBills = async (req, res) => {
    try {
        // 1. Try fetching with all columns
        let { data, error } = await supabase
            .from('orders')
            .select('id, bill_no, table_number, total_amount, final_amount, status, payment_status, created_at')
            .neq('status', 'canceled')
            .order('created_at', { ascending: false })
            .limit(15);

        // 2. Fallback if new columns (bill_no, final_amount, payment_status) are missing
        if (error && error.message.includes('column')) {
            console.warn('Billing columns missing on recent fetch, falling back to basic columns');
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('orders')
                .select('id, table_number, total_amount, status, created_at')
                .neq('status', 'canceled')
                .order('created_at', { ascending: false })
                .limit(15);
            
            data = fallbackData;
            error = fallbackError;
        }

        if (error) {
            console.error('Recent bills error:', error);
            return res.status(500).json({ message: 'Failed to fetch recent bills' });
        }

        // Map data to ensure bill_no is never empty for UI
        const result = (data || []).map(b => ({
            ...b,
            bill_no: b.bill_no || `DRAFT-${String(b.id).slice(0, 4).toUpperCase()}`,
            final_amount: b.final_amount || b.total_amount,
            payment_status: b.payment_status || 'pending'
        }));

        res.json(result);
    } catch (err) {
        console.error('getRecentBills catch error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getBill, markPaid, getRecentBills };
