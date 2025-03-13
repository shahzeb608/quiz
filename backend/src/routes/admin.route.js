import express from "express";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import { 
  adminLogin, 
  getAdminDashboard, 
  getUsers, 
  getQuizzes, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  banUser, 
  unbanUser, 
  deleteUser 
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminLogin);

router.get("/dashboard", protect, isAdmin, getAdminDashboard);
router.get("/users", protect, isAdmin, getUsers);
router.patch("/users/:id/ban", protect, isAdmin, banUser);
router.patch("/users/:id/unban", protect, isAdmin, unbanUser);  
router.delete("/users/:id", protect, isAdmin, deleteUser);

router.get("/quizzes", protect, isAdmin, getQuizzes);
router.post("/quizzes", protect, isAdmin, createQuiz); 
router.patch("/quizzes/:id", protect, isAdmin, updateQuiz);
router.delete("/quizzes/:id", protect, isAdmin, deleteQuiz);

export default router;
