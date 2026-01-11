const Review = require('../models/Review');
const Room = require('../models/Room');
const asyncHandler = require('../middleware/async');
const ApiError = require('../utils/apiError');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ status: 'Approved' }).populate({
        path: 'user',
        select: 'name'
    }).populate({
        path: 'room',
        select: 'name roomNumber'
    });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Submit a review
// @route   POST /api/v1/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    const room = await Room.findById(req.body.room);

    if (!room) {
        return next(new ApiError(`No room with the id of ${req.body.room}`, 404));
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Update review status (Moderation)
// @route   PUT /api/v1/reviews/:id/status
// @access  Private/Admin
exports.updateReviewStatus = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new ApiError(`No review with the id of ${req.params.id}`, 404));
    }

    review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });
});
