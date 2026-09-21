import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
const app = express();
import cookieparser from "cookie-parser"
import cors from "cors";
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from backhand/.env or current working directory
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config();

import connectDb from "./utils/db.js";
import userRoute from "./route/userroute.js";
import companyRoutes from "./route/companyroute.js";
import jobRoute from "./route/jobroute.js";
import applicationroute from "./route/applicationroute.js";
import notificationRoute from "./route/notificationroute.js";
import analyticsRoute from "./route/analyticsroute.js";

// Trust reverse proxy (essential for Render / Vercel HTTPS cookies)
app.set("trust proxy", 1);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// Support multiple comma-separated frontend origins & Vercel preview domains
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""));

const corsoption = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "");
    if (
      configuredOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app") ||
      cleanOrigin.includes("localhost") ||
      cleanOrigin.includes("127.0.0.1")
    ) {
      return callback(null, true);
    }
    // Reflect origin in production to support preview deployments
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsoption));

// Serve local uploads statically
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

const port = process.env.PORT || 8000

app.use("/api/v1/user",userRoute)
app.use("/api/v1/company",companyRoutes)
app.use("/api/v1/job",jobRoute)
app.use("/api/v1/application",applicationroute)
app.use("/api/v1/notifications",notificationRoute)
app.use("/api/v1/analytics",analyticsRoute)

// Multer Error Handler (file upload issues)
import multer from "multer";
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum file size is 10MB.",
        success: false,
      });
    }
    return res.status(400).json({
      message: "File upload error: " + err.message,
      success: false,
    });
  }
  next(err);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
});



app.listen(port,() =>{
    connectDb();
    console.log(`\n🚀 ═══════════════════════════════════════════════`);
    console.log(`   HireHub Server running on port ${port}`);
    console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`   API Base: http://localhost:${port}/api/v1`);
    console.log(`   Gemini AI: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️ Using Local NLP'}`);
    const emailProvider = process.env.RESEND_API_KEY
      ? "✅ Resend API (HTTPS 443 - Cloud Ready)"
      : process.env.BREVO_API_KEY
      ? "✅ Brevo API (HTTPS 443 - Cloud Ready)"
      : process.env.SMTP_HOST
      ? "✅ SMTP (" + process.env.SMTP_HOST + ")"
      : "📝 Dev Console Mode";
    console.log(`   Email:     ${emailProvider}`);
    console.log(`═══════════════════════════════════════════════\n`);
})