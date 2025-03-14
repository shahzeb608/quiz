import { Quiz } from '../models/quiz.model.js';
import { User } from '../models/user.model.js'; 
import { Leaderboard } from '../models/leaderboard.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find();
    res.json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

export const getQuizById = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }
    res.json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});



export const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  const userId = req.user._id; 

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  let score = 0;
  quiz.questions.forEach((question) => {
    if (answers[question._id.toString()] === question.correctAnswer) {
      score++;
    }
  });

  
  await User.findByIdAndUpdate(userId, {
    $push: {
      quizzesTaken: {
        quizId: quiz._id,
        score,
        attemptedAt: new Date(),
      },
    },
  });

  
  await Leaderboard.create({
    user: userId, 
    quizId: quiz._id,
    score,
    attemptedAt: new Date(),
  });

  res.status(200).json(
    new ApiResponse(200, { score }, "Quiz submitted successfully")
  );
});