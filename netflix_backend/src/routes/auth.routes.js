import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  updatePassword,
  logout,
  logoutAll,
  getSessions,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);
router.get("/sessions", protect, getSessions);

export default router;
