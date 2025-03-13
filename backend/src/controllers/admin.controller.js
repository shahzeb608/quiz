import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Quiz } from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password)) || user.role !== "admin") {
    return res.status(401).json({ message: "Invalid credentials or unauthorized" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

  // Set token in a secure HTTP-only cookie
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

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
  
    if (!deletedQuiz) return res.status(404).json({ message: "Quiz not found" });
  
    await User.updateMany({}, { $pull: { quizzesTaken: { quizId: id } } });
  
    res.json({ message: "Quiz deleted successfully", id });
  });
  

export const banUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isBanned: true }, { new: true });
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    res.json({ message: "User banned successfully", user });
  });
  
  export const unbanUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
  
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isBanned) return res.status(400).json({ message: "User is not banned" });
  
    await User.findByIdAndUpdate(id, { isBanned: false });
  
    res.json({ message: "User unbanned successfully" });
  });
  

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    if (user.role === "admin") return res.status(403).json({ message: "Admin accounts cannot be deleted" });
  
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  });
  

export const getQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find().lean();
    res.json(quizzes);
  });
  export const createQuiz = asyncHandler(async (req, res) => {
    const { title, questions, duration } = req.body;
  
    if (!title || !Array.isArray(questions) || questions.length === 0 || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    for (const question of questions) {
      if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2 || !question.correctAnswer) {
        return res.status(400).json({ message: "Each question must have a questionText, at least two options, and a correctAnswer" });
      }
    }
  
    const newQuiz = await Quiz.create({ title, questions, duration });
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  });


  export const updateQuiz = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, questions, duration } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    if (!title || !Array.isArray(questions) || questions.length === 0 || !duration) {
        throw new ApiError(400, "All fields are required");
    }

    for (const question of questions) {
        if (!question.questionText || !Array.isArray(question.options) || question.options.length < 2 || !question.correctAnswer) {
            throw new ApiError(400, "Each question must have a questionText, at least two options, and a correctAnswer");
        }
    }

    quiz.title = title;
    quiz.questions = questions;
    quiz.duration = duration;

    const updatedQuiz = await quiz.save();

    res.json(new ApiResponse(200, updatedQuiz, "Quiz updated successfully"));
});