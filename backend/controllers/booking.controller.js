const Booking = require('../models/Booking');
const Room = require('../models/Room');
const asyncHandler = require('../middleware/async');
const ApiError = require('../utils/apiError');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = asyncHandler(async (req, res, next) => {
    let query;

    // If guest, only see their own bookings
    if (req.user.role === 'guest') {
        query = Booking.find({ user: req.user.id }).populate({
            path: 'room',
            select: 'name roomNumber type'
        });
    } else {
        query = Booking.find().populate({
            path: 'room',
            select: 'name roomNumber type'
        }).populate({
            path: 'user',
            select: 'name email'
        });
    }

    const bookings = await query;

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
    });
});

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id).populate({
        path: 'room',
        select: 'name roomNumber type price'
    });

    if (!booking) {
        return next(new ApiError(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is booking owner or admin/staff
    if (booking.user.toString() !== req.user.id && req.user.role === 'guest') {
        return next(new ApiError(`Not authorized to view this booking`, 401));
    }

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Create booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    const { room, checkIn, checkOut } = req.body;

    // Check if room exists
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
        return next(new ApiError(`Room not found with id of ${room}`, 404));
    }

    // Date validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        return next(new ApiError('Check-out date must be after check-in date', 400));
    }

    // Date validation - simple string comparison to check against "today" (UTC-based to be permissive)
    const todayStr = new Date().toISOString().split('T')[0];
    const checkInStr = new Date(checkIn).toISOString().split('T')[0];

    if (checkInStr < todayStr) {
        return next(new ApiError(`Check-in date cannot be in the past (Today: ${todayStr}, Checked: ${checkInStr})`, 400));
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
        room,
        status: { $in: ['Pending', 'Confirmed'] },
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
    });

    if (overlappingBooking) {
        return next(new ApiError(`Room is already booked from ${overlappingBooking.checkIn.toDateString()} to ${overlappingBooking.checkOut.toDateString()}`, 400));
    }

    // Calculate total price
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    req.body.totalPrice = diffDays * roomDoc.price;

    const booking = await Booking.create(req.body);

    res.status(201).json({
        success: true,
        data: booking
    });
});

// @desc    Update booking / Cancel booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(new ApiError(`Booking not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is booking owner or admin/staff
    if (booking.user.toString() !== req.user.id && req.user.role === 'guest') {
        return next(new ApiError(`Not authorized to update this booking`, 401));
    }

    // Allow guests only to cancel
    if (req.user.role === 'guest' && req.body.status && req.body.status !== 'Cancelled') {
        return next(new ApiError(`Guests can only cancel bookings`, 400));
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: booking
    });
});

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return next(new ApiError(`Booking not found with id of ${req.params.id}`, 404));
    }

    await booking.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
