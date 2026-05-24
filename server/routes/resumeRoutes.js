import express from "express";
import multer from "multer";
import {
  analyzeResume,
  getLatestResumeAnalysis,
} from "../controllers/resumeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: multer.memoryStorage(),
});

const uploadResume = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Resume must be 5MB or smaller"
            : error.message,
      });
    }

    next();
  });
};

router.get("/latest", protect, getLatestResumeAnalysis);
router.post("/analyze", protect, uploadResume, analyzeResume);

export default router;
