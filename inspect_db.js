const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');

dotenv.config({ path: './server/.env' });

const inspectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'name email accountNumber');
        console.log('Users in DB:', JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Inspection Error:', err);
        process.exit(1);
    }
};

inspectDB();
