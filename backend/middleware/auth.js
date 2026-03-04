const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        // 1. Verify token signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Check token exists in DB and not expired
        const tokenCheck = await Token.findOne({
            token_value: token,
            expires_at: { $gt: new Date() }
        });

        if (!tokenCheck) {
            return res.status(401).json({ success: false, message: 'Session expired or invalid' });
        }

        // 3. Get user data
        const user = await User.findById(decoded.customer_id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
