import Dashboard from "../models/Dashboard.js";
import AdminContent from "../models/AdminContent.js";
import QuestionProgress from "../models/QuestionProgress.js";

const getOrCreateProgress = (userId) =>
  QuestionProgress.findOneAndUpdate(
    { user: userId },
    { $setOnInsert: { user: userId } },
    { returnDocument: "after", upsert: true }
  );

export const getQuestions = async (req, res) => {
  try {
    const adminQuestions = await AdminContent.find({
      category: { $in: ["Data Structures", "Algorithms"] },
    }).sort({ createdAt: -1 });
    const mappedAdminQuestions = adminQuestions.map((item, index) => ({
      difficulty: item.difficulty,
      isAdminContent: true,
      questionFrontendId: `A${index + 1}`,
      source: "PrepWise Admin",
      title: item.prompt,
      titleSlug: `admin-${item._id}`,
      topicTags: [{ name: item.category, slug: item.category.toLowerCase().replaceAll(" ", "-") }],
    }));
    const response = await fetch("https://alfa-leetcode-api.onrender.com/problems");

    if (!response.ok) {
      return res.json(mappedAdminQuestions);
    }

    const data = await response.json();

    res.json([...mappedAdminQuestions, ...(data.problemsetQuestionList || [])]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch questions",
    });
  }
};

export const getQuestionProgress = async (req, res) => {
  const progress = await getOrCreateProgress(req.user._id);

  res.status(200).json({
    currentStreak: progress.currentStreak,
    passed: true,
    solvedQuestions: progress.solvedQuestions,
  });
};

export const markQuestionSolved = async (req, res) => {
  const { difficulty, slug, title, topics = [], totalQuestions = 0 } = req.body;

  if (!slug || !title) {
    return res.status(400).json({
      message: "Question slug and title are required",
    });
  }

  const progress = await getOrCreateProgress(req.user._id);
  const alreadySolved = progress.solvedQuestions.some((question) => question.slug === slug);

  if (!alreadySolved) {
    const now = new Date();
    const previousSolvedDate = progress.lastSolvedAt ? new Date(progress.lastSolvedAt) : null;
    const isSameDay =
      previousSolvedDate &&
      previousSolvedDate.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const continuesStreak =
      previousSolvedDate &&
      previousSolvedDate.toDateString() === yesterday.toDateString();

    progress.solvedQuestions.push({
      difficulty,
      slug,
      title,
      topics,
      solvedAt: now,
    });
    progress.currentStreak = isSameDay
      ? progress.currentStreak
      : continuesStreak
        ? progress.currentStreak + 1
        : 1;
    progress.lastSolvedAt = now;

    await progress.save();
  }

  await Dashboard.findOneAndUpdate(
    { user: req.user._id },
    {
      $setOnInsert: {
        user: req.user._id,
      },
      $set: {
        dailyStreak: progress.currentStreak,
        dsaSolved: progress.solvedQuestions.length,
        dsaTotal: totalQuestions,
        recentPractice: progress.solvedQuestions
          .slice(-4)
          .reverse()
          .map((question) => ({
            difficulty: question.difficulty,
            title: question.title,
            topic: question.topics.join(", ") || "General",
          })),
      },
    },
    { returnDocument: "after", upsert: true }
  );

  res.status(200).json({
    currentStreak: progress.currentStreak,
    solvedQuestions: progress.solvedQuestions,
  });
};
