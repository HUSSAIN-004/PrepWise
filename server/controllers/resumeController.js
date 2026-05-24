import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import Dashboard from "../models/Dashboard.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

const clampScore = (value) => {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const normalizeList = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
};

let cachedGeminiModel;

const normalizeModelName = (model) => model.replace(/^models\//, "");

const listAvailableGeminiModel = async (apiKey) => {
  if (cachedGeminiModel) {
    return cachedGeminiModel;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to list Gemini models");
  }

  const models = data.models || [];
  const generateContentModels = models.filter((model) =>
    model.supportedGenerationMethods?.includes("generateContent")
  );
  const preferredModels = [
    "models/gemini-2.5-pro",
    "models/gemini-2.5-flash",
    "models/gemini-2.0-flash",
    "models/gemini-2.0-flash-lite",
  ];
  const selected =
    preferredModels.find((name) =>
      generateContentModels.some((model) => model.name === name)
    ) || generateContentModels[0]?.name;

  if (!selected) {
    throw new Error("No Gemini model with generateContent support is available for this API key");
  }

  cachedGeminiModel = normalizeModelName(selected);

  return cachedGeminiModel;
};

const extractJson = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini returned an invalid analysis format");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

const extractResumeText = async (file) => {
  if (!file) {
    throw new Error("Resume file is required");
  }

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text;
  }

  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return data.value;
  }

  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf8");
  }

  throw new Error("Only PDF, DOCX, and TXT resumes are supported");
};

const callGemini = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const configuredModel = normalizeModelName(
    process.env.GEMINI_MODEL || "gemini-2.5-flash"
  );

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const prompt = `
Analyze this resume for ATS and technical hiring readiness.
Return only valid JSON with this exact shape:
{
  "atsScore": number from 0 to 100,
  "roleMatch": "short role/category match",
  "summary": "2 sentence summary",
  "keywords": ["detected skill or keyword"],
  "missingKeywords": ["important missing keyword"],
  "strengths": ["specific strength"],
  "weaknesses": ["specific weakness"],
  "feedback": ["actionable improvement"]
}

Resume:
${resumeText.slice(0, 30000)}
`;

  const generateWithModel = async (model) => fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  let response = await generateWithModel(configuredModel);
  let data = await response.json();

  if (!response.ok && response.status === 404) {
    const availableModel = await listAvailableGeminiModel(apiKey);
    response = await generateWithModel(availableModel);
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini analysis failed");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini did not return analysis text");
  }

  return extractJson(text);
};

export const analyzeResume = async (req, res) => {
  try {
    const resumeText = await extractResumeText(req.file);

    if (!resumeText.trim() || resumeText.trim().length < 80) {
      return res.status(400).json({
        message: "Could not read enough resume text from this file",
      });
    }

    const aiResult = await callGemini(resumeText);
    const analysis = await ResumeAnalysis.create({
      atsScore: clampScore(aiResult.atsScore),
      feedback: normalizeList(aiResult.feedback),
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      keywords: normalizeList(aiResult.keywords),
      missingKeywords: normalizeList(aiResult.missingKeywords),
      roleMatch: String(aiResult.roleMatch || ""),
      strengths: normalizeList(aiResult.strengths),
      summary: String(aiResult.summary || ""),
      user: req.user._id,
      weaknesses: normalizeList(aiResult.weaknesses),
    });

    await Dashboard.findOneAndUpdate(
      { user: req.user._id },
      {
        $setOnInsert: {
          user: req.user._id,
        },
        $set: {
          resumeMatch: analysis.atsScore,
        },
      },
      { returnDocument: "after", upsert: true }
    );

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLatestResumeAnalysis = async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json(analysis);
};
