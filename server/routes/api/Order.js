const express = require("express");
const router = express.Router();
const Order = require('../../models/Order.js');

router.post('/checkout', async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone,
            address, city, state, zipCode,
            paymentMethod, cardNumber, expiryDate, cvv,
            items, total, status
        } = req.body;

        const newOrder = new Order({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            paymentMethod,
            cardDetails: paymentMethod === 'card' ? { cardNumber, expiryDate, cvv } : {},
            items,
            total,
            status
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: savedOrder._id
        });

    } catch (err) {
        console.error('Order placement error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
