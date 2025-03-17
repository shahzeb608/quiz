import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api/admin";

// Fetch all users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      withCredentials: true
    });
    console.log("Users response:", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

// Ban a user
export const banUser = createAsyncThunk('users/banUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}/ban`, {}, {
      withCredentials: true
    });
    return { userId, data: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to ban user");
  }
});

// Unban a user
export const unbanUser = createAsyncThunk('users/unbanUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}/unban`, {}, {
      withCredentials: true
    });
    return { userId, data: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to unban user");
  }
});

// Delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${userId}`, {
      withCredentials: true
    });
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { 
    list: [], 
    status: 'idle', 
    error: null 
  },
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch users';
      })
      
      // Ban User
      .addCase(banUser.fulfilled, (state, action) => {
        const user = state.list.find(u => u._id === action.payload.userId);
        if (user) {
          user.isBanned = true;
        }
      })
      
      // Unban User
      .addCase(unbanUser.fulfilled, (state, action) => {
        const user = state.list.find(u => u._id === action.payload.userId);
        if (user) {
          user.isBanned = false;
        }
      })
      
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u._id !== action.payload);
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;