import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const USER_API_BASE = 'http://localhost:8000/api/users';
const ADMIN_API_BASE = 'http://localhost:8000/api/admin';


const signUp = createAsyncThunk(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API_BASE}/register`, {
        username: userData.name,
        email: userData.email,
        password: userData.password,
      }, { withCredentials: true });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      return rejectWithValue(errorMessage);
    }
  }
);


const logIn = createAsyncThunk(
  'auth/logIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API_BASE}/login`, credentials, {
        withCredentials: true
      });
      
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const adminLogIn = createAsyncThunk(
  'auth/adminLogIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ADMIN_API_BASE}/login`, credentials, {
        withCredentials: true
      });
      
      
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      return rejectWithValue(errorMessage);
    }
  }
);



const logoutUser = createAsyncThunk(
  "auth/logout", 
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${USER_API_BASE}/logout`, {}, {
        withCredentials: true
      });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);


const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_API_BASE}/check-auth`, {
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
    logOut: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(logIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data.user;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(adminLogIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(adminLogIn.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(adminLogIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })
      .addCase(logoutUser.rejected, (state) => {
        
        state.user = null;
        state.status = 'idle';
      })
      
      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const { logOut } = authSlice.actions;
export { checkAuth, adminLogIn, logoutUser, logIn, signUp };
export default authSlice.reducer;