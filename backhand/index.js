import express from "express";
import path from "path";
import mongoose from "mongoose";
const app = express();
import cookieparser from "cookie-parser"
import cors from "cors";
import dotenv from 'dotenv'
import connectDb from "./utils/db.js";
import userRoute from "./route/userroute.js";
import companyRoutes from "./route/companyroute.js";
import jobRoute from "./route/jobroute.js";
import applicationroute from "./route/applicationroute.js";
import notificationRoute from "./route/notificationroute.js";
import analyticsRoute from "./route/analyticsroute.js";

// Load environment variables
dotenv.config({});

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())

const corsoption = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true,
};


app.use(cors(corsoption));

// Serve local uploads statically
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
    console.log(`   Email:     ${process.env.SMTP_HOST ? '✅ SMTP Configured' : '📝 Dev Console Mode'}`);
    console.log(`═══════════════════════════════════════════════\n`);
})