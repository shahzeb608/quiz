import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Fetch quizzes
export const fetchQuizzes = createAsyncThunk("quizzes/fetchQuizzes", async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Get token from Redux store
      const response = await axios.get("http://localhost:8000/api/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch quizzes");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  });
  

// ✅ Define quizzesSlice properly
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {}, // ✅ Make sure this object exists, even if empty
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        console.log("Quizzes fetched:", action.payload);
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// ✅ Export reducer at the end
export default quizzesSlice.reducer;
