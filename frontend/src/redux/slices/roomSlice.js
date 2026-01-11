import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/rooms');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch rooms');
    }
});

export const addRoom = createAsyncThunk('rooms/addRoom', async (roomData, { rejectWithValue }) => {
    try {
        const response = await api.post('/rooms', roomData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to add room');
    }
});

export const updateRoom = createAsyncThunk('rooms/updateRoom', async (roomData, { rejectWithValue }) => {
    try {
        const response = await api.put(`/rooms/${roomData._id}`, roomData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to update room');
    }
});

export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/rooms/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to delete room');
    }
});

const initialState = {
    rooms: [],
    loading: false,
    error: null,
};

const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        clearRoomError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.rooms.push(action.payload);
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                const index = state.rooms.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.rooms[index] = action.payload;
                }
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(r => r._id !== action.payload);
            });
    },
});

export const { clearRoomError } = roomSlice.actions;
export default roomSlice.reducer;
