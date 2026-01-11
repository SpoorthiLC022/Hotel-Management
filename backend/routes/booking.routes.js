const express = require('express');
const {
    getBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/booking.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getBookings)
    .post(createBooking);

router
    .route('/:id')
    .get(getBooking)
    .put(updateBooking)
    .delete(authorize('admin'), deleteBooking);

module.exports = router;
