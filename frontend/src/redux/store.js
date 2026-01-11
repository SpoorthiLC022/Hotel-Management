import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import notificationReducer from './slices/notificationSlice';
import roomReducer from './slices/roomSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        bookings: bookingReducer,
        notifications: notificationReducer,
        rooms: roomReducer,
        users: userReducer,
    },
});
