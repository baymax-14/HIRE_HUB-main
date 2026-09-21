import { User } from "../models/usermodel.js";
import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import bcrypt from "bcryptjs";

export const seedDefaultData = async () => {
  try {
    const defaultPasswordHash = await bcrypt.hash("123456", 10);

    // 1. Ensure Student Account: anand@test.com
    let student = await User.findOne({ email: "anand@test.com" });
    if (!student) {
      student = await User.create({
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

    // 2. Ensure Google Recruiter Account: recruiter@gmail.com
    let googleRecruiter = await User.findOne({ email: "recruiter@gmail.com" });
    if (!googleRecruiter) {
      googleRecruiter = await User.create({
        fullname: "Google Talent Acquisition",
        email: "recruiter@gmail.com",
        phoneNumber: "9876543211",
        password: defaultPasswordHash,
        role: "recruiter",
        profile: {
          bio: "Senior Technical Talent Acquisition Specialist at Google India | Hiring Core Systems, Cloud & Gemini AI teams.",
          skills: ["Technical Sourcing", "Executive Hiring", "Engineering Leadership", "Google Cloud", "AI/ML Talent"],
          profilephoto: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
        },
      });
      console.log("🌱 [Seed] Created Google recruiter account: recruiter@gmail.com (password: 123456)");
    } else {
      // Keep profile aligned with real Google Recruiter identity
      googleRecruiter.fullname = "Google Talent Acquisition";
      if (!googleRecruiter.profile?.profilephoto) {
        googleRecruiter.profile.profilephoto = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg";
      }
      googleRecruiter.profile.bio = "Senior Technical Talent Acquisition Specialist at Google India | Hiring Core Systems, Cloud & Gemini AI teams.";
      await googleRecruiter.save();
    }

    // 3. Ensure Secondary Tech Recruiter for other top companies (Microsoft, Amazon, Meta, etc.)
    let otherRecruiter = await User.findOne({ email: "demo.recruiter@hirehub.com" });
    if (!otherRecruiter) {
      otherRecruiter = await User.create({
        fullname: "Tech Talent Partner",
        email: "demo.recruiter@hirehub.com",
        phoneNumber: "9876543299",
        password: defaultPasswordHash,
        role: "recruiter",
        profile: {
          bio: "Independent Tech Talent Partner connecting engineers with high-growth tech giants.",
          skills: ["Talent Acquisition", "Technical Recruiting"],
          profilephoto: "",
        },
      });
      console.log("🌱 [Seed] Created partner recruiter: demo.recruiter@hirehub.com");
    }

    // 4. Ensure Google India Company (Owned exclusively by recruiter@gmail.com)
    let googleCompany = await Company.findOne({ name: "Google India" });
    if (!googleCompany) {
      googleCompany = await Company.create({
        name: "Google India",
        description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
        website: "https://careers.google.com",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        userId: googleRecruiter._id,
      });
      console.log("🌱 [Seed] Created company: Google India");
    } else {
      // Ensure ownership belongs to recruiter@gmail.com
      if (googleCompany.userId.toString() !== googleRecruiter._id.toString()) {
        googleCompany.userId = googleRecruiter._id;
        await googleCompany.save();
      }
      if (!googleCompany.logo) {
        googleCompany.logo = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg";
        await googleCompany.save();
      }
    }

    // Reassign any non-Google companies created by recruiter@gmail.com to otherRecruiter
    await Company.updateMany(
      { userId: googleRecruiter._id, name: { $ne: "Google India" } },
      { $set: { userId: otherRecruiter._id } }
    );

    // 5. Seed Realistic Google Jobs (Owned exclusively by recruiter@gmail.com)
    const googleJobsData = [
      {
        title: "Senior Full Stack Engineer - Core Platform & Search",
        description: "Join the team powering Google's core platform and internal developer tools. You will architect high-throughput microservices in Node.js/Go and craft fluid, accessible web interfaces in React and TypeScript. You'll solve complex scaling challenges serving billions of requests.",
        requirement: ["React", "TypeScript", "Node.js", "Distributed Systems", "Kubernetes", "gRPC", "Git"],
        salary: 3400000,
        location: "Bangalore, India (Hybrid)",
        jobType: "Full-time",
        position: 4,
        experiance: "3-5",
      },
      {
        title: "Machine Learning Engineer - Gemini AI & NLP",
        description: "Drive cutting-edge AI innovations by developing and scaling generative AI models on Google infrastructure. Collaborate with Google DeepMind researchers to fine-tune Gemini multi-modal systems and integrate them into developer APIs and enterprise solutions.",
        requirement: ["Python", "PyTorch", "TensorFlow", "Transformers", "NLP", "LLMs", "Distributed Training"],
        salary: 4200000,
        location: "Bangalore, India",
        jobType: "Full-time",
        position: 3,
        experiance: "2-5",
      },
      {
        title: "Cloud Solutions Architect - Google Cloud (GCP)",
        description: "Engage with enterprise engineering teams to design and migrate mission-critical applications to Google Cloud Platform. Lead technical discussions on container orchestration, cloud security, disaster recovery, and event-driven architectures.",
        requirement: ["Google Cloud (GCP)", "Kubernetes (GKE)", "Terraform", "Cloud Architecture", "Docker", "CI/CD"],
        salary: 3800000,
        location: "Hyderabad, India (Hybrid)",
        jobType: "Full-time",
        position: 2,
        experiance: "4-7",
      },
      {
        title: "Frontend Software Engineer III - Chrome & Web Platform",
        description: "Help evolve the modern web ecosystem. You will build highly responsive, performant user experiences for Google Workspace and Chrome developer tools, utilizing cutting-edge web standards, modern rendering pipelines, and automated UI testing.",
        requirement: ["JavaScript (ESNext)", "React", "TypeScript", "Web Performance", "CSS/Tailwind", "Vite", "a11y"],
        salary: 2800000,
        location: "Bangalore, India",
        jobType: "Full-time",
        position: 5,
        experiance: "2-4",
      },
      {
        title: "Site Reliability Engineer (SRE) - Cloud Infrastructure",
        description: "Maintain the 99.999% availability of Google's global distributed infrastructure. Build automated failure recovery mechanisms, conduct blameless post-mortems, and eliminate toil through software engineering.",
        requirement: ["Linux", "Go", "Python", "Kubernetes", "Prometheus", "Incident Response", "Distributed Systems"],
        salary: 3200000,
        location: "Hyderabad, India",
        jobType: "Full-time",
        position: 2,
        experiance: "3-6",
      },
    ];

    for (const jobData of googleJobsData) {
      const existing = await Job.findOne({ title: jobData.title, company: googleCompany._id });
      if (!existing) {
        await Job.create({
          ...jobData,
          company: googleCompany._id,
          created_by: googleRecruiter._id,
          emailAlerts: true,
        });
        console.log(`🌱 [Seed] Created Google job: ${jobData.title}`);
      } else {
        // Ensure ownership is strictly googleRecruiter
        if (existing.created_by.toString() !== googleRecruiter._id.toString()) {
          existing.created_by = googleRecruiter._id;
          await existing.save();
        }
      }
    }

    // Reassign any non-Google jobs that were created by recruiter@gmail.com to otherRecruiter
    await Job.updateMany(
      { created_by: googleRecruiter._id, company: { $ne: googleCompany._id } },
      { $set: { created_by: otherRecruiter._id } }
    );

    // 6. Ensure Other Companies and Jobs for Marketplace Diversity (Owned by otherRecruiter)
    const otherCompaniesData = [
      {
        name: "Microsoft India",
        description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
        website: "https://careers.microsoft.com",
        location: "Hyderabad, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        jobs: [
          {
            title: "Senior Software Development Engineer (SDE-II) - Azure",
            description: "Design resilient cloud infrastructure and developer tooling for Microsoft Azure.",
            requirement: ["C#", ".NET", "Azure", "Distributed Systems", "SQL Server", "Microservices"],
            salary: 3100000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "Amazon",
        description: "Guided by four principles: customer obsession, passion for invention, commitment to operational excellence, and long-term thinking.",
        website: "https://amazon.jobs",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        jobs: [
          {
            title: "Backend Engineer - AWS Core Services",
            description: "Build robust, low-latency microservices powering AWS cloud computing products.",
            requirement: ["Java", "AWS", "DynamoDB", "REST APIs", "System Design", "Docker"],
            salary: 2900000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 4,
            experiance: "2-5",
          },
        ],
      },
      {
        name: "Meta",
        description: "Meta builds technologies that help people connect, find communities, and grow businesses.",
        website: "https://metacareers.com",
        location: "Gurugram / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        jobs: [
          {
            title: "Product Designer & UI Systems Specialist",
            description: "Lead design systems and user experience patterns across mobile and web interfaces.",
            requirement: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
            salary: 2400000,
            location: "Gurugram, India (Remote)",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Netflix",
        description: "Netflix is one of the world's leading entertainment services with over 260 million paid memberships.",
        website: "https://jobs.netflix.com",
        location: "Remote, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        jobs: [
          {
            title: "Distributed Systems Engineer - Video Streaming Pipeline",
            description: "Scale resilient encoding and content delivery pipelines reaching hundreds of millions of concurrent viewers.",
            requirement: ["Go", "Distributed Systems", "Kafka", "Redis", "Microservices", "Docker"],
            salary: 4500000,
            location: "Remote, India",
            jobType: "Full-time",
            position: 2,
            experiance: "4-8",
          },
        ],
      },
    ];

    for (const compData of otherCompaniesData) {
      let comp = await Company.findOne({ name: compData.name });
      if (!comp) {
        comp = await Company.create({
          name: compData.name,
          description: compData.description,
          website: compData.website,
          location: compData.location,
          logo: compData.logo,
          userId: otherRecruiter._id,
        });
        console.log(`🌱 [Seed] Created partner company: ${compData.name}`);
      }

      for (const j of compData.jobs) {
        const existingJob = await Job.findOne({ title: j.title, company: comp._id });
        if (!existingJob) {
          await Job.create({
            ...j,
            company: comp._id,
            created_by: otherRecruiter._id,
            emailAlerts: true,
          });
          console.log(`🌱 [Seed] Created partner job: ${j.title}`);
        }
      }
    }
  } catch (error) {
    console.error("⚠️ Error while seeding default data:", error.message);
  }
};
