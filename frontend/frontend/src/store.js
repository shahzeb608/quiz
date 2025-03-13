import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import quizzesReducer from './features/quizzes/quizzesSlice';
import usersReducer from './features/users/usersSlice';
import leaderboardReducer from "./features/leaderboard/leaderboardSlice"; // Fixed path

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizzesReducer,
    users: usersReducer,
    leaderboard: leaderboardReducer
  },
});

export default store;