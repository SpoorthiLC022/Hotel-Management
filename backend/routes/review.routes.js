const express = require('express');
const {
    getReviews,
    addReview,
    updateReviewStatus
} = require('../controllers/review.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getReviews)
    .post(protect, addReview);

router.put('/:id/status', protect, authorize('admin'), updateReviewStatus);

module.exports = router;
