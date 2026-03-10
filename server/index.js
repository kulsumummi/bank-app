const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { protect } = require('./middleware/auth');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);

// Handle CORS origins dynamically
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    // Add Vercel system environment variables as fallback
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
        credentials: true
    }
});

// Make io accessible to routes
app.set('io', io);

// Socket.io connection logic
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`👤 User joined room: ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 User disconnected');
    });
});

// Body parser
app.use(express.json());
app.use(cookieParser());

// Database connection check middleware
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1 && req.path.startsWith('/api')) {
        return res.status(503).json({
            success: false,
            error: 'Database not connected. Please check your MONGODB_URI and IP whitelist.'
        });
    }
    next();
});

// Enable CORS
app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    credentials: true
}));

// Connect to Database
const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ MONGODB_URI is missing in production environment!');
            return; // Don't crash, but log error
        }
        console.log('⚠️  MONGODB_URI missing, attempting Demo Mode fallback...');
    }

    try {
        console.log('🔍 Connecting to MongoDB...');
        // Set short timeout for local connection discovery
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bankus', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ Primary MongoDB Connection Failed:', err.message);
            return;
        }

        console.log('🚀 Attempting to start in Demo Mode (In-Memory Database)...');

        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();

            await mongoose.connect(mongoUri);
            console.log('✨ BankUs is now running in DEMO MODE (In-Memory)');
        } catch (memErr) {
            console.error('❌ Failed to start Demo Mode:', memErr.message);
            process.exit(1);
        }
    }
};

// Routes
// Auth routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/me', protect, authController.getMe);

// User routes
app.get('/api/user/balance', protect, userController.getBalance);
app.get('/api/user/search-recipient', protect, userController.searchRecipient);
app.get('/api/user/transactions', protect, userController.getTransactions);
app.post('/api/user/transfer', protect, userController.transferMoney);
app.post('/api/user/deposit', protect, userController.depositMoney);
app.post('/api/user/withdraw', protect, userController.withdrawMoney);

// Simple Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Connect to Database and then start server
const startServer = async () => {
    try {
        await connectDB();
        if (process.env.NODE_ENV !== 'production') {
            server.listen(PORT, () => {
                console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
                console.log(`👉 Access the app at: http://localhost:5173`);
            });
        }
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
    }
};

// Start the connection process
// For Vercel, this will run on every cold start
startServer();

// Ensure the first request waits for connection if needed
app.use(async (req, res, next) => {
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }
    next();
});

module.exports = app;
