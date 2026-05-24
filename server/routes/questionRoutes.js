import express from "express";
import {
  getQuestionProgress,
  getQuestions,
  markQuestionSolved,
} from "../controllers/questionController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getQuestions);
router.get("/progress", protect, getQuestionProgress);
router.post("/solve", protect, markQuestionSolved);

export default router;
