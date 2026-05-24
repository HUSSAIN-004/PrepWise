import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["ai", "user"], required: true },
    text: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const metricsSchema = new mongoose.Schema(
  {
    clarity: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    technicalDepth: { type: Number, default: 0 },
  },
  { _id: false }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    areas: { type: [String], default: [] },
    currentQuestion: { type: String, required: true },
    feedback: { type: [String], default: [] },
    messages: { type: [messageSchema], default: [] },
    metrics: { type: metricsSchema, default: () => ({}) },
    role: { type: String, default: "Software Engineer" },
    scenario: { type: String, default: "Technical Interview" },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;
