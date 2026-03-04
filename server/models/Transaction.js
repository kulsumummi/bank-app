const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // Optional for deposits
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // Optional for external/dummy transfers
    },
    recipientIdentifier: {
        type: String, // Email or Account Number if external
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount']
    },
    type: {
        type: String,
        enum: ['Internal', 'External', 'Deposit', 'Withdraw'],
        default: 'Internal'
    },
    currency: {
        type: String,
        default: 'INR'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
