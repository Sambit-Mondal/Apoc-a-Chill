const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/send-order-email', async (req, res) => {
    const { ownerEmail, userEmail, address, orderDetails } = req.body;

    if (!ownerEmail || !userEmail || !address) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const emailContent = `
        <h1>New Order Placed</h1>
        <p>Order Details:</p>
        <ul>
            <li>Title: ${orderDetails.title}</li>
            <li>Price: $${orderDetails.price}</li>
            <li>Quantity: ${orderDetails.quantity}</li>
        </ul>
        <p>Delivery Address: ${address}</p>
    `;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: [ownerEmail, userEmail],
            subject: 'New Order Notification',
            html: emailContent,
        });

        res.status(200).json({ message: 'Order email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send order email.' });
    }
});

module.exports = router;