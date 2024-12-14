const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper to validate password
const validatePassword = (password) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
};

// Signup controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate password
    if (!validatePassword(password)) {
        return res.status(400).json({
            message:
                'Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.',
        });
    }

    try {
        const user = await User.create({ name, email, password });
        const token = generateToken(user);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email is already in use' });
        }
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};