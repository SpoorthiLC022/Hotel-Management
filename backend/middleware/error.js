const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log to console for dev
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ApiError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        let message = 'Duplicate field value entered (Generic)';

        if (err.keyPattern) {
            const field = Object.keys(err.keyPattern)[0];
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        } else if (err.keyValue) {
            const field = Object.keys(err.keyValue)[0];
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        } else if (err.message) {
            // Fallback for when keyValue is not available
            const match = err.message.match(/index: (\w+)_/);
            if (match) {
                const field = match[1];
                message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
            }
        }
        error = new ApiError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ApiError(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
