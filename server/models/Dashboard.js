import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    icon: { type: String, required: true },
    label: { type: String, required: true },
    path: { type: String, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);

const recentPracticeSchema = new mongoose.Schema(
  {
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    title: { type: String, required: true },
    topic: { type: String, required: true },
  },
  { _id: false }
);

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    read: { type: Boolean },
  },
  { _id: false }
);

export const createEmptyDashboardPayload = (userId) => ({
  activity: {
    last30Days: [],
    last7Days: [],
  },
  aptitudePercentile: 0,
  dailyStreak: 0,
  dsaSolved: 0,
  dsaTotal: 0,
  notifications: [],
  readinessCohort: "",
  readinessScore: 0,
  recentPractice: [],
  recommendations: [],
  resumeMatch: 0,
  upcoming: {},
  user: userId,
});

const dashboardSchema = new mongoose.Schema(
  {
    activity: {
      last30Days: { type: [Number] },
      last7Days: { type: [Number] },
    },
    aptitudePercentile: { type: Number },
    dailyStreak: { type: Number },
    dsaSolved: { type: Number },
    dsaTotal: { type: Number },
    notifications: { type: [notificationSchema] },
    readinessCohort: { type: String },
    readinessScore: { type: Number },
    recentPractice: { type: [recentPracticeSchema] },
    recommendations: { type: [recommendationSchema] },
    resumeMatch: { type: Number },
    upcoming: {
      interviewer: { type: String },
      path: { type: String },
      time: { type: String },
      title: { type: String },
    },
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

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;
