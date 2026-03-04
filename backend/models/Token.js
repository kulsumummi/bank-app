const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token_value: {
        type: String,
        required: true,
        index: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expires_at: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Auto-delete expired tokens
tokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', tokenSchema);
