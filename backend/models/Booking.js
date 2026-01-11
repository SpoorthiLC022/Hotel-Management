const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    checkIn: {
        type: Date,
        required: [true, 'Please add a check-in date']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please add a check-out date']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid', 'Refunded'],
        default: 'Unpaid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent booking if dates overlap (Logic will be in controller, but adding note here)
// Index for faster queries
BookingSchema.index({ room: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
