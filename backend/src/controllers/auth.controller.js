const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Fetch user from database
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username.trim())
            .limit(1);

        if (error) {
            console.error('DB error:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }

        if (!users || users.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
};

module.exports = { login };
