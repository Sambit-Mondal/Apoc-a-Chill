const express = require('express');
const Resource = require('../models/resource');

const router = express.Router();

// Add a resource
router.post('/add', async (req, res) => {
    try {
        const { title, description, img, tradeType, price, inReturn, quantity, ownerEmail } = req.body;

        const newResource = new Resource({
            title,
            description,
            img,
            tradeType,
            price,
            inReturn,
            quantity,
            ownerEmail
        });

        await newResource.save();
        res.status(201).json(newResource);
    } catch (err) {
        console.error('Failed to add resource:', err);
        res.status(500).json({ error: 'Failed to add resource' });
    }
});

// Get all resources
router.get('/all', async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (err) {
        console.error('Failed to fetch resources:', err);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Update a resource
router.put('/:id', async (req, res) => {
    try {
        const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedResource);
    } catch (err) {
        console.error('Failed to update resource:', err);
        res.status(500).json({ error: 'Failed to update resource' });
    }
});

// Delete a resource by ID
router.delete('/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;
        console.log('Deleting resource with ID:', resourceId);

        const deletedResource = await Resource.findByIdAndDelete(resourceId);

        if (!deletedResource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(200).json({ message: 'Resource deleted successfully', resource: deletedResource });
    } catch (err) {
        console.error('Failed to delete resource:', err);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

module.exports = router;