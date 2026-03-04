const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const uri = process.env.MONGODB_URI;

async function run() {
    const client = new MongoClient(uri);
    try {
        console.log('Connecting to:', uri);
        await client.connect();
        console.log('Connected successfully');
        const db = client.db('bankus');
        const users = await db.collection('users').find({}).toArray();
        console.log('Users found:', users.length);
        console.log(JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
