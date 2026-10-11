//log in signup signout

import mongoose from "mongoose";
import { User } from "../models/usermodel.js";
import { Job } from "../models/jobmodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDaturi from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { saveUploadedResume, saveUploadedImage } from "../utils/fileHandler.js";
import { sendWelcomeEmail, sendTestEmail } from "../utils/emailService.js";
import axios from "axios";

//sign up
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, role, password } = req.body;
    if (!fullname || !email || !role || !password) {
      return res.status(400).json({
        message: "Full name, email, password, and role are required",
        success: false,
      });
    }

    // Validate email format
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
        success: false,
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Validate phone number if provided (digits only, 10-15 chars)
    let cleanPhone = (phoneNumber || "").trim();
    if (cleanPhone) {
      const phoneDigits = cleanPhone.replace(/[\s\-\+()]/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        return res.status(400).json({
          message: "Please enter a valid phone number (10-15 digits)",
          success: false,
        });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection failed. Please ensure MongoDB is running or update MONOGOURL in backhand/.env",
        success: false,
      });
    }

    // during registration check user is already present or not (case-insensitive)
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") },
    });
    if (user) {
      return res.status(400).json({
        message: "An account with this email already exists. Please log in.",
        success: false,
      });
    }

    // optional profile photo upload via Cloudinary or local disk
    let profilephoto = "";
    const file = req.file;
    if (file) {
      if (file.mimetype && file.mimetype.startsWith("image/")) {
        try {
          const uploadedPhoto = await saveUploadedImage(file, req, "profiles");
          if (uploadedPhoto?.url) {
            profilephoto = uploadedPhoto.url;
          }
        } catch (cloudErr) {
          console.log("Profile photo upload skipped/failed:", cloudErr.message);
        }
      } else {
        console.warn("Non-image file provided for profile photo during registration, ignoring.");
      }
    }

    // hash password
    const hashpassword = await bcrypt.hash(password, 10);

    // create user with normalized email
    const newUser = await User.create({
      fullname,
      email: cleanEmail,
      phoneNumber,
      role: role.toLowerCase(),
      password: hashpassword,
      profile: {
        profilephoto,
      },
    });

    // Send welcome email (fire-and-forget — never blocks signup)
    sendWelcomeEmail({ fullname, email: cleanEmail, role: role.toLowerCase() })
      .catch(err => console.error("Welcome email failed:", err.message));

    return res.status(200).json({
      message: "Account Created Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, role, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection failed. Please ensure MongoDB is running or update MONOGOURL in backhand/.env",
        success: false,
      });
    }

    const cleanEmail = email.trim();
    // Case-insensitive email search
    let user = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") },
    });

    if (!user) {
      return res.status(400).json({
        message: "No account found with this email. Please check your email or sign up.",
        success: false,
      });
    }

    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.status(400).json({
        message: "Incorrect password. Please try again.",
        success: false,
      });
    }

    // If role is provided, verify role with a clear helpful message
    if (role && role.toLowerCase() !== user.role.toLowerCase()) {
      return res.status(400).json({
        message: `This account is registered as a ${user.role}. Please select '${user.role}' above to login.`,
        success: false,
      });
    }

    const tokandata = {
      userid: user._id,
    };

    const secretKey = process.env.SECRET_KEY || process.env.SECREATE_KEY || "hirehub_secret_key_2026";
    const token = await jwt.sign(tokandata, secretKey, {
      expiresIn: "1d",
    });

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: `Welcome back, ${user.fullname}`,
        user: userResponse,
        token,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: "Log out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills, emailNotifications, fileType } = req.body;
    const userid = req.id;
    let user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }

    const files = req.files || (req.file ? [req.file] : []);
    let uploadedResume = null;
    let uploadedPhoto = null;

    for (const f of files) {
      const isPhoto =
        f.fieldname === "profilePhoto" ||
        f.fieldname === "avatar" ||
        (f.fieldname === "file" && fileType === "profilephoto") ||
        (f.mimetype && f.mimetype.startsWith("image/"));

      const isResume =
        f.fieldname === "resume" ||
        (f.fieldname === "file" && fileType === "resume") ||
        (f.mimetype && (f.mimetype.includes("pdf") || f.mimetype.includes("word") || f.mimetype.includes("officedocument")));

      if (isPhoto) {
        uploadedPhoto = await saveUploadedImage(f, req, "profiles");
      } else if (isResume) {
        uploadedResume = await saveUploadedResume(f, req);
      } else {
        // Fallback by mimetype
        if (f.mimetype && f.mimetype.startsWith("image/")) {
          uploadedPhoto = await saveUploadedImage(f, req, "profiles");
        } else {
          uploadedResume = await saveUploadedResume(f, req);
        }
      }
    }

    let skillsArrya;
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArrya = skills;
      } else {
        skillsArrya = skills.split(",").map((s) => s.trim());
      }
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skillsArrya) user.profile.skills = skillsArrya;
    if (emailNotifications !== undefined) {
      user.profile.emailNotifications = emailNotifications === true || emailNotifications === "true";
    }

    if (uploadedPhoto?.url) {
      user.profile.profilephoto = uploadedPhoto.url;
    }
    if (uploadedResume?.url) {
      user.profile.resume = uploadedResume.url;
      user.profile.resumeOriginalName = uploadedResume.originalName;
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// Toggle Bookmark/Save Job for a candidate
export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!Array.isArray(user.savedJobs)) {
      user.savedJobs = [];
    }

    const isAlreadySaved = user.savedJobs.some(
      (id) => id.toString() === jobId.toString()
    );

    let isSaved = false;
    let message = "";

    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
      isSaved = false;
      message = "Job removed from bookmarks";
    } else {
      user.savedJobs.push(jobId);
      isSaved = true;
      message = "Job saved to your bookmarks!";
    }

    await user.save();

    return res.status(200).json({
      message,
      isSaved,
      savedJobs: user.savedJobs,
      success: true,
    });
  } catch (error) {
    console.error("toggleSaveJob error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// Get populated saved jobs for candidate
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: {
        path: "company",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Filter out any null jobs if a job was deleted
    const validSavedJobs = (user.savedJobs || []).filter((job) => job !== null);

    return res.status(200).json({
      savedJobs: validSavedJobs,
      success: true,
    });
  } catch (error) {
    console.error("getSavedJobs error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// Send an immediate test notification email to the authenticated user
export const sendTestNotificationEmail = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const emailResult = await sendTestEmail(user.email, user.fullname);
    if (!emailResult || !emailResult.success) {
      const errorMessage = emailResult?.error || "Failed to dispatch email via SMTP. Please check server SMTP configuration.";
      return res.status(500).json({
        message: errorMessage,
        isRenderPortBlock: emailResult?.isRenderPortBlock || false,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Test email dispatched to ${user.email} (via ${emailResult.provider || "email service"})! Please check your Inbox and Spam/Promotions folder.`,
      recipient: user.email,
      provider: emailResult.provider,
      success: true,
    });
  } catch (error) {
    console.error("sendTestNotificationEmail error:", error);
    return res.status(500).json({
      message: error.message || "Failed to send test email",
      success: false,
    });
  }
};

// ==========================================
// OAuth 2.0 (Google & GitHub) Handlers
// ==========================================

export const getOAuthStatus = (req, res) => {
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.includes("your_google_client_id"));
  const hasGithub = Boolean(process.env.GITHUB_CLIENT_ID && !process.env.GITHUB_CLIENT_ID.includes("your_github_client_id"));

  return res.status(200).json({
    google: hasGoogle,
    github: hasGithub,
    success: true,
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Google OAuth Initiation
export const googleAuth = (req, res) => {
  const role = req.query.role || "student";
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!googleClientId || googleClientId.trim() === "" || googleClientId.includes("your_google_client_id")) {
    return res.redirect(
      `${frontendUrl}/login?oauth_error=${encodeURIComponent(
        "Google OAuth is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backhand/.env"
      )}&provider=google&need_config=true&role=${encodeURIComponent(role)}`
    );
  }

  const redirectUri = `${backendUrl}/api/v1/user/auth/google/callback`;
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    "openid email profile"
  )}&state=${encodeURIComponent(role)}&access_type=offline&prompt=consent`;

  return res.redirect(googleAuthUrl);
};

// Google OAuth Callback
export const googleCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const { code, state: requestedRole, error } = req.query;

    if (error || !code) {
      return res.redirect(
        `${frontendUrl}/login?oauth_error=${encodeURIComponent(
          error || "Google authorization was cancelled"
        )}`
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const redirectUri = `${backendUrl}/api/v1/user/auth/google/callback`;

    // Exchange authorization code for tokens
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const { access_token } = tokenResponse.data;

    // Fetch user info from Google
    const profileResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { sub: googleId, email, name, picture } = profileResponse.data;
    if (!email) {
      return res.redirect(
        `${frontendUrl}/login?oauth_error=${encodeURIComponent("No email received from Google profile")}`
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const assignedRole = requestedRole === "recruiter" ? "recruiter" : "student";
      const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2) + Date.now(), 10);
      user = await User.create({
        fullname: name || "Google User",
        email: cleanEmail,
        role: assignedRole,
        password: randomPassword,
        phoneNumber: "",
        authProvider: "google",
        googleId,
        profile: {
          profilephoto: picture || "",
        },
      });

      sendWelcomeEmail({ fullname: user.fullname, email: cleanEmail, role: user.role })
        .catch((err) => console.error("Welcome email error:", err.message));
    } else {
      if (!user.googleId) user.googleId = googleId;
      if (!user.profile?.profilephoto && picture) {
        if (!user.profile) user.profile = {};
        user.profile.profilephoto = picture;
      }
      await user.save();
    }

    // Generate JWT
    const secretKey = process.env.SECRET_KEY || process.env.SECREATE_KEY || "hirehub_secret_key_2026";
    const token = await jwt.sign({ userid: user._id }, secretKey, { expiresIn: "1d" });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.redirect(`${frontendUrl}/oauth-success?token=${token}&role=${user.role}&provider=google`);
  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    return res.redirect(
      `${frontendUrl}/login?oauth_error=${encodeURIComponent(
        err.response?.data?.error_description || err.message || "Failed to authenticate with Google"
      )}`
    );
  }
};

// GitHub OAuth Initiation
export const githubAuth = (req, res) => {
  const role = req.query.role || "student";
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  if (!githubClientId || githubClientId.trim() === "" || githubClientId.includes("your_github_client_id")) {
    return res.redirect(
      `${frontendUrl}/login?oauth_error=${encodeURIComponent(
        "GitHub OAuth is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to backhand/.env"
      )}&provider=github&need_config=true&role=${encodeURIComponent(role)}`
    );
  }

  const redirectUri = `${backendUrl}/api/v1/user/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent("user:email")}&state=${encodeURIComponent(role)}`;

  return res.redirect(githubAuthUrl);
};

// GitHub OAuth Callback
export const githubCallback = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const { code, state: requestedRole, error } = req.query;

    if (error || !code) {
      return res.redirect(
        `${frontendUrl}/login?oauth_error=${encodeURIComponent(
          error || "GitHub authorization was cancelled"
        )}`
      );
    }

    // Exchange code for token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res.redirect(
        `${frontendUrl}/login?oauth_error=${encodeURIComponent(
          tokenResponse.data.error_description || "Failed to retrieve access token from GitHub"
        )}`
      );
    }

    // Get GitHub profile
    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUser = profileResponse.data;
    let email = githubUser.email;

    // Fetch primary verified email if not public in profile
    if (!email) {
      try {
        const emailsResponse = await axios.get("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        const primary = emailsResponse.data.find((e) => e.primary && e.verified) || emailsResponse.data[0];
        if (primary) email = primary.email;
      } catch (e) {
        console.error("Failed to fetch GitHub emails:", e.message);
      }
    }

    if (!email) {
      email = `${githubUser.login}@users.noreply.github.com`;
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const assignedRole = requestedRole === "recruiter" ? "recruiter" : "student";
      const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2) + Date.now(), 10);
      user = await User.create({
        fullname: githubUser.name || githubUser.login || "GitHub User",
        email: cleanEmail,
        role: assignedRole,
        password: randomPassword,
        phoneNumber: "",
        authProvider: "github",
        githubId: String(githubUser.id),
        profile: {
          profilephoto: githubUser.avatar_url || "",
          bio: githubUser.bio || "",
        },
      });

      sendWelcomeEmail({ fullname: user.fullname, email: cleanEmail, role: user.role })
        .catch((err) => console.error("Welcome email error:", err.message));
    } else {
      if (!user.githubId) user.githubId = String(githubUser.id);
      if (!user.profile?.profilephoto && githubUser.avatar_url) {
        if (!user.profile) user.profile = {};
        user.profile.profilephoto = githubUser.avatar_url;
      }
      await user.save();
    }

    // Generate JWT
    const secretKey = process.env.SECRET_KEY || process.env.SECREATE_KEY || "hirehub_secret_key_2026";
    const token = await jwt.sign({ userid: user._id }, secretKey, { expiresIn: "1d" });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.redirect(`${frontendUrl}/oauth-success?token=${token}&role=${user.role}&provider=github`);
  } catch (err) {
    console.error("GitHub OAuth error:", err.response?.data || err.message);
    return res.redirect(
      `${frontendUrl}/login?oauth_error=${encodeURIComponent(
        err.response?.data?.error_description || err.message || "Failed to authenticate with GitHub"
      )}`
    );
  }
};

