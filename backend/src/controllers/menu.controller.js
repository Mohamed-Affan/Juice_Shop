const supabase = require('../services/supabase');

// GET /api/menu — fetch all menu items
const getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Menu fetch error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        res.json(data);
    } catch (err) {
        console.error('Menu getAll error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// POST /api/menu — create new menu item (admin only)
const create = async (req, res) => {
    try {
        const { name, price, image_url } = req.body;

        const { data, error } = await supabase
            .from('menu')
            .insert([{ name: name.trim(), price, image_url: image_url || null }])
            .select();

        if (error) {
            console.error('Menu create error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Menu create error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// PUT /api/menu/:id — update menu item (admin only)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image_url } = req.body;

        const { data, error } = await supabase
            .from('menu')
            .update({ name: name.trim(), price, image_url: image_url || null })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Menu update error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json(data[0]);
    } catch (err) {
        console.error('Menu update error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

// DELETE /api/menu/:id — delete menu item (admin only)
const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('menu')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Menu delete error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        console.error('Menu delete error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

module.exports = { getAll, create, update, remove };
