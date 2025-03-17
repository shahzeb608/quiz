import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000/api";

// Fetch all quizzes (admin view)
export const fetchQuizzes = createAsyncThunk('quizzes/fetchQuizzes', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/quizzes`, {
      withCredentials: true
    });
    console.log("Quizzes response:", response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch quizzes");
  }
});

// Fetch public quizzes (for homepage)
export const fetchPublicQuizzes = createAsyncThunk('quizzes/fetchPublicQuizzes', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes`);
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch public quizzes");
  }
});

// Fetch a single quiz
export const fetchQuizById = createAsyncThunk('quizzes/fetchQuizById', async (quizId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch quiz");
  }
});

// Create a new quiz (admin only)
export const createQuiz = createAsyncThunk('quizzes/createQuiz', async (quizData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/quizzes`, quizData, {
      withCredentials: true
    });
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create quiz");
  }
});

// Update an existing quiz (admin only)
export const updateQuiz = createAsyncThunk('quizzes/updateQuiz', async ({ quizId, quizData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/admin/quizzes/${quizId}`, quizData, {
      withCredentials: true
    });
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update quiz");
  }
});

// Delete a quiz (admin only)
export const deleteQuiz = createAsyncThunk('quizzes/deleteQuiz', async (quizId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/admin/quizzes/${quizId}`, {
      withCredentials: true
    });
    return quizId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete quiz");
  }
});


export const submitQuizAttempt = createAsyncThunk('quizzes/submitAttempt', async ({ quizId, answers }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/${quizId}/submit`, { answers }, {
      withCredentials: true
    });
    return response.data.data || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to submit quiz");
  }
});

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    publicQuizzes: [],
    currentQuiz: null,
    status: 'idle',
    error: null,
    submissionResult: null
  },
  reducers: {
    clearQuizzesError: (state) => {
      state.error = null;
    },
    clearSubmissionResult: (state) => {
      state.submissionResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch quizzes';
      })
      
      
      .addCase(fetchPublicQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.publicQuizzes = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch public quizzes';
      })
      
      
      .addCase(fetchQuizById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuiz = action.payload;
        state.error = null;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch quiz';
      })
    
      
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
      
      
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      
  
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.payload);
      })
      
      
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.submissionResult = action.payload;
      });
  },
});

export const { clearQuizzesError, clearSubmissionResult } = quizzesSlice.actions;
export default quizzesSlice.reducer;