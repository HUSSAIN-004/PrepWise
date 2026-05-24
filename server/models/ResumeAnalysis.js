import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    atsScore: { type: Number, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    feedback: { type: [String], default: [] },
    keywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    roleMatch: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    summary: { type: String, default: "" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weaknesses: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
