const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/async');
const ApiError = require('../utils/apiError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// @desc    Process payment
// @route   POST /api/v1/payments/:bookingId
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.bookingId).populate('room user');

    if (!booking) {
        return next(new ApiError(`Booking not found with id of ${req.params.bookingId}`, 404));
    }

    // Mock payment processing for now as we don't have real keys
    // In real scenario, we would use stripe.paymentIntents.create

    const payment = await Payment.create({
        booking: booking._id,
        user: req.user.id,
        amount: booking.totalPrice,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'Succeeded',
        paymentMethod: req.body.paymentMethod || 'Credit Card'
    });

    // Update booking status
    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    await booking.save();

    res.status(200).json({
        success: true,
        data: payment
    });
});

// @desc    Get Invoice PDF
// @route   GET /api/v1/payments/:paymentId/invoice
// @access  Private
exports.getInvoice = asyncHandler(async (req, res, next) => {
    const payment = await Payment.findById(req.params.paymentId).populate({
        path: 'booking',
        populate: { path: 'room' }
    }).populate('user');

    if (!payment) {
        return next(new ApiError(`Payment record not found`, 404));
    }

    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ApiError(`Not authorized to view this invoice`, 401));
    }

    const doc = new PDFDocument();
    const filename = `invoice-${payment.transactionId}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(25).text('StaySync Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Transaction ID: ${payment.transactionId}`);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${payment.user.name}`);
    doc.text(`Email: ${payment.user.email}`);
    doc.moveDown();
    doc.text('--------------------------------------------------');
    doc.text(`Room: ${payment.booking.room.name} (${payment.booking.room.roomNumber})`);
    doc.text(`Check-in: ${new Date(payment.booking.checkIn).toLocaleDateString()}`);
    doc.text(`Check-out: ${new Date(payment.booking.checkOut).toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(16).text(`Total Amount: INR ${payment.amount}`, { align: 'right' });
    doc.fontSize(12).text(`Status: ${payment.status}`, { align: 'right' });
    doc.moveDown();
    doc.text('Thank you for staying with StaySync!', { align: 'center' });

    doc.pipe(res);
    doc.end();
});
