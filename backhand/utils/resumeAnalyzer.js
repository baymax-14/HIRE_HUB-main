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

    // Check if it's a local file URL or file path
    if (pdfUrl.includes("/uploads/resumes/")) {
      const fileName = pdfUrl.split("/uploads/resumes/").pop();
      const localDiskPath = path.resolve(process.cwd(), "uploads", "resumes", fileName);
      if (fs.existsSync(localDiskPath)) {
        buffer = fs.readFileSync(localDiskPath);
      }
    } else if (fs.existsSync(pdfUrl)) {
      buffer = fs.readFileSync(pdfUrl);
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
  "javascript", "typescript", "react", "next.js", "nextjs", "vue", "angular",
  "node", "node.js", "express", "express.js", "mongodb", "mongoose", "sql", "mysql",
  "postgresql", "postgres", "redis", "python", "django", "flask", "fastapi",
  "java", "spring", "springboot", "c", "c++", "c#", ".net", "php", "laravel",
  "html", "html5", "css", "css3", "tailwind", "tailwindcss", "bootstrap",
  "sass", "redux", "redux-toolkit", "graphql", "rest api", "restful", "docker",
  "kubernetes", "aws", "azure", "gcp", "git", "github", "gitlab", "ci/cd",
  "linux", "jest", "cypress", "unit testing", "microservices", "agile", "scrum"
];

/**
 * Local NLP & Skill-Matching Fallback Engine
 */
export const analyzeResumeWithNLP = (resumeText, applicantSkills = [], job) => {
  const combinedResumeText = `${resumeText} ${(applicantSkills || []).join(" ")}`.toLowerCase();
  const jobRequirements = job?.requirement || [];
  const jobDescription = `${job?.title || ""} ${job?.description || ""}`.toLowerCase();

  // Helper to test if skill is present with word boundary
  const matchKeyword = (targetText, keyword) => {
    if (!keyword) return false;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_+#.])${escaped}(?:$|[^a-zA-Z0-9_+#.])`, "i");
    return regex.test(targetText);
  };

  // Extract skills expected by the job
  const expectedSkills = new Set();

  jobRequirements.forEach((req) => {
    if (!req) return;
    const cleaned = req.toLowerCase().trim();
    if (cleaned) {
      // Split by commas, semicolons, pipes, slashes, or newlines
      cleaned.split(/[,;|/\n]+/).forEach((s) => {
        const trimmed = s.trim();
        if (trimmed && trimmed.length <= 30) {
          expectedSkills.add(trimmed);
        } else if (trimmed) {
          // If long blob, extract known tech skills from it
          COMMON_SKILLS.forEach((cs) => {
            if (matchKeyword(trimmed, cs)) {
              expectedSkills.add(cs);
            }
          });
        }
      });
    }
  });

  // Check common skills mentioned in job description
  COMMON_SKILLS.forEach((skill) => {
    if (matchKeyword(jobDescription, skill)) {
      expectedSkills.add(skill);
    }
  });

  const allExpected = Array.from(expectedSkills);
  const matchingSkills = [];
  const missingSkills = [];

  if (allExpected.length > 0) {
    allExpected.forEach((skill) => {
      const inText = matchKeyword(combinedResumeText, skill);
      const inSkills = applicantSkills.some(
        (s) => s && s.toLowerCase().trim() === skill
      );
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

  // Calculate score
  let skillRatio = 0.5;
  if (allExpected.length > 0) {
    skillRatio = matchingSkills.length / allExpected.length;
  } else if (applicantSkills.length > 0) {
    skillRatio = Math.min(1, applicantSkills.length / 5);
  }

  // Experience factor check
  const reqExp = parseInt(job?.experiance || "0", 10);
  let expBonus = 0.2;
  const hasExpKeywords = /year|years|intern|experience|developed|built|worked/i.test(combinedResumeText);
  if (hasExpKeywords) {
    expBonus += 0.1;
  }

  // Base raw score (0-100)
  let rawScore = Math.round(skillRatio * 70 + expBonus * 100 * 0.3);
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
  if (hasExpKeywords) {
    strengths.push("Demonstrates hands-on project or development experience in resume");
  }
  if (applicantSkills.length >= 4) {
    strengths.push(`Strong broad profile with ${applicantSkills.length} listed technical competencies`);
  }

  const concerns = [];
  if (missingSkills.length > 0) {
    concerns.push(`Missing key required skill(s): ${missingSkills.slice(0, 4).join(", ")}`);
  }
  if (reqExp > 0 && !hasExpKeywords) {
    concerns.push(`Job requires ${reqExp} year(s) of experience, which is not clearly evident in resume`);
  }

  const summary = `Candidate demonstrates a ${rawScore}% alignment with the ${job?.title || "role"}. ` +
    (matchingSkills.length > 0
      ? `Strong points include proficiency in ${matchingSkills.slice(0, 3).join(", ")}. `
      : "No direct requirement overlaps found. ") +
    (missingSkills.length > 0
      ? `Would benefit from hands-on knowledge of ${missingSkills.slice(0, 3).join(", ")}.`
      : "Possesses all core listed competencies.");

  return {
    score: rawScore,
    verdict,
    matchingSkills,
    missingSkills,
    experienceFit: hasExpKeywords ? "Relevant project or work experience indicated" : "Limited verifiable experience found",
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
