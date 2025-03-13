import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URLs for user and admin endpoints
const USER_API_BASE = "http://localhost:8000/api/users";
const ADMIN_API_BASE = "http://localhost:8000/api/admin";

// Thunk for user sign up
const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API_BASE}/register`, {
        username: userData.name, // Convert `name` to `username`
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// Thunk for user login
const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${USER_API_BASE}/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Thunk for admin login
const adminLogIn = createAsyncThunk(
  "auth/adminLogIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ADMIN_API_BASE}/login`, credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Admin login failed");
    }
  }
);

// Thunk for logout
const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  dispatch(logOut());
});

// Thunk to check authentication status
const checkAuth = () => (dispatch, getState) => {
  const { auth } = getState();
  return Boolean(auth && auth.token && auth.user);
};

// Load stored user from localStorage (if available)
const storedUser = localStorage.getItem("user");

// Initial state, loading token and user from localStorage
const initialState = {
  user: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("authToken") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sign up
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload === "Email already exists"
            ? "This email is already registered. Try logging in!"
            : action.payload;
      })
      // Handle user login
      .addCase(logIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle admin login
      .addCase(adminLogIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(adminLogIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(adminLogIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logOut } = authSlice.actions;
export { checkAuth, adminLogIn, logoutUser, logIn, signUp };
export default authSlice.reducer;
