const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const User = require('./models/User');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const email = 'debug_dup_log@example.com';

        // Clean up first
        await User.deleteOne({ email });

        // Create first user
        await User.create({
            name: 'Test 1',
            email,
            password: 'password123'
        });
        console.log('First user created');

        // Create second user (should fail)
        await User.create({
            name: 'Test 2',
            email,
            password: 'password123'
        });

    } catch (err) {
        // Write full error to file
        const errorLog = JSON.stringify(err, null, 2);
        fs.writeFileSync('error_debug.json', errorLog);
        fs.writeFileSync('error_message.txt', err.message);
        console.log('Error captured to error_debug.json');
    } finally {
        await mongoose.disconnect();
    }
};

run();
