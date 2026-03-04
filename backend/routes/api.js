const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bankController = require('../controllers/bankController');
const { protect } = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// Banking Routes (Protected)
router.get('/balance', protect, bankController.getBalance);
router.post('/transfer', protect, bankController.transferMoney);

// Self retrieval (useful for frontend init)
router.get('/auth/me', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;
