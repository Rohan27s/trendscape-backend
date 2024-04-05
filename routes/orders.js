const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        // Token not provided, continue to the next middleware or route handler
        return next();
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}


// POST route to capture order details
router.post('/', verifyToken, async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.userId) {
            // User is not logged in, handle accordingly (e.g., save as guest order)
            const newOrder = await Order.create(req.body);
            return res.status(201).json(newOrder);
        }

        // User is logged in, save order for respective user
        const orderData = { ...req.body, user: req.userId };
        const newOrder = await Order.create(orderData);
        res.status(201).json(newOrder);
    } catch (err) {
        // Handle validation errors
        res.status(400).json({ message: err.message });
    }
});


// GET route to fetch orders of an individual user
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if user is admin
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Fetch orders for the logged-in user (admin)
        if (user.role !== 'admin') {
            const orders = await Order.find({ user: req.userId });
            return res.json(orders);
        }

        // If user is admin, return error
        return res.status(403).json({ message: 'Unauthorized access' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to fetch all orders (accessible only by admins)
router.get('/all-orders', verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // Fetch all orders
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route to fetch a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE route to delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT route to update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
