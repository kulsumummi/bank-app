const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    const { customer_name, email, password } = req.body;

    if (!customer_name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const user = await User.create({
            customer_name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                customer_id: user._id,
                customer_name: user.customer_name,
                email: user.email,
                balance: user.balance
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // Find user
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ customer_id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Save token to DB
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await Token.create({
            token_value: token,
            customer_id: user._id,
            expires_at: expiresAt
        });

        // Set Cookie
        const options = {
            expires: expiresAt,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
                message: 'Login successful',
                user: {
                    customer_id: user._id,
                    customer_name: user.customer_name,
                    email: user.email,
                    balance: user.balance
                }
            });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        // Remove from DB
        await Token.findOneAndDelete({ token_value: token });
    }

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
