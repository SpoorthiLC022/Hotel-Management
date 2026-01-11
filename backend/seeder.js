const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Room = require('./models/Room');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Import data
const rooms = [
    {
        roomNumber: "101",
        name: "Deluxe Ocean Suite",
        type: "Suite",
        price: 24999,
        capacity: 2,
        amenities: ["Free WiFi", "Mini Bar", "Ocean View", "Smart TV"],
        description: "Experience luxury with breath-taking ocean views and world-class amenities.",
        status: "Available",
        cleanliness: "Clean"
    },
    {
        roomNumber: "102",
        name: "Executive Business Room",
        type: "Double",
        price: 15999,
        capacity: 2,
        amenities: ["Free WiFi", "Workspace", "Coffee Maker", "City View"],
        description: "Perfect for business travelers, featuring a workspace and high-speed internet.",
        status: "Available",
        cleanliness: "Clean"
    },
    {
        roomNumber: "201",
        name: "Family Garden Villa",
        type: "Villa",
        price: 35999,
        capacity: 4,
        amenities: ["Private Pool", "Kitchen", "Garden View", "Free Parking"],
        description: "Spacious villas surrounded by lush gardens, ideal for family vacations.",
        status: "Available",
        cleanliness: "Dirty"
    }
];

const seedData = async () => {
    try {
        await User.deleteMany();
        await Room.deleteMany();

        await Room.create(rooms);

        // Create admin
        await User.create({
            name: 'Admin User',
            email: 'admin@staysync.com',
            password: 'admin123',
            role: 'admin'
        });

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Room.deleteMany();

        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    seedData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
