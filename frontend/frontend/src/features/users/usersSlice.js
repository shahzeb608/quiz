import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api/admin";


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
});


export const banUser = createAsyncThunk('users/banUser', async (userId) => {
  await axios.patch(`/api/users/${userId}/ban`);
  return userId; 
});


export const unbanUser = createAsyncThunk('users/unbanUser', async (userId) => {
  await axios.patch(`/api/users/${userId}/unban`);
  return userId; 
});


export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
  await axios.delete(`/api/users/${userId}`);
  return userId; 
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        const user = state.list.find((u) => u.id === action.payload);
        if (user) user.banned = true;
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        const user = state.list.find((u) => u.id === action.payload);
        if (user) user.banned = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
