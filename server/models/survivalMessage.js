const mongoose = require('mongoose');

const SurvivalMessageSchema = new mongoose.Schema({
    sender: { 
        type: String, 
        enum: ['User', 'Apoca-AI'], 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('SurvivalMessage', SurvivalMessageSchema);