import { asyncHandler } from "../utils/asyncHandler.js";
import { Leaderboard } from '../models/leaderboard.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";

export const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await Leaderboard.find()
      .populate("user", "username") // Populate the username from the User model
      .populate("quizId", "title") // Populate the quiz title
      .sort({ score: -1, attemptedAt: 1 }) // Sort by score (descending) and attemptedAt (ascending)
      .limit(10); // Limit to top 10 entries
  
    res.json(new ApiResponse(200, leaderboard, "Leaderboard fetched successfully"));
  });