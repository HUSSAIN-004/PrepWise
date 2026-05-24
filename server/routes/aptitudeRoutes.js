import express from "express";
import {
  getAptitudeStats,
  startAptitudeAttempt,
  submitAptitudeAttempt,
} from "../controllers/aptitudeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getAptitudeStats);
router.post("/start", protect, startAptitudeAttempt);
router.post("/:id/submit", protect, submitAptitudeAttempt);

export default router;
