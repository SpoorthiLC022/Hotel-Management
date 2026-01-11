const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Please add a room number'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please add a room name']
    },
    type: {
        type: String,
        required: [true, 'Please add a room type'],
        enum: ['Single', 'Double', 'Suite', 'Villa']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity']
    },
    amenities: [String],
    description: String,
    images: [String],
    status: {
        type: String,
        enum: ['Available', 'Booked', 'Maintenance'],
        default: 'Available'
    },
    cleanliness: {
        type: String,
        enum: ['Clean', 'Dirty', 'Cleaning'],
        default: 'Clean'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', RoomSchema);
