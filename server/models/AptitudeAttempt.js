import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    correct: { type: Boolean, required: true },
    questionIndex: { type: Number, required: true },
    selectedOption: { type: Number, required: true },
  },
  { _id: false }
);

const attemptQuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    correctOption: { type: Number, required: true },
    difficulty: { type: String, required: true },
    explanation: { type: String, required: true },
    options: { type: [String], required: true },
    question: { type: String, required: true },
  },
  { _id: false }
);

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    answers: { type: [answerSchema], default: [] },
    category: { type: String, required: true },
    questions: { type: [attemptQuestionSchema], default: [] },
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    totalQuestions: { type: Number, required: true },
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

const AptitudeAttempt = mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);

export default AptitudeAttempt;
