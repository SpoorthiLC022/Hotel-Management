const express = require('express');
const {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/room.controller');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getRooms)
    .post(protect, authorize('admin'), createRoom);

router
    .route('/:id')
    .get(getRoom)
    .put(protect, authorize('admin', 'staff'), updateRoom)
    .delete(protect, authorize('admin'), deleteRoom);

module.exports = router;
