import Dashboard, {
  createEmptyDashboardPayload,
} from "../models/Dashboard.js";
import MockInterview from "../models/MockInterview.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

const buildRecommendations = ({ dashboard, latestInterview, latestResume }) => {
  const recommendations = [];

  if (!dashboard.resumeMatch) {
    recommendations.push({
      description: "Upload your resume to unlock ATS score, keyword gaps, and profile improvements.",
      icon: "description",
      label: "Analyze",
      path: "/resume-analyzer",
      title: "Run Resume Analyzer",
    });
  } else if (dashboard.resumeMatch < 80) {
    recommendations.push({
      description:
        latestResume?.missingKeywords?.length
          ? `Add missing keywords like ${latestResume.missingKeywords.slice(0, 3).join(", ")}.`
          : "Improve your resume keywords and impact bullets to raise your ATS match.",
      icon: "auto_fix_high",
      label: "Improve",
      path: "/resume-analyzer",
      title: "Boost Resume Match",
    });
  }

  if (!dashboard.readinessScore) {
    recommendations.push({
      description: "Start a mock interview so PrepWise can score your clarity and technical depth.",
      icon: "forum",
      label: "Start",
      path: "/mock-interview",
      title: "Begin Mock Interview",
    });
  } else if (dashboard.readinessScore < 75) {
    recommendations.push({
      description:
        latestInterview?.feedback?.[0] ||
        "Practice one more answer and focus on clearer structure and stronger examples.",
      icon: "record_voice_over",
      label: "Practice",
      path: "/mock-interview",
      title: "Improve Interview Readiness",
    });
  }

  if (!dashboard.dsaTotal || dashboard.dsaSolved < Math.max(1, Math.ceil(dashboard.dsaTotal * 0.25))) {
    recommendations.push({
      description: "Solve a few more DSA questions to build momentum and update your streak.",
      icon: "code",
      label: "Solve",
      path: "/dsa-practice",
      title: "Continue DSA Practice",
    });
  }

  if (dashboard.dailyStreak === 0) {
    recommendations.push({
      description: "Complete one preparation task today to start your daily progress streak.",
      icon: "local_fire_department",
      label: "Start",
      path: "/dsa-practice",
      title: "Start Today's Streak",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      description: "Your core preparation signals are active. Keep the pace with a focused mock round.",
      icon: "auto_awesome",
      label: "Continue",
      path: "/mock-interview",
      title: "Keep Momentum",
    });
  }

  return recommendations.slice(0, 3);
};

export const getUserProfile = (req, res) => {
  res.status(200).json(req.user);
};

export const getDashboardStats = async (req, res) => {
  const dashboard = await Dashboard.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: createEmptyDashboardPayload(req.user._id) },
    { returnDocument: "after", upsert: true }
  );
  const [latestInterview, latestResume] = await Promise.all([
    MockInterview.findOne({ user: req.user._id }).sort({ updatedAt: -1 }),
    ResumeAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 }),
  ]);
  const recommendations = buildRecommendations({
    dashboard,
    latestInterview,
    latestResume,
  });

  dashboard.recommendations = recommendations;
  await dashboard.save();

  res.status(200).json({
    activity: {
      "7d": dashboard.activity?.last7Days || [],
      "30d": dashboard.activity?.last30Days || [],
    },
    notifications: dashboard.notifications || [],
    readiness: {
      cohort: dashboard.readinessCohort || "",
      score: dashboard.readinessScore || 0,
    },
    recentPractice: dashboard.recentPractice || [],
    recommendations,
    stats: {
      aptitudePercentile: dashboard.aptitudePercentile || 0,
      dailyStreak: dashboard.dailyStreak || 0,
      dsaSolved: dashboard.dsaSolved || 0,
      dsaTotal: dashboard.dsaTotal || 0,
      resumeMatch: dashboard.resumeMatch || 0,
    },
    upcoming: dashboard.upcoming || {},
    user: {
      email: req.user.email,
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
};
