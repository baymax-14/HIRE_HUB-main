import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
import axios from "axios";

import fs from "fs";
import path from "path";

/**
 * Extracts raw text content from a PDF URL or local file.
 */
export const extractTextFromPdf = async (pdfUrl) => {
  if (!pdfUrl) return "";
  try {
    let buffer = null;

    // Check if it's an existing local file directly
    if (fs.existsSync(pdfUrl)) {
      buffer = fs.readFileSync(pdfUrl);
    } else if (pdfUrl.includes("/uploads/resumes/") || pdfUrl.includes("\\uploads\\resumes\\")) {
      const fileName = path.basename(pdfUrl);
      const directPath = path.resolve(process.cwd(), "uploads", "resumes", fileName);
      const backhandPath = path.resolve(process.cwd(), "backhand", "uploads", "resumes", fileName);
      if (fs.existsSync(directPath)) {
        buffer = fs.readFileSync(directPath);
      } else if (fs.existsSync(backhandPath)) {
        buffer = fs.readFileSync(backhandPath);
      }
    }

    // Fall back to HTTP download if not local
    if (!buffer) {
      const response = await axios.get(pdfUrl, {
        responseType: "arraybuffer",
        timeout: 25000,
      });
      buffer = Buffer.from(response.data);
    }

    // Support both pdf-parse v2 (PDFParse class) and v1 (function)
    let extractedText = "";
    const PDFParseClass = pdf?.PDFParse || (typeof pdf === "function" ? null : pdf?.default?.PDFParse);

    if (PDFParseClass) {
      const parser = new PDFParseClass({ data: buffer });
      const parseResult = await parser.getText();
      await parser.destroy?.();
      extractedText = parseResult?.text || "";
    } else if (typeof pdf === "function") {
      const pdfData = await pdf(buffer);
      extractedText = pdfData?.text || "";
    }

    console.log(`📄 PDF parsed successfully (${extractedText.length} characters extracted from resume)`);
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF resume:", error.message);
    return "";
  }
};

/**
 * Common tech skills list for robust local NLP matching fallback
 */
const COMMON_SKILLS = [
  "javascript", "typescript", "react", "react.js", "reactjs", "next.js", "nextjs",
  "vue", "angular", "node", "node.js", "nodejs", "express", "express.js", "expressjs",
  "python", "django", "flask", "fastapi", "java", "spring", "springboot",
  "c++", "c#", ".net", "php", "laravel", "ruby", "rails", "golang", "go", "rust",
  "mongodb", "sql", "mysql", "postgresql", "postgres", "redis", "firebase", "supabase",
  "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "git", "github",
  "html", "html5", "css", "css3", "sass", "tailwind", "tailwindcss", "bootstrap",
  "graphql", "rest", "rest api", "redux", "zustand", "jest", "cypress"
];

/**
 * Local Rule-Based & NLP ATS Evaluator
 * Runs entirely on server without requiring external API keys.
 */
