const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String, required: true },
    tradeType: { type: String, enum: ['Monetary Trade', 'Trade for Items'], required: true },
    price: { type: Number },
    currency: { type: String, default: 'Eth' }, // New field for currency
    inReturn: { type: String },
    quantity: { type: Number, required: true },
    ownerEmail: { type: String, required: true }
});

module.exports = mongoose.model('Resource', ResourceSchema);