import Dashboard from "../models/Dashboard.js";
import MockInterview from "../models/MockInterview.js";
import { generateGeminiJson } from "../services/geminiService.js";

const clampScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const normalizeList = (value, fallback = []) => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 6);
};

const normalizeMetrics = (metrics = {}) => ({
  clarity: clampScore(metrics.clarity),
  confidence: clampScore(metrics.confidence),
  technicalDepth: clampScore(metrics.technicalDepth),
});

const defaultSession = {
  areas: ["Problem Identification", "Alternative Approaches", "Scalability Considerations"],
  currentQuestion:
    "Describe a challenging technical problem you solved recently. Walk me through your thought process, the trade-offs you considered, and why you chose your specific implementation.",
  feedback: [
    "Answer naturally, then use the feedback panel to tighten the next response.",
  ],
  metrics: {
    clarity: 0,
    confidence: 0,
    technicalDepth: 0,
  },
  scenario: "System Design & Architecture",
};

const buildStartPrompt = (role) => `
Create the first question for a realistic technical mock interview.
Return only valid JSON:
{
  "scenario": "short interview scenario title",
  "question": "one interview question",
  "areas": ["3 key areas the candidate should cover"],
  "welcome": "short welcome message"
}
Role: ${role}
`;

const buildReplyPrompt = (session, answer) => `
You are an expert technical interviewer. Evaluate the candidate's latest answer, then ask the next best follow-up question.
Return only valid JSON:
{
  "reply": "brief interviewer response plus next question",
  "nextQuestion": "the next/current question only",
  "feedback": ["2 concise actionable feedback items"],
  "metrics": {
    "confidence": number 0-100,
    "clarity": number 0-100,
    "technicalDepth": number 0-100
  },
  "areas": ["3 key areas to cover for the next question"]
}

Interview scenario: ${session.scenario}
Current question: ${session.currentQuestion}
Candidate answer: ${answer}
Recent messages:
${session.messages.slice(-6).map((message) => `${message.role}: ${message.text}`).join("\n")}
`;

export const getLatestMockInterview = async (req, res) => {
  const session = await MockInterview.findOne({ user: req.user._id }).sort({
    updatedAt: -1,
  });

  res.status(200).json(session);
};

export const startMockInterview = async (req, res) => {
  try {
    const role = req.body.role || "Software Engineer";
    let generated;

    try {
      generated = await generateGeminiJson(buildStartPrompt(role));
    } catch (error) {
      generated = {};
    }

    const scenario = String(generated.scenario || defaultSession.scenario);
    const currentQuestion = String(generated.question || defaultSession.currentQuestion);
    const welcome = String(
      generated.welcome ||
        `Welcome to your ${role} mock interview. Let's begin with the first question.`
    );

    const session = await MockInterview.create({
      areas: normalizeList(generated.areas, defaultSession.areas),
      currentQuestion,
      feedback: defaultSession.feedback,
      messages: [
        {
          role: "ai",
          text: welcome,
        },
        {
          role: "ai",
          text: currentQuestion,
        },
      ],
      metrics: defaultSession.metrics,
      role,
      scenario,
      user: req.user._id,
    });

    await Dashboard.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          user: req.user._id,
        },
        $set: {
          upcoming: {
            interviewer: "Gemini AI",
            path: "/mock-interview",
            time: "Active now",
            title: `${role} Mock Interview`,
          },
        },
      },
      { returnDocument: "after", upsert: true }
    );

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const answerMockInterview = async (req, res) => {
  try {
    const { answer } = req.body;
    const session = await MockInterview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Interview session not found",
      });
    }

    if (!answer?.trim()) {
      return res.status(400).json({
        message: "Answer is required",
      });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        message: "Resume the interview before submitting an answer",
      });
    }

    session.messages.push({
      role: "user",
      text: answer.trim(),
    });

    const generated = await generateGeminiJson(buildReplyPrompt(session, answer.trim()));
    const aiReply = String(generated.reply || "Thank you. Let's move to the next question.");

    session.currentQuestion = String(generated.nextQuestion || session.currentQuestion);
    session.areas = normalizeList(generated.areas, session.areas);
    session.feedback = normalizeList(generated.feedback, session.feedback);
    session.metrics = normalizeMetrics(generated.metrics);
    session.messages.push({
      role: "ai",
      text: aiReply,
    });
    session.status = "active";

    await session.save();

    const readinessScore = Math.round(
      (session.metrics.confidence + session.metrics.clarity + session.metrics.technicalDepth) / 3
    );

    await Dashboard.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          user: req.user._id,
        },
        $set: {
          readinessCohort: session.role,
          readinessScore,
        },
      },
      { returnDocument: "after", upsert: true }
    );

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMockInterviewStatus = async (req, res) => {
  const status = ["active", "paused", "completed"].includes(req.body.status)
    ? req.body.status
    : "active";
  const session = await MockInterview.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    { status },
    { returnDocument: "after" }
  );

  if (!session) {
    return res.status(404).json({
      message: "Interview session not found",
    });
  }

  if (status === "completed") {
    await Dashboard.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          user: req.user._id,
        },
        $set: {
          upcoming: {},
        },
      },
      { returnDocument: "after", upsert: true }
    );
  }

  res.status(200).json(session);
};
