import express from "express";

import protect from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/dashboard", protect, getDashboardStats);

export default router;
