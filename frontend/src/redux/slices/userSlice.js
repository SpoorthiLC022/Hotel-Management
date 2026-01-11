import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/users');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
});

// Create user
export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', userData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({ id, userData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/users/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
});

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create user
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            // Update user
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            });
    },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
