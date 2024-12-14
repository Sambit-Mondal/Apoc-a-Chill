const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);