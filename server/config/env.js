const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const productionRequiredEnv = ["GEMINI_API_KEY"];

export const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  const missingProduction = process.env.NODE_ENV === "production"
    ? productionRequiredEnv.filter((key) => !process.env[key])
    : [];
  const allMissing = [...missing, ...missingProduction];

  if (allMissing.length > 0) {
    console.error(`Missing required environment variables: ${allMissing.join(", ")}`);
    process.exit(1);
  }
};
