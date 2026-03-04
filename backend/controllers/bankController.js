const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get current user balance
// @route   GET /api/balance
exports.getBalance = async (req, res) => {
    try {
        // req.user is attached by the protect middleware
        res.status(200).json({
            success: true,
            balance: req.user.balance
        });
    } catch (error) {
        console.error('Get Balance Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Transfer money
// @route   POST /api/transfer
exports.transferMoney = async (req, res) => {
    const { receiver_email, amount } = req.body;
    const sender_id = req.user._id;

    if (!receiver_email || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Please provide valid receiver email and positive amount' });
    }

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // 1. Get sender with lock (Mongoose doesn't have native SELECT FOR UPDATE, but transactions handle isolation)
            const sender = await User.findById(sender_id).session(session);

            if (sender.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // 2. Find receiver
            const receiver = await User.findOne({ email: receiver_email }).session(session);

            if (!receiver) {
                throw new Error('Receiver not found');
            }

            if (receiver._id.equals(sender._id)) {
                throw new Error('Cannot transfer to yourself');
            }

            // 3. Perform transfer
            sender.balance -= amount;
            receiver.balance += amount;

            await sender.save({ session });
            await receiver.save({ session });
        });

        // Get new balance
        const updatedUser = await User.findById(sender_id);

        res.status(200).json({
            success: true,
            message: `Successfully transferred ${amount} to ${receiver_email}`,
            newBalance: updatedUser.balance
        });

    } catch (error) {
        console.error('Transfer Error:', error.message);
        res.status(error.message === 'Server Error' ? 500 : 400).json({
            success: false,
            message: error.message || 'Transfer failed'
        });
    } finally {
        session.endSession();
    }
};
