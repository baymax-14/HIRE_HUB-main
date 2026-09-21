import { User } from "../models/usermodel.js";
import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import bcrypt from "bcryptjs";

export const seedDefaultData = async () => {
  try {
    const defaultPasswordHash = await bcrypt.hash("123456", 10);

    // 1. Ensure Student Account: anand@test.com
    const existingStudent = await User.findOne({ email: "anand@test.com" });
    if (!existingStudent) {
      await User.create({
        fullname: "Anand Rathod",
        email: "anand@test.com",
        phoneNumber: "9876543210",
        password: defaultPasswordHash,
        role: "student",
        profile: {
          bio: "Full Stack MERN Developer skilled in React, Node.js, Express, and MongoDB.",
          skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Tailwind CSS", "Git"],
          resume: "",
          resumeOriginalName: "",
          profilephoto: "",
        },
      });
      console.log("🌱 [Seed] Created default student account: anand@test.com (password: 123456)");
    }

    // 2. Ensure Recruiter Account: recruiter@gmail.com
    let recruiter = await User.findOne({ email: "recruiter@gmail.com" });
    if (!recruiter) {
      recruiter = await User.create({
        fullname: "Tech Recruiter",
        email: "recruiter@gmail.com",
        phoneNumber: "9876543211",
        password: defaultPasswordHash,
        role: "recruiter",
        profile: {
          bio: "Senior Technical Talent Acquisition Specialist.",
          skills: [],
          profilephoto: "",
        },
      });
      console.log("🌱 [Seed] Created default recruiter account: recruiter@gmail.com (password: 123456)");
    }

    // 3. Ensure Default Company
    let company = await Company.findOne({ name: "Google India" });
    if (!company && recruiter) {
      company = await Company.create({
        name: "Google India",
        description: "Leading global technology company specializing in internet-related services and products.",
        website: "https://www.google.com",
        location: "Bangalore, India",
        userId: recruiter._id,
      });
      console.log("🌱 [Seed] Created default company: Google India");
    }

    // 4. Ensure Default Job Posting
    const existingJob = await Job.findOne({ title: "Senior Full Stack MERN Developer" });
    if (!existingJob && company && recruiter) {
      await Job.create({
        title: "Senior Full Stack MERN Developer",
        description: "We are seeking a talented Senior MERN Stack Engineer to build high-performance web applications using React, Node.js, Express, and MongoDB. Experience with Docker, microservices, and modern UI frameworks is preferred.",
        requirement: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "Tailwind CSS", "Git"],
        salary: 1800000,
        location: "Bangalore (Hybrid)",
        jobType: "Full-time",
        position: 3,
        experiance: 2,
        company: company._id,
        created_by: recruiter._id,
      });
      console.log("🌱 [Seed] Created default job: Senior Full Stack MERN Developer");
    }
  } catch (error) {
    console.error("⚠️ Error while seeding default data:", error.message);
  }
};
