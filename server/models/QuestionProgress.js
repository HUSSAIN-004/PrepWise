import mongoose from "mongoose";

const solvedQuestionSchema = new mongoose.Schema(
  {
    difficulty: { type: String },
    slug: { type: String, required: true },
    solvedAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const questionProgressSchema = new mongoose.Schema(
  {
    currentStreak: { type: Number, default: 0 },
    lastSolvedAt: { type: Date },
    solvedQuestions: { type: [solvedQuestionSchema], default: [] },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionProgress = mongoose.model("QuestionProgress", questionProgressSchema);

export default QuestionProgress;
