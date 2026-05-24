import express from "express";
import {
  answerMockInterview,
  getLatestMockInterview,
  startMockInterview,
  updateMockInterviewStatus,
} from "../controllers/mockInterviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/latest", protect, getLatestMockInterview);
router.post("/start", protect, startMockInterview);
router.post("/:id/answer", protect, answerMockInterview);
router.patch("/:id/status", protect, updateMockInterviewStatus);

export default router;
