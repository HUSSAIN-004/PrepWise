import express from "express";
import {
  createAdminContent,
  deleteAdminContent,
  getAdminOverview,
  updateAdminContent,
} from "../controllers/adminController.js";
import adminOnly from "../middleware/adminMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/overview", getAdminOverview);
router.post("/content", createAdminContent);
router.put("/content/:id", updateAdminContent);
router.delete("/content/:id", deleteAdminContent);

export default router;
