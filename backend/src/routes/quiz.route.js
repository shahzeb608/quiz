import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getAllQuizzes, getQuizById, submitQuiz } from '../controllers/quiz.controller.js';

const router = express.Router();

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:quizId/submit', protect, submitQuiz);

export default router;