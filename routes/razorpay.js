const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');

// Initialize Razorpay with your API key and secret
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

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

// Function to create a new order with Razorpay
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        // Retrieve order details from request body
        const { amount, currency, receipt, notes } = req.body;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amount, // Amount in paisa
            currency: currency,
            receipt: receipt,
            notes: notes
        });

        // Save order details in your database
        const newOrder = await Order.create({
            user: req.userId,
            razorpayOrderId: razorpayOrder.id, // Save Razorpay order ID
            amount: amount / 100, // Convert amount to rupees
            currency: currency,
            status: 'pending' // Initial status
        });

        // Send Razorpay order ID to the client
        res.json({ orderId: razorpayOrder.id,message:"Order is successfull",newOrder });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Function to handle payment success callback from Razorpay
router.post('/payment-success', async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        // Verify Razorpay signature
        const isValidSignature = razorpay.utility.verifyPaymentSignature({
            orderId: orderId,
            paymentId: paymentId,
            signature: signature
        });

        if (isValidSignature) {
            // Update order status in your database
            await Order.findOneAndUpdate({ razorpayOrderId: orderId }, { status: 'success', paymentId: paymentId });
            res.json({ message: 'Payment successful' });
        } else {
            res.status(400).json({ message: 'Invalid Razorpay signature' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Function to handle payment failure callback from Razorpay
router.post('/payment-failure', async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;

        // Update order status in your database
        await Order.findOneAndUpdate({ razorpayOrderId: orderId }, { status: 'failed', paymentId: paymentId });
        res.json({ message: 'Payment failed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
