import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";


const validateQuizData = (quizData) => {
  const { title, questions, duration } = quizData;
  if (!title || !Array.isArray(questions) || questions.length === 0 || !duration) {
    throw new ApiError(400, "All fields are required");
  }
  for (const question of questions) {
    if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2 || !question.correctAnswer) {
      throw new ApiError(400, "Each question must have a questionText, at least two options, and a correctAnswer");
    }
  }
};


export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)) || user.role !== "admin") {
    throw new ApiError(401, "Invalid credentials or unauthorized");
  }

  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

  
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, 
  });

  logger.info("Admin logged in:", user.email);
  res.json({
    token,
    user: { _id: user._id, username: user.username, email: user.email, role: user.role },
  });
});


export const getAdminDashboard = (req, res) => res.json({ message: "Admin Dashboard" });


export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  res.json(users);
});


export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedQuiz = await Quiz.findByIdAndDelete(id);

  if (!deletedQuiz) {
    throw new ApiError(404, "Quiz not found");
  }

  try {
    await User.updateMany({}, { $pull: { quizzesTaken: { quizId: id } } });
  } catch (error) {
    logger.error("Failed to update quizzesTaken:", error);
    throw new ApiError(500, "Failed to clean up user quizzes");
  }

  res.json({ message: "Quiz deleted successfully", id });
});


export const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ message: "User banned successfully", user });
});


export const unbanUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.isBanned) {
    throw new ApiError(400, "User is not banned");
  }

  await User.findByIdAndUpdate(id, { isBanned: false });
  res.json({ message: "User unbanned successfully" });
});


export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role === "admin") {
    throw new ApiError(403, "Admin accounts cannot be deleted");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});


export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find().lean();
  res.json(quizzes);
});


export const createQuiz = asyncHandler(async (req, res) => {
  validateQuizData(req.body);

  const newQuiz = await Quiz.create(req.body);
  res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
});


export const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateQuizData(req.body);

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  quiz.title = req.body.title;
  quiz.questions = req.body.questions;
  quiz.duration = req.body.duration;

  const updatedQuiz = await quiz.save();
  res.json({ message: "Quiz updated successfully", quiz: updatedQuiz });
});