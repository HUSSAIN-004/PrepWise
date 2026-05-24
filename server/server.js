import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { validateEnv } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import mockInterviewRoutes from "./routes/mockInterviewRoutes.js";
import aptitudeRoutes from "./routes/aptitudeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();
validateEnv();

connectDB();

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (allowedOrigins.length === 0) {
      callback(null, true);
      return;
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV || "development",
    status: "ok",
    uptime: process.uptime(),
  });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/mock-interviews", mockInterviewRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("PrepWise AI Backend Running");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
