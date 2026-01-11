const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Room = require('./models/Room');
const User = require('./models/User');

dotenv.config();

const debugBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const bookings = await Booking.find()
            .populate('room', 'name roomNumber')
            .populate('user', 'name email');

        console.log(`Found ${bookings.length} bookings:`);
        bookings.forEach(b => {
            console.log(`- Room: ${b.room ? b.room.name : 'Unknown'} (${b.room ? b.room.roomNumber : 'N/A'})`);
            console.log(`  User: ${b.user ? b.user.name : 'Unknown'} (${b.user ? b.user.email : 'N/A'})`);
            console.log(`  Dates: ${new Date(b.checkIn).toLocaleDateString()} to ${new Date(b.checkOut).toLocaleDateString()}`);
            console.log(`  Status: ${b.status}`);
            console.log('---');
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugBookings();
