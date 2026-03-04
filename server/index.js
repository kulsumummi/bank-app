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
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
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

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Connect to Database
const connectDB = async () => {
    try {
        console.log('🔍 Connecting to MongoDB...');
        // Set short timeout for local connection discovery
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (err) {
        console.error('❌ Primary MongoDB Connection Failed:', err.message);
        console.log('🚀 Attempting to start in Demo Mode (In-Memory Database)...');

        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();

            await mongoose.connect(mongoUri);
            console.log('✨ BankUs is now running in DEMO MODE (In-Memory)');
            console.log('⚠️  Note: Transactions and users will NOT be saved after the server restarts.');
        } catch (memErr) {
            console.error('❌ Failed to start Demo Mode:', memErr.message);
            console.log('💡 TIP: Please ensure you have a working MongoDB connection string in server/.env');
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

startServer();

module.exports = app;
