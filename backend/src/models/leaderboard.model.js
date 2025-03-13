import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    attemptedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);