import mongoose from "mongoose";

const adminContentSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    correctOption: { type: Number },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    explanation: { type: String },
    options: { type: [String], default: [] },
    prompt: { type: String, required: true },
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

const AdminContent = mongoose.model("AdminContent", adminContentSchema);

export default AdminContent;
