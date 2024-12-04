import express from "express";
import { User } from "../models/userModel.js";

import {
  register,
  login,
  google,
  logout,
  
} from "../controllers/userController.js";
import { isAuthenticated ,isAdmin,authenticateJWT } from "../middlewares/auth.js";


const router = express.Router();

router.post("/register",  register);

router.post("/login", login);
router.post('/google',google);
router.get("/logout",isAuthenticated, logout);

router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure this matches the middleware

    if (!userId) {
      return res.status(400).json({ message: 'Invalid request: user not authenticated' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Server error in /me route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



export default router;