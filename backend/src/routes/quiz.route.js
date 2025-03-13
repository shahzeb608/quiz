import express from "express";
import { getAllQuizzes, getQuizById, submitQuiz } from "../controllers/quiz.controller.js"; // Import submitQuiz
import { protect } from "../middlewares/auth.middleware.js"; // Add authentication middleware

const router = express.Router();

router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/:quizId/submit", protect, submitQuiz); // Add this route

export default router;