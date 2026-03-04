const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT and store in cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                accountNumber: user.accountNumber,
                ifscCode: user.ifscCode,
                accountStatus: user.accountStatus,
                createdAt: user.createdAt
            }
        });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Generate random 12-digit account number
        const accountNumber = Math.floor(Math.random() * 900000000000) + 100000000000;

        const user = await User.create({
            name,
            email,
            password,
            accountNumber: accountNumber.toString()
        });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
};

exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            accountNumber: user.accountNumber,
            ifscCode: user.ifscCode,
            accountStatus: user.accountStatus,
            createdAt: user.createdAt
        }
    });
};
