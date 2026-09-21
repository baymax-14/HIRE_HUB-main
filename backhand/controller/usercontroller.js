//log in signup signout

import mongoose from "mongoose";
import { User } from "../models/usermodel.js";
import { Job } from "../models/jobmodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDaturi from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { saveUploadedResume } from "../utils/fileHandler.js";
import { sendWelcomeEmail } from "../utils/emailService.js";

//sign up
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, role, password } = req.body;
    if (!fullname || !email || !phoneNumber || !role || !password) {
      return res.status(400).json({
        message: "Something is Missing!",
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

    // Validate phone number (digits only, 10-15 chars)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\+]/g, ''))) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
        success: false,
      });
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

    // optional file upload via cloudinary
    let profilephoto = "";
    const file = req.file;
    if (file) {
      try {
        const fileuri = getDaturi(file);
        if (fileuri && fileuri.content) {
          const clouderesponse = await cloudinary.uploader.upload(fileuri.content);
          if (clouderesponse) {
            profilephoto = clouderesponse.secure_url;
          }
        }
      } catch (cloudErr) {
        console.log("Cloudinary upload skipped/failed:", cloudErr.message);
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

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
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
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
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
    const { fullname, email, phoneNumber, bio, skills, emailNotifications } = req.body;
    const file = req.file;

    let uploadedResume = null;
    if (file) {
      uploadedResume = await saveUploadedResume(file, req);
    }

    let skillsArrya;
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArrya = skills;
      } else {
        skillsArrya = skills.split(",").map((s) => s.trim());
      }
    }

    const userid = req.id;
    let user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skillsArrya) user.profile.skills = skillsArrya;
    if (emailNotifications !== undefined) {
      user.profile.emailNotifications = emailNotifications === true || emailNotifications === "true";
    }

    if (uploadedResume) {
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