export const analyzeResumeWithNLP = (resumeText, applicantSkills = [], job) => {
  const normalize = (text) =>
    (text || "")
      .toLowerCase()
      .replace(/[^\w\s\+\#\.\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normalizedResume = normalize(resumeText);
  const jobDescription = normalize(job?.description || "");
  const combinedResumeText = `${resumeText} ${(applicantSkills || []).join(" ")}`;

  // Precise keyword matching helper (avoids substring false positives)
  const matchKeyword = (sourceText, keyword) => {
    if (!sourceText || !keyword) return false;
    const lower = keyword.toLowerCase().trim();
    if (lower === "react" || lower === "react.js" || lower === "reactjs") {
      return /\b(react|react\.js|reactjs)\b/i.test(sourceText);
    }
    if (lower === "node" || lower === "node.js" || lower === "nodejs") {
      return /\b(node|node\.js|nodejs)\b/i.test(sourceText);
    }
    if (lower === "express" || lower === "express.js" || lower === "expressjs") {
      return /\b(express|express\.js|expressjs)\b/i.test(sourceText);
    }
    if (lower === "mongo" || lower === "mongodb") {
      return /\b(mongo|mongodb)\b/i.test(sourceText);
    }
    if (lower === "tailwind" || lower === "tailwindcss" || lower === "tailwind css") {
      return /\b(tailwind|tailwindcss)\b/i.test(sourceText);
    }
    const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, "i").test(sourceText);
  };

  const jobReqs = Array.isArray(job?.requirement) ? job.requirement : [];
  const allExpected = [...jobReqs];

  const matchingSkills = [];
  const missingSkills = [];

  if (allExpected.length > 0) {
    allExpected.forEach((skill) => {
      const inText = matchKeyword(normalizedResume, skill);
      const inSkills = applicantSkills.some((s) => matchKeyword(s, skill));
      if (inText || inSkills) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
  } else {
    (applicantSkills || []).forEach((skill) => {
      if (skill && matchKeyword(jobDescription, skill.toLowerCase())) {
        matchingSkills.push(skill);
      }
    });
  }

  // Calculate skill match ratio (up to 70 points)
  let skillRatio = 0.5;
  if (allExpected.length > 0) {
    skillRatio = matchingSkills.length / allExpected.length;
  } else if (applicantSkills.length > 0) {
    skillRatio = Math.min(1, applicantSkills.length / 5);
  }

  // Multi-Tiered Experience & Practical Evidence Scoring (up to 30 points)
  const reqExp = parseInt(job?.experiance || "0", 10);
  let expPoints = 0;

  // 1. Parsed resume verification (up to 5 points)
  if (combinedResumeText.trim().length > 50) {
    expPoints += 5;
  }

  // 2. Real-world project implementation evidence (up to 12 points)
  const hasProjects = /project|projects|developed|built|engineered|deployed|implemented|designed|created|fullstack|frontend|backend/i.test(combinedResumeText);
  if (hasProjects) {
    expPoints += 12;
  }

  // 3. Internship, Hackathon, or Industry Validation (up to 8 points)
  const hasInternshipOrHackathon = /intern|internship|hackathon|competition|fellowship|bootcamp|certification|certified|contributor/i.test(combinedResumeText);
  if (hasInternshipOrHackathon) {
    expPoints += 8;
  }

  // 4. Tenure & Experience fit (up to 5 points)
  if (reqExp <= 1) {
    expPoints += 5; // Entry-level / fresher ideal fit
  } else if (reqExp <= 3) {
    expPoints += 3; // Junior to mid-level baseline
  } else {
    expPoints += 1; // Senior role tenure gap
  }

  const finalExpScore = Math.min(30, expPoints);

  // Base raw score (0-100)
  let rawScore = Math.round(skillRatio * 70 + finalExpScore);
  if (rawScore > 100) rawScore = 100;
  if (rawScore < 15 && matchingSkills.length === 0) rawScore = Math.max(10, rawScore);

  let verdict = "Not Qualified";
  if (rawScore >= 80) verdict = "Highly Qualified";
  else if (rawScore >= 60) verdict = "Qualified";
  else if (rawScore >= 40) verdict = "Partially Qualified";

  const strengths = [];
  if (matchingSkills.length > 0) {
    strengths.push(`Matches ${matchingSkills.length} key required skill(s): ${matchingSkills.slice(0, 4).join(", ")}`);
  }
  if (hasProjects) {
    strengths.push("Demonstrates hands-on engineering project development and deployment in resume");
  }
  if (hasInternshipOrHackathon) {
    strengths.push("Proven real-world engagement (internship, hackathon, or certified coursework)");
  }
  if (applicantSkills.length >= 4) {
    strengths.push(`Strong broad profile with ${applicantSkills.length} listed technical competencies`);
  }

  const concerns = [];
  if (missingSkills.length > 0) {
    concerns.push(`Missing key required skill(s): ${missingSkills.slice(0, 4).join(", ")}`);
  }
  if (reqExp > 2 && !/(\d+)\+?\s*(year|years|yr|yrs)\s*(of)?\s*(experience|exp)/i.test(combinedResumeText)) {
    concerns.push(`Job seeks ${reqExp}+ years professional tenure; candidate demonstrates strong project competency over multi-year corporate tenure`);
  }

  const summary = `Candidate demonstrates a ${rawScore}% alignment with the ${job?.title || "role"}. ` +
    (matchingSkills.length > 0
      ? `Strong points include proficiency in ${matchingSkills.slice(0, 3).join(", ")}. `
      : "No direct requirement overlaps found. ") +
    (hasProjects
      ? "Backed by verifiable hands-on projects and practical engineering experience. "
      : "") +
    (missingSkills.length > 0
      ? `Would benefit from hands-on knowledge of ${missingSkills.slice(0, 3).join(", ")}.`
      : "Possesses all core listed competencies.");

  return {
    score: rawScore,
    verdict,
    matchingSkills,
    missingSkills,
    experienceFit: hasProjects || hasInternshipOrHackathon ? "Relevant project, hackathon or work experience indicated" : "Limited verifiable experience found",
    strengths: strengths.length > 0 ? strengths : ["Demonstrates interest in the domain"],
    concerns: concerns.length > 0 ? concerns : ["None identified"],
    summary,
    evaluatedAt: new Date(),
  };
};

/**
 * Google Gemini AI Evaluation
 */
export const analyzeResumeWithGemini = async (resumeText, applicantSkills = [], job, apiKey) => {
  const prompt = `
You are an expert ATS (Applicant Tracking System) and technical recruiter. Evaluate the following candidate against the job specifications.

JOB DETAILS:
- Title: ${job?.title || "N/A"}
- Description: ${job?.description || "N/A"}
- Required Skills: ${(job?.requirement || []).join(", ") || "N/A"}
- Required Experience: ${job?.experiance || "Not specified"}
- Job Type: ${job?.jobType || "Full-time"}

CANDIDATE INFORMATION:
- Profile Skills: ${(applicantSkills || []).join(", ") || "None listed"}
- Resume Content:
${resumeText.slice(0, 6000) || "No resume text extracted. Relying strictly on profile skills."}

Return a STRICT JSON response (do NOT use markdown backticks, return pure raw JSON) matching this exact format:
{
  "score": <number between 0 and 100 representing overall qualification and match>,
  "verdict": "<one of: Highly Qualified | Qualified | Partially Qualified | Not Qualified>",
  "matchingSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<skill1>", "<skill2>"],
  "experienceFit": "<1 sentence evaluating whether their experience level matches>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "concerns": ["<area of concern or missing requirement>"],
  "summary": "<2 concise sentences summarizing candidate fit and recruiter recommendation>"
}
`;

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await axios.post(
    url,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  const textResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    throw new Error("Empty response from Gemini API");
  }

  const parsed = JSON.parse(textResponse);
  return {
    score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
    verdict: parsed.verdict || "Qualified",
    matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [],
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    experienceFit: parsed.experienceFit || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
    summary: parsed.summary || "",
    evaluatedAt: new Date(),
  };
};

/**
 * Main Orchestrator: Evaluates an applicant's resume against a job
 */
export const evaluateApplicantResume = async (applicantUser, jobDetails) => {
  try {
    const resumeUrl = applicantUser?.profile?.resume;
    const applicantSkills = applicantUser?.profile?.skills || [];

    let resumeText = "";
    if (resumeUrl) {
      resumeText = await extractTextFromPdf(resumeUrl);
    }

    if (!resumeUrl && applicantSkills.length === 0) {
      return {
        score: 0,
        verdict: "No Resume",
        matchingSkills: [],
        missingSkills: jobDetails?.requirement || [],
        experienceFit: "No resume or skills uploaded",
        strengths: [],
        concerns: ["Applicant has not uploaded a resume or profile skills"],
        summary: "Unable to evaluate: No resume or profile skills provided.",
        evaluatedAt: new Date(),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 10) {
      try {
        console.log("Evaluating application using Google Gemini AI...");
        return await analyzeResumeWithGemini(resumeText, applicantSkills, jobDetails, apiKey.trim());
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local NLP engine:", geminiError.message);
      }
    }

    console.log("Evaluating application using local NLP Matcher...");
    return analyzeResumeWithNLP(resumeText, applicantSkills, jobDetails);
  } catch (error) {
    console.error("Evaluation error:", error.message);
    return {
      score: 50,
      verdict: "Partially Qualified",
      matchingSkills: applicantUser?.profile?.skills || [],
      missingSkills: [],
      experienceFit: "Evaluation error fallback",
      strengths: ["Applicant profile available"],
      concerns: ["Automatic parsing encountered an issue"],
      summary: "Evaluated using basic profile information.",
      evaluatedAt: new Date(),
    };
  }
};
