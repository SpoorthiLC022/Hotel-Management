const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'StaySync API is running...' });
});

// Route files
const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes');
const rooms = require('./routes/room.routes');
const bookings = require('./routes/booking.routes');
const payments = require('./routes/payment.routes');
const reviews = require('./routes/review.routes');
const reports = require('./routes/report.routes');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/rooms', rooms);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/payments', payments);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/reports', reports);

const errorHandler = require('./middleware/error');
app.use(errorHandler);

module.exports = app;
