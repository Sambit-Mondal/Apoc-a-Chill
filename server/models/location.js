const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  alertLevel: { type: String, required: true },
});

module.exports = mongoose.model('Location', LocationSchema);