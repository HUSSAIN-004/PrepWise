import AdminContent from "../models/AdminContent.js";
import AptitudeAttempt from "../models/AptitudeAttempt.js";
import MockInterview from "../models/MockInterview.js";
import QuestionProgress from "../models/QuestionProgress.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import User from "../models/User.js";

const normalizeContentPayload = ({ category, correctOption, difficulty, explanation, options = [], prompt }) => {
  const normalizedPrompt = String(prompt || "").trim();
  const normalizedOptions = options.map((option) => String(option || "").trim());
  const parsedCorrectOption = Number(correctOption);

  if (!category || !difficulty || !normalizedPrompt) {
    return {
      error: "Category, difficulty, and prompt are required",
    };
  }

  if (category === "Quantitative Aptitude") {
    const hasBlankOptions = normalizedOptions.length < 4 || normalizedOptions.some((option) => !option);
    const hasValidAnswer = Number.isInteger(parsedCorrectOption)
      && parsedCorrectOption >= 0
      && parsedCorrectOption < normalizedOptions.length;

    if (hasBlankOptions || !hasValidAnswer) {
      return {
        error: "Aptitude content requires four options and a correct answer",
      };
    }

    return {
      payload: {
        category,
        correctOption: parsedCorrectOption,
        difficulty,
        explanation: String(explanation || "").trim(),
        options: normalizedOptions,
        prompt: normalizedPrompt,
      },
    };
  }

  return {
    payload: {
      category,
      correctOption: undefined,
      difficulty,
      explanation: String(explanation || "").trim(),
      options: [],
      prompt: normalizedPrompt,
    },
  };
};

export const getAdminOverview = async (req, res) => {
  const [
    totalUsers,
    activeInterviews,
    activeAptitudeAttempts,
    resumeAnalyses,
    dsaProgress,
    contentCount,
    recentUsers,
    recentContent,
  ] = await Promise.all([
    User.countDocuments(),
    MockInterview.countDocuments({ status: "active" }),
    AptitudeAttempt.countDocuments({ status: "active" }),
    ResumeAnalysis.countDocuments(),
    QuestionProgress.countDocuments(),
    AdminContent.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(8).select("name email role createdAt updatedAt"),
    AdminContent.find().sort({ createdAt: -1 }).limit(6).populate("user", "name email"),
  ]);

  res.status(200).json({
    metrics: {
      activeTests: activeInterviews + activeAptitudeAttempts,
      contentCount,
      dsaUsers: dsaProgress,
      resumeAnalyses,
      totalUsers,
    },
    recentContent,
    recentUsers,
  });
};

export const createAdminContent = async (req, res) => {
  const { error, payload } = normalizeContentPayload(req.body);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  const content = await AdminContent.create({
    ...payload,
    user: req.user._id,
  });

  res.status(201).json(content);
};

export const updateAdminContent = async (req, res) => {
  const { error, payload } = normalizeContentPayload(req.body);

  if (error) {
    return res.status(400).json({
      message: error,
    });
  }

  const content = await AdminContent.findByIdAndUpdate(
    req.params.id,
    payload,
    { returnDocument: "after" }
  );

  if (!content) {
    return res.status(404).json({
      message: "Content not found",
    });
  }

  res.status(200).json(content);
};

export const deleteAdminContent = async (req, res) => {
  const content = await AdminContent.findByIdAndDelete(req.params.id);

  if (!content) {
    return res.status(404).json({
      message: "Content not found",
    });
  }

  res.status(200).json({
    message: "Content deleted",
  });
};
