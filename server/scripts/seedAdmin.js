import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Dashboard, { createEmptyDashboardPayload } from "../models/Dashboard.js";
import User from "../models/User.js";

dotenv.config();

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.log("Usage: npm run seed:admin -- \"Admin Name\" admin@example.com password123");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.log("MONGO_URI is missing in server/.env");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const existingUser = await User.findOne({ email });
const hashedPassword = await bcrypt.hash(password, 10);

const user = existingUser
  ? await User.findOneAndUpdate(
      { email },
      {
        name,
        password: hashedPassword,
        role: "admin",
      },
      { returnDocument: "after" }
    )
  : await User.create({
      email,
      name,
      password: hashedPassword,
      role: "admin",
    });

await Dashboard.findOneAndUpdate(
  { user: user._id },
  { $setOnInsert: createEmptyDashboardPayload(user._id) },
  { returnDocument: "after", upsert: true }
);

console.log(`Admin ready: ${email}`);
await mongoose.disconnect();
