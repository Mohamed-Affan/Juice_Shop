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

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Fetch user context
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);

        if (error || !users || users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify currently set password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password incorrect' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        // Update in database
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash })
            .eq('id', userId);

        if (updateError) {
            console.error('Password update error:', updateError);
            return res.status(500).json({ message: 'Failed to update password' });
        }

        res.json({ message: 'Password changed successfully!' });

    } catch (err) {
        console.error('Change password catch error:', err);
        res.status(500).json({ message: 'Internal server error while changing password' });
    }
};

module.exports = { login, changePassword };
