const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, balance: user.balance });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.transferMoney = async (req, res) => {
    try {
        let { recipientIdentifier, amount } = req.body;
        const senderId = req.user.id;
        const io = req.app.get('io');

        // Force integer amounts
        amount = Math.round(Number(amount));

        if (amount <= 0) {
            throw new Error('Amount must be positive and at least ₹1');
        }

        const sender = await User.findById(senderId);
        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Search by email OR account number
        const recipient = await User.findOne({
            $or: [
                { email: recipientIdentifier },
                { accountNumber: recipientIdentifier }
            ]
        });

        if (recipient && sender._id.toString() === recipient._id.toString()) {
            throw new Error('Cannot transfer money to yourself');
        }

        // Deduct from sender
        sender.balance -= amount;
        await sender.save();

        let transactionData = {
            sender: senderId,
            amount: amount,
            recipientIdentifier: recipientIdentifier,
            currency: 'INR'
        };

        if (recipient) {
            recipient.balance += amount;
            await recipient.save();
            transactionData.receiver = recipient._id;
            transactionData.type = 'Internal';

            if (io) {
                io.to(recipient._id.toString()).emit('transferReceived', {
                    amount,
                    senderName: sender.name,
                    newBalance: recipient.balance
                });
            }
        } else {
            transactionData.type = 'External';
        }

        const transaction = await Transaction.create(transactionData);

        if (io) {
            io.to(senderId).emit('balanceUpdate', sender.balance);
        }

        res.status(200).json({
            success: true,
            message: recipient
                ? `Transfer of ₹${amount} to ${recipient.name} successful`
                : `External transfer of ₹${amount} to ${recipientIdentifier} initiated successfully`,
            newBalance: sender.balance,
            type: recipient ? 'Internal' : 'External'
        });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.searchRecipient = async (req, res) => {
    try {
        const { identifier } = req.query;
        if (!identifier || identifier.length < 3) {
            return res.status(200).json({ success: true, user: null });
        }

        const recipient = await User.findOne({
            $or: [
                { email: identifier },
                { accountNumber: identifier }
            ]
        }).select('name email accountNumber');

        res.status(200).json({
            success: true,
            user: recipient ? {
                name: recipient.name,
                email: recipient.email,
                accountNumber: recipient.accountNumber
            } : null
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { sender: req.user.id },
                { receiver: req.user.id }
            ]
        })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort('-timestamp')
            .limit(50); // Increased limit for detailed history

        res.status(200).json({
            success: true,
            transactions
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.depositMoney = async (req, res) => {
    try {
        let { amount } = req.body;
        const userId = req.user.id;
        const io = req.app.get('io');

        amount = Math.round(Number(amount));
        if (amount <= 0) throw new Error('Amount must be positive');

        const user = await User.findById(userId);
        user.balance += amount;
        await user.save();

        await Transaction.create({
            receiver: userId,
            recipientIdentifier: user.accountNumber,
            amount: amount,
            type: 'Deposit',
            currency: 'INR'
        });

        if (io) {
            io.to(userId).emit('balanceUpdate', user.balance);
        }

        res.status(200).json({
            success: true,
            message: `Successfully deposited ₹${amount}`,
            newBalance: user.balance
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.withdrawMoney = async (req, res) => {
    try {
        let { amount } = req.body;
        const userId = req.user.id;
        const io = req.app.get('io');

        amount = Math.round(Number(amount));
        if (amount <= 0) throw new Error('Amount must be positive');

        const user = await User.findById(userId);
        if (user.balance < amount) throw new Error('Insufficient balance');

        user.balance -= amount;
        await user.save();

        await Transaction.create({
            sender: userId,
            recipientIdentifier: user.accountNumber,
            amount: amount,
            type: 'Withdraw',
            currency: 'INR'
        });

        if (io) {
            io.to(userId).emit('balanceUpdate', user.balance);
        }

        res.status(200).json({
            success: true,
            message: `Successfully withdrew ₹${amount}`,
            newBalance: user.balance
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
