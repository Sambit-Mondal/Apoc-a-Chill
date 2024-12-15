const express = require('express');
const SurvivalMessage = require('../models/survivalMessage');

const router = express.Router();

router.post('/api/survival-chat', async (req, res) => {
    const { message } = req.body;

    try {
        // Save the user's message to the database
        const userMessage = await SurvivalMessage.create({
            sender: 'User',
            message,
            timestamp: new Date(),
        });

        // Call the Survival Guide AI for its response
        const response = await axios.post('http://localhost:5001/api/ask', { message });

        // Save the AI's response to the database
        const aiMessage = await SurvivalMessage.create({
            sender: 'Apoca-AI',
            message: response.data.response,
            timestamp: new Date(),
        });

        res.status(200).json({ 
            userMessage, 
            aiMessage 
        });
    } catch (error) {
        console.error('Error in /api/survival-chat:', error);
        res.status(500).json({ error: 'Failed to communicate with the AI' });
    }
});

router.get('/api/survival-chat', async (req, res) => {
    try {
        const messages = await SurvivalMessage.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch survival chat history' });
    }
});

module.exports = router;