const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


// MongoDB Config
const MongoDB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MLSA-Kiit-Hackathon';
mongoose.connect(MongoDB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// PORT Config
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});