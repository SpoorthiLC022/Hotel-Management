import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [
        { id: 1, title: 'Welcome to StaySync!', message: 'Explore our premium rooms and exclusive offers.', time: 'Just now', read: false, type: 'info' },
        { id: 2, title: 'Check-in Reminder', message: 'Your check-in for BK-9021 is scheduled for tomorrow.', time: '2 hours ago', read: false, type: 'warning' },
    ],
    unreadCount: 2,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) state.unreadCount++;
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount--;
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.read = true);
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
