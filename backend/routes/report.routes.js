const express = require('express');
const {
    getStats,
    getRevenueTrend
} = require('../controllers/report.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/revenue-trend', getRevenueTrend);

module.exports = router;
