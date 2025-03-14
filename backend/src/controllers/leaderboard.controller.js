import { asyncHandler } from "../utils/asyncHandler.js";
import { Leaderboard } from '../models/leaderboard.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";

export const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await Leaderboard.find()
      .populate("user", "username") 
      .populate("quizId", "title") 
      .sort({ score: -1, attemptedAt: 1 }) 
      .limit(10); 
  
    res.json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"));
  });