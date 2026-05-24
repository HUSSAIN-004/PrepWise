let cachedGeminiModels;

const normalizeModelName = (model) => model.replace(/^models\//, "");

const listAvailableGeminiModels = async (apiKey) => {
  if (cachedGeminiModels) {
    return cachedGeminiModels;
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
  const availableNames = generateContentModels.map((model) => model.name);
  const selected = [
    ...preferredModels.filter((name) => availableNames.includes(name)),
    ...availableNames.filter((name) => !preferredModels.includes(name)),
  ];

  if (selected.length === 0) {
    throw new Error("No Gemini model with generateContent support is available for this API key");
  }

  cachedGeminiModels = selected.map(normalizeModelName);

  return cachedGeminiModels;
};

export const extractJson = (text) => {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Gemini returned an invalid JSON format");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

export const generateGeminiJson = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const configuredModel = normalizeModelName(
    process.env.GEMINI_MODEL || "gemini-2.5-flash"
  );

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

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
          temperature: 0.35,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );

  const attemptedModels = new Set();
  let response = await generateWithModel(configuredModel);
  let data = await response.json();
  attemptedModels.add(configuredModel);

  if (!response.ok && [404, 429, 503].includes(response.status)) {
    const availableModels = await listAvailableGeminiModels(apiKey);

    for (const model of availableModels) {
      if (attemptedModels.has(model)) {
        continue;
      }

      response = await generateWithModel(model);
      data = await response.json();
      attemptedModels.add(model);

      if (response.ok || ![404, 429, 503].includes(response.status)) {
        break;
      }
    }
  }

  if (!response.ok) {
    if ([429, 503].includes(response.status)) {
      throw new Error("Gemini is busy right now. Please try again in a minute.");
    }

    throw new Error(data.error?.message || "Gemini request failed");
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini did not return text");
  }

  return extractJson(text);
};
