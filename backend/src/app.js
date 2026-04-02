const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/menu', require('./routes/menu.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/billing', require('./routes/billing.routes'));

// Root
app.get('/', (req, res) => {
    res.redirect('/pages/login.html');
});

// Global error handler — never expose internals
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
