const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Payment = require('../models/Payment');
const asyncHandler = require('../middleware/async');

// @desc    Get dashboard stats
// @route   GET /api/v1/reports/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res, next) => {
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'Confirmed' });

    // Revenue calc
    const payments = await Payment.find({ status: 'Succeeded' });
    const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // Occupancy rate
    const bookedRooms = await Room.countDocuments({ status: 'Booked' });
    const occupancyRate = totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0;

    res.status(200).json({
        success: true,
        data: {
            totalRooms,
            totalBookings,
            activeBookings,
            totalRevenue,
            occupancyRate: Math.round(occupancyRate * 10) / 10
        }
    });
});

// @desc    Get revenue chart data
// @route   GET /api/v1/reports/revenue-trend
// @access  Private/Admin
exports.getRevenueTrend = asyncHandler(async (req, res, next) => {
    // Aggregation for monthly revenue
    const revenue = await Payment.aggregate([
        { $match: { status: 'Succeeded' } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedData = revenue.map(item => ({
        month: months[item._id - 1],
        revenue: item.total
    }));

    res.status(200).json({
        success: true,
        data: formattedData
    });
});
