import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/bookings');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch bookings');
    }
});

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData, { rejectWithValue }) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to create booking');
    }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateBookingStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/bookings/${id}`, { status });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to update booking status');
    }
});

const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.bookings.unshift(action.payload);
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                const index = state.bookings.findIndex(b => b._id === action.payload._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
            });
    },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
