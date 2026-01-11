const express = require('express');
const {
    processPayment,
    getInvoice
} = require('../controllers/payment.controller');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/:bookingId', processPayment);
router.get('/:paymentId/invoice', getInvoice);

module.exports = router;