// Demo/Test 1-Click OAuth Sign-in (Useful for instant testing without waiting for developer console keys)
export const demoOAuthLogin = async (req, res) => {
  try {
    const { provider = "google", role = "student", email, name, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required", success: false });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const assignedRole = role === "recruiter" ? "recruiter" : "student";
      const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2) + Date.now(), 10);
      user = await User.create({
        fullname: name || `${provider === "github" ? "GitHub" : "Google"} User`,
        email: cleanEmail,
        role: assignedRole,
        password: randomPassword,
        phoneNumber: "",
        authProvider: provider,
        profile: {
          profilephoto: avatar || (provider === "github" ? "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" : "https://lh3.googleusercontent.com/a/default-user"),
        },
      });

      sendWelcomeEmail({ fullname: user.fullname, email: cleanEmail, role: user.role })
        .catch((err) => console.error("Welcome email error:", err.message));
    } else {
      if (!user.profile?.profilephoto && avatar) {
        if (!user.profile) user.profile = {};
        user.profile.profilephoto = avatar;
        await user.save();
      }
    }

    const secretKey = process.env.SECRET_KEY || process.env.SECREATE_KEY || "hirehub_secret_key_2026";
    const token = await jwt.sign({ userid: user._id }, secretKey, { expiresIn: "1d" });

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    const isProduction = process.env.NODE_ENV === "production";
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: `Signed in with ${provider === "github" ? "GitHub" : "Google"} as ${user.fullname}`,
        user: userResponse,
        token,
        success: true,
      });
  } catch (err) {
    console.error("demoOAuthLogin error:", err);
    return res.status(500).json({ message: err.message, success: false });
  }
};




