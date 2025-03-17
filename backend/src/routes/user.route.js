import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

import { 
  registerUser, 
  loginUser, 
  logoutUser,
  getCurrentUser,
  checkAuth
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser); 
router.get('/check-auth', protect, checkAuth); 


export default router;