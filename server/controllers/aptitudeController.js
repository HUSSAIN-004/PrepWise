import AptitudeAttempt from "../models/AptitudeAttempt.js";
import AdminContent from "../models/AdminContent.js";
import Dashboard from "../models/Dashboard.js";
import { categoryMeta } from "../data/aptitudeQuestions.js";

const OPEN_TDB_URL = "https://opentdb.com/api.php?amount=50&category=18";

const decodeHtml = (value) =>
  String(value)
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&eacute;/g, "e");

const shuffle = (items) =>
  [...items].sort(() => Math.random() - 0.5);

const normalizeDifficulty = (difficulty) => {
  if (difficulty === "easy") {
    return "Beginner";
  }

  if (difficulty === "hard") {
    return "Advanced";
  }

  return "Intermediate";
};

const mapApiQuestion = (item, category) => {
  const correctAnswer = decodeHtml(item.correct_answer);
  const options = shuffle([
    correctAnswer,
    ...item.incorrect_answers.map(decodeHtml),
  ]);

  return {
    category,
    correctOption: options.findIndex((option) => option === correctAnswer),
    difficulty: normalizeDifficulty(item.difficulty),
    explanation: `Correct answer: ${correctAnswer}`,
    options,
    question: decodeHtml(item.question),
  };
};

const fetchOpenTdbQuestions = async (category) => {
  const response = await fetch(OPEN_TDB_URL);
  const data = await response.json();

  if (!response.ok || data.response_code !== 0) {
    throw new Error("Could not fetch aptitude questions from Open Trivia DB");
  }

  const difficultyByCategory = {
    logical: "medium",
    quantitative: "hard",
    verbal: "easy",
  };
  const preferredDifficulty = difficultyByCategory[category];
  const preferredQuestions = data.results.filter(
    (item) => item.difficulty === preferredDifficulty
  );
  const sourceQuestions = preferredQuestions.length >= 5 ? preferredQuestions : data.results;

  return sourceQuestions.slice(0, 10).map((item) => mapApiQuestion(item, category));
};

const mapAdminAptitudeQuestion = (item) => ({
  category: "quantitative",
  correctOption: item.correctOption,
  difficulty: item.difficulty === "Easy" ? "Beginner" : item.difficulty === "Hard" ? "Advanced" : "Intermediate",
  explanation: item.explanation || `Correct answer: ${item.options[item.correctOption]}`,
  options: item.options,
  question: item.prompt,
});

const fetchAdminAptitudeQuestions = async () => {
  const items = await AdminContent.find({
    category: "Quantitative Aptitude",
    correctOption: { $type: "number" },
    "options.1": { $exists: true },
  }).sort({ createdAt: -1 }).limit(10);

  return items.map(mapAdminAptitudeQuestion);
};

const sanitizeQuestion = (question, index) => ({
  category: question.category,
  difficulty: question.difficulty,
  index,
  options: question.options,
  question: question.question,
});

const buildStats = async (userId) => {
  const attempts = await AptitudeAttempt.find({ user: userId, status: "completed" });
  const bestScore = attempts.reduce((best, attempt) => Math.max(best, attempt.score), 0);
  const totalCorrect = attempts.reduce(
    (sum, attempt) => sum + attempt.answers.filter((answer) => answer.correct).length,
    0
  );
  const totalAnswered = attempts.reduce((sum, attempt) => sum + attempt.answers.length, 0);
  const completedByCategory = attempts.reduce((acc, attempt) => {
    acc[attempt.category] = Math.max(acc[attempt.category] || 0, attempt.score);
    return acc;
  }, {});

  return {
    accuracy: totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    attempts: attempts.length,
    percentile: bestScore,
    progress: Object.keys(categoryMeta).reduce((acc, category) => {
      acc[category] = completedByCategory[category] || 0;
      return acc;
    }, {}),
  };
};

export const getAptitudeStats = async (req, res) => {
  const stats = await buildStats(req.user._id);

  res.status(200).json({
    categories: categoryMeta,
    stats,
  });
};

export const startAptitudeAttempt = async (req, res) => {
  try {
    const category = req.body.category || "quantitative";

    if (!categoryMeta[category]) {
      return res.status(400).json({
        message: "Invalid aptitude category",
      });
    }

    const adminQuestions = category === "quantitative" ? await fetchAdminAptitudeQuestions() : [];
    const apiQuestions = await fetchOpenTdbQuestions(category);
    const questions = [...adminQuestions, ...apiQuestions].slice(0, 10);

    const attempt = await AptitudeAttempt.create({
      category,
      questions,
      totalQuestions: questions.length,
      user: req.user._id,
    });

    res.status(201).json({
      attemptId: attempt._id,
      category,
      meta: categoryMeta[category],
      questions: questions.map(sanitizeQuestion),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const submitAptitudeAttempt = async (req, res) => {
  const attempt = await AptitudeAttempt.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!attempt) {
    return res.status(404).json({
      message: "Aptitude attempt not found",
    });
  }

  const questions = attempt.questions;

  if (!questions.length) {
    return res.status(400).json({
      message: "This attempt does not have saved questions. Please start a new test.",
    });
  }
  const submittedAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const answers = questions.map((question, index) => {
    const selectedOption = Number(submittedAnswers[index]);

    return {
      correct: selectedOption === question.correctOption,
      questionIndex: index,
      selectedOption: Number.isNaN(selectedOption) ? -1 : selectedOption,
    };
  });
  const correctCount = answers.filter((answer) => answer.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  attempt.answers = answers;
  attempt.score = score;
  attempt.status = "completed";
  await attempt.save();

  const stats = await buildStats(req.user._id);

  await Dashboard.findOneAndUpdate(
    { user: req.user._id },
    {
      $setOnInsert: {
        user: req.user._id,
      },
      $set: {
        aptitudePercentile: stats.percentile,
      },
    },
    { returnDocument: "after", upsert: true }
  );

  res.status(200).json({
    answers,
    explanations: questions.map((question) => question.explanation),
    score,
    stats,
  });
};
