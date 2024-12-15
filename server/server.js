const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const Message = require('./models/message'); // Import the Message model
const User = require('./models/User'); // Import the User model
const resourceRoutes = require('./routes/resource');
const emailRoutes = require('./routes/email');
const cloudinary = require('cloudinary').v2;
const Location = require('./models/location');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resource', resourceRoutes);
app.use('/api/email', emailRoutes);

// MongoDB Config
const MongoDB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/MLSA-Kiit-Hackathon';
mongoose.connect(MongoDB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Socket.IO Setup
const users = {}; // Maps socket IDs to email addresses

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user login
    socket.on('user_login', (email) => {
        users[socket.id] = email;
        console.log(`User logged in: ${email}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
        const { senderEmail, message } = data;
        console.log(`Received message from client:`, data);

        try {
            // Fetch the sender's name from the database
            const user = await User.findOne({ email: senderEmail });
            const senderName = user ? user.name : 'Anonymous';

            // Save the message to the database
            const savedMessage = await Message.create({
                senderName,
                senderEmail,
                message,
                timestamp: new Date(),
            });

            console.log('Broadcasting message:', savedMessage);

            // Emit the message to all connected clients
            io.emit('receive_message', {
                senderName: savedMessage.senderName,
                senderEmail: savedMessage.senderEmail,
                message: savedMessage.message,
                timestamp: savedMessage.timestamp,
            });
        } catch (err) {
            console.error('Error handling message:', err);
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        delete users[socket.id];
    });
});

// Fetch messages API endpoint
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        console.log('Messages retrieved from DB:', messages); // Debugging log
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});


//Location API Endpoint
app.post('/api/location', async (req, res) => {
  const { email, latitude, longitude, alertLevel } = req.body;

  try {
    const location = await Location.findOneAndUpdate(
      { email },
      { latitude, longitude, alertLevel },
      { new: true, upsert: true }
    );

    // Broadcast the updated location to all users
    const allLocations = await Location.find();
    io.emit('update_users', allLocations);

    res.status(200).json(location);
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ error: 'Failed to update location' });
  }
});


cloudinary.config({
    cloud_name: 'sambit-mondal', // Replace with your cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Replace with your API key
    api_secret: process.env.CLOUDINARY_API_SECRET, // Replace with your API secret
});

app.post('/api/cloudinary-signature', (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, upload_preset: 'mlsa-hackathon' },
        process.env.CLOUDINARY_API_SECRET // Use the correct environment variable
    );

    res.json({ timestamp, signature });
});


// PORT Config
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});