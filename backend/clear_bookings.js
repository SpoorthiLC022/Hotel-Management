const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');

dotenv.config();

const clearBookings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const result = await Booking.deleteMany({});
        console.log(`Deleted ${result.deletedCount} bookings.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

clearBookings();
