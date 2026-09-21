import { User } from "../models/usermodel.js";
import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import bcrypt from "bcryptjs";

export const seedDefaultData = async () => {
  try {
    const defaultPasswordHash = await bcrypt.hash("123456", 10);
    const GOOGLE_LOGO_URL = "https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png";

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
          bio: "Senior Technical Talent Acquisition Specialist at Google India | Hiring Core Systems, Cloud, Gemini AI, & Student Engineering Programs.",
          skills: ["Technical Sourcing", "Executive Hiring", "Engineering Leadership", "Google Cloud", "AI/ML Talent", "University Recruiting"],
          profilephoto: GOOGLE_LOGO_URL,
        },
      });
      console.log("🌱 [Seed] Created Google recruiter account: recruiter@gmail.com (password: 123456)");
    } else {
      // Keep profile aligned with real Google Recruiter identity
      googleRecruiter.fullname = "Google Talent Acquisition";
      googleRecruiter.profile.profilephoto = GOOGLE_LOGO_URL;
      googleRecruiter.profile.bio = "Senior Technical Talent Acquisition Specialist at Google India | Hiring Core Systems, Cloud, Gemini AI, & Student Engineering Programs.";
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
          bio: "Independent Tech Talent Partner connecting engineers, interns, and specialists with high-growth tech giants and unicorns.",
          skills: ["Talent Acquisition", "Technical Recruiting", "Internship Programs"],
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
        location: "Bangalore, Hyderabad, Gurgaon, India",
        logo: GOOGLE_LOGO_URL,
        userId: googleRecruiter._id,
      });
      console.log("🌱 [Seed] Created company: Google India");
    } else {
      // Ensure ownership belongs to recruiter@gmail.com and logo is always high-quality official Google icon
      googleCompany.userId = googleRecruiter._id;
      googleCompany.logo = GOOGLE_LOGO_URL;
      await googleCompany.save();
    }

    // Reassign any non-Google companies created by recruiter@gmail.com to otherRecruiter
    await Company.updateMany(
      { userId: googleRecruiter._id, name: { $ne: "Google India" } },
      { $set: { userId: otherRecruiter._id } }
    );

    // 5. Seed Realistic Google Jobs (Full-time, Internship & Part-time) - Owned exclusively by recruiter@gmail.com
    const googleJobsData = [
  {
    "title": "Senior Full Stack Engineer - Core Platform & Search",
    "description": "Join the team powering Google's core platform and internal developer tools. Architect high-throughput microservices in Node.js/Go and fluid web interfaces in React and TypeScript.",
    "requirement": [
      "React",
      "TypeScript",
      "Node.js",
      "Distributed Systems",
      "Kubernetes",
      "gRPC",
      "Git"
    ],
    "salary": 4200000,
    "location": "Bangalore, India (Hybrid)",
    "jobType": "Full-time",
    "position": 4,
    "experiance": "4-7"
  },
  {
    "title": "Machine Learning Engineer - Gemini AI & NLP",
    "description": "Drive cutting-edge AI innovations by developing and scaling generative AI models on Google infrastructure. Collaborate with Google DeepMind researchers to fine-tune Gemini multi-modal systems.",
    "requirement": [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Transformers",
      "NLP",
      "LLMs",
      "Distributed Training"
    ],
    "salary": 4800000,
    "location": "Bangalore, India",
    "jobType": "Full-time",
    "position": 3,
    "experiance": "3-6"
  },
  {
    "title": "Cloud Solutions Architect - Google Cloud (GCP)",
    "description": "Engage with enterprise engineering teams to design and migrate mission-critical applications to Google Cloud Platform. Lead architecture for container orchestration and security.",
    "requirement": [
      "Google Cloud (GCP)",
      "Kubernetes (GKE)",
      "Terraform",
      "Cloud Architecture",
      "Docker",
      "CI/CD"
    ],
    "salary": 3600000,
    "location": "Hyderabad, India (Hybrid)",
    "jobType": "Full-time",
    "position": 2,
    "experiance": "4-7"
  },
  {
    "title": "Frontend Software Engineer III - Chrome & Web Platform",
    "description": "Help evolve the modern web ecosystem. Build highly responsive user experiences for Google Workspace and Chrome developer tools with modern web standards.",
    "requirement": [
      "JavaScript (ESNext)",
      "React",
      "TypeScript",
      "Web Performance",
      "CSS/Tailwind",
      "Vite",
      "a11y"
    ],
    "salary": 1800000,
    "location": "Bangalore, India",
    "jobType": "Full-time",
    "position": 5,
    "experiance": "2-4"
  },
  {
    "title": "Site Reliability Engineer (SRE) - Cloud Infrastructure",
    "description": "Maintain the 99.999% availability of Google's global distributed infrastructure. Build automated failure recovery mechanisms and eliminate toil through software engineering.",
    "requirement": [
      "Linux",
      "Go",
      "Python",
      "Kubernetes",
      "Prometheus",
      "Incident Response",
      "Distributed Systems"
    ],
    "salary": 1400000,
    "location": "Bangalore, India",
    "jobType": "Full-time",
    "position": 3,
    "experiance": "1-3"
  },
  {
    "title": "Software Engineering Intern - Summer 2026 (STEP)",
    "description": "Google STEP (Student Training in Engineering Program) is a 12-week developmental summer internship for undergraduate students passionate about technology and software development. Work with Google mentors on production codebase.",
    "requirement": [
      "Data Structures & Algorithms",
      "C++ / Java / Python",
      "Problem Solving",
      "Git",
      "Computer Science Fundamentals"
    ],
    "salary": 600000,
    "location": "Bangalore, India",
    "jobType": "Internship",
    "position": 10,
    "experiance": "0-1"
  },
  {
    "title": "AI Research Intern - Gemini Multimodal Foundation Models",
    "description": "Work alongside Google Research and DeepMind scientists on exploratory generative AI benchmarks, tokenization strategies, and prompt alignment for multimodal Gemini models.",
    "requirement": [
      "Python",
      "PyTorch",
      "Deep Learning",
      "Linear Algebra",
      "NLP / Computer Vision",
      "Research Mindset"
    ],
    "salary": 800000,
    "location": "Bangalore, India",
    "jobType": "Internship",
    "position": 5,
    "experiance": "0-1"
  },
  {
    "title": "Google Cloud Student Ambassador & Technical Specialist",
    "description": "Flexible part-time role supporting student developer clubs, creating Google Cloud tutorials, and providing technical guidance on GCP starter credits and certifications.",
    "requirement": [
      "Google Cloud Basics",
      "Python / JavaScript",
      "Technical Writing",
      "Presentation Skills",
      "Community Leadership"
    ],
    "salary": 240000,
    "location": "Bangalore, India (Remote-friendly)",
    "jobType": "Part-time",
    "position": 4,
    "experiance": "0-2"
  }
];

    for (const j of googleJobsData) {
      const existingJob = await Job.findOne({ title: j.title, company: googleCompany._id });
      if (!existingJob) {
        await Job.create({
          ...j,
          company: googleCompany._id,
          created_by: googleRecruiter._id,
          emailAlerts: true,
        });
        console.log(`🌱 [Seed] Created Google job: ${j.title} (${j.jobType})`);
      } else {
        // Ensure strictly owned by recruiter@gmail.com and jobType/salary updated
        if (existingJob.created_by.toString() !== googleRecruiter._id.toString()) {
          existingJob.created_by = googleRecruiter._id;
        }
        existingJob.jobType = j.jobType;
        existingJob.salary = j.salary;
        existingJob.position = j.position;
        existingJob.description = j.description;
        await existingJob.save();
      }
    }

    // 6. Ensure 37 Partner Companies & ~111 Jobs (Diverse Mix of Full-time, Internship & Part-time)
    const otherCompaniesData = [
  {
    "name": "Microsoft India",
    "description": "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
    "website": "https://careers.microsoft.com",
    "location": "Hyderabad, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230078D4%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EMS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EAzure%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Software Development Engineer (SDE-II) - Azure",
        "description": "Build ultra-low latency distributed systems powering Microsoft Azure compute and storage layers.",
        "requirement": [
          "C# / .NET Core",
          "C++",
          "Distributed Systems",
          "Azure",
          "Microservices"
        ],
        "salary": 2800000,
        "location": "Hyderabad, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-6"
      },
      {
        "title": "Security Software Engineer - Microsoft Defender",
        "description": "Develop automated threat mitigation pipelines and cloud-native security controls defending global enterprises.",
        "requirement": [
          "Python",
          "Rust",
          "Linux Kernel",
          "Cybersecurity",
          "Network Security"
        ],
        "salary": 1800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Software Engineering Intern - Cloud & AI (Summer 2026)",
        "description": "10-week summer internship working on high-impact Azure cloud services, Copilot AI integrations, and developer tooling.",
        "requirement": [
          "C# / Java",
          "Data Structures",
          "Algorithms",
          "Cloud Basics",
          "Git"
        ],
        "salary": 550000,
        "location": "Hyderabad, India",
        "jobType": "Internship",
        "position": 8,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Amazon",
    "description": "Amazon is guided by customer obsession, passion for invention, and operational excellence.",
    "website": "https://amazon.jobs",
    "location": "Bangalore, Hyderabad, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23232F3E%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23FF9900%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3Ea%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23FF9900%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EAWS%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Engineer - AWS Core Services",
        "description": "Scale mission-critical storage and distributed database microservices for millions of AWS developers.",
        "requirement": [
          "Java",
          "AWS (DynamoDB, SQS, S3)",
          "Distributed Systems",
          "RESTful APIs",
          "Docker"
        ],
        "salary": 2600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 4,
        "experiance": "3-5"
      },
      {
        "title": "Frontend Engineer - Amazon Prime Video Web",
        "description": "Deliver cinematic streaming web apps with zero buffering, progressive web capabilities, and smooth 60fps UI.",
        "requirement": [
          "React",
          "TypeScript",
          "Video Streaming (HLS/DASH)",
          "CSS Modules",
          "Web Performance"
        ],
        "salary": 1700000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "SDE Intern - AWS Cloud Systems & Infrastructure",
        "description": "Summer developer internship building automation tools and serverless event-driven lambdas on AWS infrastructure.",
        "requirement": [
          "Java / Python",
          "Data Structures",
          "OOP Principles",
          "Problem Solving"
        ],
        "salary": 500000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 12,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Meta",
    "description": "Meta builds technologies that help people connect, find communities, and grow businesses.",
    "website": "https://metacareers.com",
    "location": "Gurgaon, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230081FB%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3E%E2%88%9E%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EMeta%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Product Designer & UI Systems Specialist",
        "description": "Design intuitive user interactions and scalable design system tokens across WhatsApp and Instagram web platforms.",
        "requirement": [
          "Figma",
          "UI/UX",
          "Design Systems",
          "Prototyping",
          "Interaction Design",
          "User Research"
        ],
        "salary": 1500000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Data Engineer - Analytics & Experimentation",
        "description": "Build petabyte-scale data pipelines and automated A/B testing infrastructure supporting social user engagement.",
        "requirement": [
          "Python",
          "SQL",
          "Spark",
          "Presto",
          "Data Modeling",
          "A/B Testing"
        ],
        "salary": 2400000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-5"
      },
      {
        "title": "Product Design Intern - Reality Labs & Instagram Web",
        "description": "Join Meta design leads to prototype new spatial interfaces and responsive web layouts for global creative communities.",
        "requirement": [
          "Figma",
          "Interaction Design",
          "Design Thinking",
          "Portfolio / Case Studies"
        ],
        "salary": 450000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Netflix",
    "description": "Netflix is one of the world's leading entertainment services with over 260 million memberships.",
    "website": "https://jobs.netflix.com",
    "location": "Mumbai, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23E50914%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EN%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ENetflix%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Distributed Systems Engineer - Video Streaming Pipeline",
        "description": "Optimize real-time video encoding algorithms and CDN edge cache placement algorithms for millions of concurrent streams.",
        "requirement": [
          "Java",
          "Go",
          "Distributed Systems",
          "Microservices",
          "Kafka",
          "AWS"
        ],
        "salary": 4500000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-7"
      },
      {
        "title": "Full Stack Engineer - Studio Production Tools",
        "description": "Craft internal web tools that orchestrate film and series production workflows from script to screen.",
        "requirement": [
          "React",
          "GraphQL",
          "Node.js",
          "TypeScript",
          "Tailwind CSS"
        ],
        "salary": 3500000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-5"
      },
      {
        "title": "Content Localization & Subtitle Quality Specialist",
        "description": "Part-time editorial specialist validating Hindi, Tamil, and Telugu audio-sync subtitle timing and localized UI strings.",
        "requirement": [
          "Multilingual Proficiency",
          "Audio/Video Editing Basics",
          "Attention to Detail",
          "Quality Assurance"
        ],
        "salary": 550000,
        "location": "Mumbai, India (Flexible / Remote)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "1-3"
      }
    ]
  },
  {
    "name": "Apple",
    "description": "Apple revolutionized personal technology and today leads the world in innovation with iPhone, Mac, and Apple Watch.",
    "website": "https://jobs.apple.com",
    "location": "Hyderabad, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%231D1D1F%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3E%EF%A3%BF%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EApple%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "iOS Platform Engineer - Core System Frameworks",
        "description": "Architect high-performance Swift frameworks for iOS, iPadOS, and macOS with focus on memory safety and battery life.",
        "requirement": [
          "Swift",
          "Objective-C",
          "iOS SDK",
          "Instruments",
          "Concurrency",
          "Algorithms"
        ],
        "salary": 3200000,
        "location": "Hyderabad, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-6"
      },
      {
        "title": "Machine Learning Scientist - Siri & Multimodal AI",
        "description": "Train low-latency on-device machine learning models powering contextual speech recognition and on-device intelligence.",
        "requirement": [
          "PyTorch",
          "Python",
          "C++",
          "CoreML",
          "NLP",
          "Acoustic Modeling"
        ],
        "salary": 3800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-6"
      },
      {
        "title": "iOS Engineering Intern - Core System Frameworks",
        "description": "Exciting 6-month developer internship crafting Swift modules, SwiftUI samples, and unit testing Apple platform APIs.",
        "requirement": [
          "Swift",
          "SwiftUI",
          "Data Structures",
          "Git",
          "Computer Science Fundamentals"
        ],
        "salary": 700000,
        "location": "Hyderabad, India",
        "jobType": "Internship",
        "position": 6,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Adobe",
    "description": "Adobe is the global leader in digital media and digital marketing solutions.",
    "website": "https://careers.adobe.com",
    "location": "Noida, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FF0000%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EA%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EAdobe%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior C++ Graphics Engineer - Creative Cloud",
        "description": "Optimize vector rendering engines and GPU shader pipelines for Photoshop Web and Illustrator.",
        "requirement": [
          "C++20",
          "WebAssembly",
          "OpenGL / Metal",
          "Computer Graphics",
          "Algorithms"
        ],
        "salary": 2800000,
        "location": "Noida, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-7"
      },
      {
        "title": "Cloud Infrastructure Engineer - Firefly Generative AI",
        "description": "Scale high-performance multi-GPU Kubernetes clusters to serve sub-second AI image and video generation prompts.",
        "requirement": [
          "Kubernetes",
          "Docker",
          "Python",
          "Terraform",
          "NVIDIA CUDA",
          "Prometheus"
        ],
        "salary": 1900000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Research Intern - Creative Cloud & Generative AI",
        "description": "Research internship exploring neural rendering algorithms, vector sketch completion, and diffusion brush pipelines.",
        "requirement": [
          "Python",
          "PyTorch",
          "Computer Graphics",
          "Deep Learning",
          "Linear Algebra"
        ],
        "salary": 600000,
        "location": "Noida, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Uber",
    "description": "Uber's mission is to ignite opportunity by setting the world in motion across ride-sharing and delivery.",
    "website": "https://uber.com/careers",
    "location": "Bangalore, Hyderabad, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23000000%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2256%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2220%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EUBER%3C%2Ftext%3E%0A%20%20%20%20%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Engineer - Real-Time Marketplace Matching",
        "description": "Engineer low-latency dispatch and ride-matching algorithms managing millions of trips per hour across global metros.",
        "requirement": [
          "Go",
          "Java",
          "Kafka",
          "Redis",
          "Distributed Systems",
          "Geospatial Indexing"
        ],
        "salary": 3000000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-5"
      },
      {
        "title": "Staff Data Scientist - Dynamic Pricing & ETA",
        "description": "Formulate econometric algorithms and deep learning models predicting dynamic demand and traffic conditions.",
        "requirement": [
          "Python",
          "Machine Learning",
          "Econometrics",
          "Spark",
          "Deep Learning"
        ],
        "salary": 3800000,
        "location": "Hyderabad, India",
        "jobType": "Full-time",
        "position": 1,
        "experiance": "5-8"
      },
      {
        "title": "Data Science Intern - Marketplace & Real-Time Pricing",
        "description": "Analyze rider conversion funnels, driver dispatch metrics, and estimate ETA accuracy using statistical models.",
        "requirement": [
          "Python",
          "SQL",
          "Pandas",
          "Probability & Statistics",
          "Data Visualization"
        ],
        "salary": 700000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 5,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Spotify",
    "description": "Spotify revolutionized music listening forever, connecting listeners with over 100 million tracks.",
    "website": "https://lifeatspotify.com",
    "location": "Mumbai, India (Remote-friendly)",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%231DB954%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2220%22%20fill%3D%22%23000000%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3E((%C2%B7))%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23000000%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ESpotify%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Audio Recommendation Engineer - Discover Weekly",
        "description": "Build personalized music discovery algorithms combining collaborative filtering and audio waveform embeddings.",
        "requirement": [
          "Python",
          "Java",
          "TensorFlow",
          "Cassandra",
          "BigQuery",
          "Recommendation Systems"
        ],
        "salary": 2900000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-6"
      },
      {
        "title": "Client Platform Engineer - Desktop & Web Player",
        "description": "Drive fluid playback experiences and offline caching mechanisms for millions of active music and podcast lovers.",
        "requirement": [
          "TypeScript",
          "React",
          "Web Audio API",
          "Service Workers",
          "Performance Profiling"
        ],
        "salary": 1600000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Audio Engineering Intern - Web Player Experience",
        "description": "Explore audio waveform rendering, playlist keyboard shortcuts, and smooth volume transitions in modern browsers.",
        "requirement": [
          "JavaScript",
          "HTML5 Audio",
          "React",
          "CSS",
          "Problem Solving"
        ],
        "salary": 600000,
        "location": "Mumbai, India (Remote)",
        "jobType": "Internship",
        "position": 3,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Airbnb",
    "description": "Airbnb has welcomed over 1.5 billion guest arrivals in almost every country across the globe.",
    "website": "https://careers.airbnb.com",
    "location": "Bangalore, Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FF5A5F%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EA%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EAirbnb%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Full Stack Engineer - Host Hospitality & Payouts",
        "description": "Build end-to-end multi-currency payout calculation systems and calendar reservation tools for international hosts.",
        "requirement": [
          "React",
          "Ruby on Rails",
          "Java",
          "GraphQL",
          "MySQL",
          "REST APIs"
        ],
        "salary": 2800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-5"
      },
      {
        "title": "Security & Trust Engineer - Anti-Fraud Detection",
        "description": "Detect unauthorized account takeovers and fake property listings using real-time machine learning heuristics.",
        "requirement": [
          "Python",
          "Spark",
          "Fraud Detection",
          "Risk Analysis",
          "Kafka",
          "Data Engineering"
        ],
        "salary": 1800000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Community Support & Trust Specialist",
        "description": "Part-time guest and host dispute resolution specialist ensuring safety standards and authentic travel experiences.",
        "requirement": [
          "Customer Communication",
          "Problem Resolution",
          "Empathy",
          "Detail-Oriented"
        ],
        "salary": 500000,
        "location": "Gurgaon, India (Remote)",
        "jobType": "Part-time",
        "position": 4,
        "experiance": "1-3"
      }
    ]
  },
  {
    "name": "LinkedIn",
    "description": "LinkedIn connects the world's professionals with over 1 billion members worldwide.",
    "website": "https://careers.linkedin.com",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230A66C2%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2256%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3Ein%3C%2Ftext%3E%0A%20%20%20%20%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Software Engineer - Economic Graph & Feed Ranking",
        "description": "Scale LinkedIn's viral feed ranking algorithms using high-throughput graph processing frameworks.",
        "requirement": [
          "Java",
          "Scala",
          "Kafka",
          "Graph Databases",
          "Hadoop",
          "Distributed Systems"
        ],
        "salary": 2700000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 4,
        "experiance": "2-5"
      },
      {
        "title": "Frontend Engineer - Talent Solutions & Recruiter Web",
        "description": "Design accessible enterprise recruiter search interfaces helping companies hire top technical candidates rapidly.",
        "requirement": [
          "Ember.js / React",
          "TypeScript",
          "HTML5",
          "CSS3",
          "Design Systems"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Technical Content & Community Moderator",
        "description": "Part-time position monitoring tech job boards, flagging spam postings, and curating daily career discussions.",
        "requirement": [
          "Professional Writing",
          "Content Moderation",
          "Community Management",
          "Communication"
        ],
        "salary": 450000,
        "location": "Bangalore, India (Flexible)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "1-2"
      }
    ]
  },
  {
    "name": "Stripe",
    "description": "Stripe is a financial infrastructure platform for the internet, handling billions of dollars annually.",
    "website": "https://stripe.com/jobs",
    "location": "Bangalore, India (Remote-friendly)",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23635BFF%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3ES%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EStripe%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Staff Payment Infrastructure Engineer - Core Banking",
        "description": "Ensure exactly-once processing across heterogeneous international payment networks with zero downtime.",
        "requirement": [
          "Ruby",
          "Go",
          "Distributed Transactions",
          "PostgreSQL",
          "Idempotency Patterns"
        ],
        "salary": 4800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "5-9"
      },
      {
        "title": "Developer Experience Engineer - Public APIs & SDKs",
        "description": "Maintain the world's gold standard developer APIs, auto-generating client SDKs and testing interactive docs.",
        "requirement": [
          "TypeScript",
          "Python",
          "Go",
          "API Design",
          "OpenAPI",
          "Developer Tooling"
        ],
        "salary": 3000000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-6"
      },
      {
        "title": "Software Engineering Intern - Developer APIs & Tooling",
        "description": "Build developer CLI utilities, automated API test suites, and interactive code snippet builders for Stripe docs.",
        "requirement": [
          "TypeScript",
          "Ruby / Python",
          "REST APIs",
          "Git",
          "Problem Solving"
        ],
        "salary": 800000,
        "location": "Bangalore, India (Remote)",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Atlassian",
    "description": "Atlassian powers teamwork with Jira, Confluence, and Bitbucket for over 260,000 customers.",
    "website": "https://atlassian.com/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230052CC%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3E%E2%96%B2%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EAtlassian%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Full Stack Engineer - Jira Cloud Agility",
        "description": "Architect high-performance real-time Kanban boards and agile sprint planners used by software teams.",
        "requirement": [
          "React",
          "TypeScript",
          "Node.js",
          "GraphQL",
          "AWS DynamoDB",
          "Jest"
        ],
        "salary": 2600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-6"
      },
      {
        "title": "DevOps & Cloud Reliability Engineer - Platform Identity",
        "description": "Manage unified Single Sign-On and multi-factor authentication systems for Atlassian Cloud.",
        "requirement": [
          "Terraform",
          "Kubernetes",
          "AWS",
          "OAuth2 / OIDC",
          "Docker",
          "SRE"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Software Engineering Intern - Jira Cloud Agility",
        "description": "Collaborate with agile sprint teams to build Jira keyboard shortcuts, markdown renderers, and dark-mode themes.",
        "requirement": [
          "React",
          "JavaScript",
          "HTML/CSS",
          "Git",
          "Data Structures"
        ],
        "salary": 600000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 5,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Salesforce",
    "description": "Salesforce is the #1 AI CRM, connecting companies and customers on the Einstein 1 Platform.",
    "website": "https://salesforce.com/careers",
    "location": "Hyderabad, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%2300A1E0%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3E%E2%98%81%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ESalesforce%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Cloud Software Engineer - Einstein 1 AI Platform",
        "description": "Integrate large language models into enterprise CRM sales and service agent workflows with strict data privacy.",
        "requirement": [
          "Java",
          "Python",
          "GenAI",
          "RAG Systems",
          "Kubernetes",
          "Microservices"
        ],
        "salary": 2800000,
        "location": "Hyderabad, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-5"
      },
      {
        "title": "Full Stack Engineer - Lightning Web Components",
        "description": "Develop reusable enterprise web components adhering to modern web standards and accessibility guidelines.",
        "requirement": [
          "JavaScript (LWC/Web Components)",
          "TypeScript",
          "Apex / Java",
          "CSS3",
          "REST APIs"
        ],
        "salary": 1500000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Salesforce CRM Specialist & Trailhead Guide",
        "description": "Part-time student consultant delivering hands-on Trailhead workshops and mentoring CRM administrators.",
        "requirement": [
          "Salesforce Basics",
          "Apex / JavaScript",
          "Technical Mentorship",
          "Communication"
        ],
        "salary": 500000,
        "location": "Hyderabad, India (Flexible)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "1-2"
      }
    ]
  },
  {
    "name": "Oracle",
    "description": "Oracle offers autonomous database infrastructure and cloud applications worldwide.",
    "website": "https://oracle.com/careers",
    "location": "Bangalore, Hyderabad, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23C74634%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EO%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EOracle%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Cloud Infrastructure Architect - OCI Virtualization",
        "description": "Engineer bare-metal cloud infrastructure and Software Defined Networking (SDN) backbones for enterprise databases.",
        "requirement": [
          "C++",
          "Linux Kernel",
          "KVM",
          "BGP / SDN",
          "Distributed Storage",
          "Python"
        ],
        "salary": 3000000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-7"
      },
      {
        "title": "Database Systems Engineer - Autonomous Database",
        "description": "Innovate on automated self-tuning, query indexing, and disaster recovery algorithms for Oracle databases.",
        "requirement": [
          "C / C++",
          "Database Internals",
          "SQL Optimization",
          "Linux",
          "Concurrency"
        ],
        "salary": 1800000,
        "location": "Hyderabad, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-5"
      },
      {
        "title": "Cloud Systems Intern - OCI Virtualization",
        "description": "Linux systems programming internship building kernel monitoring utilities and virtualization health checks.",
        "requirement": [
          "C / C++",
          "Linux Command Line",
          "Operating Systems",
          "Git"
        ],
        "salary": 650000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Cisco",
    "description": "Cisco is the worldwide technology leader securely connecting everything across networking and security.",
    "website": "https://cisco.com/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23049FD9%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2226%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3Eili%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ECisco%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Network Systems Engineer - SD-WAN & Cloud Mesh",
        "description": "Build cloud-managed network routing engines routing enterprise internet traffic securely across hybrid clouds.",
        "requirement": [
          "C / C++",
          "Go",
          "TCP/IP",
          "BGP / OSPF",
          "Linux Networking",
          "Docker"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Cybersecurity Analyst - Splunk Threat Intelligence",
        "description": "Detect sophisticated network intrusions and automate Security Operations Center (SOC) playbooks.",
        "requirement": [
          "SIEM / Splunk",
          "Python",
          "Network Forensics",
          "Threat Hunting",
          "MITRE ATT&CK"
        ],
        "salary": 950000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Network Support Engineer & Lab Assistant",
        "description": "Part-time laboratory technician verifying network switch configurations and assisting students with Cisco CCNA labs.",
        "requirement": [
          "TCP/IP",
          "Switching & Routing",
          "Cisco Packet Tracer",
          "Basic Hardware"
        ],
        "salary": 300000,
        "location": "Bangalore, India (Part-time)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Flipkart",
    "description": "Flipkart is India's leading e-commerce marketplace, serving 500+ million customers.",
    "website": "https://flipkartcareers.com",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%232874F0%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23FFD700%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EF%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23FFD700%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EFlipkart%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Software Development Engineer (SDE-II) - Big Billion Days Tech",
        "description": "Design high-scale inventory reservation and order fulfillment engines handling 100k+ orders/sec.",
        "requirement": [
          "Java",
          "Spring Boot",
          "Kafka",
          "MySQL",
          "Aerospike / Redis",
          "Distributed Systems"
        ],
        "salary": 1800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 4,
        "experiance": "2-4"
      },
      {
        "title": "Frontend Architect - Flipkart Mobile Web",
        "description": "Deliver fast page transitions and image lazy-loading pipelines for shoppers on mobile networks.",
        "requirement": [
          "React",
          "JavaScript",
          "Webpack/Vite",
          "PWA",
          "Web Performance",
          "Redux"
        ],
        "salary": 1400000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Software Development Engineer (SDE) Intern - Supply Chain",
        "description": "6-month campus internship contributing to Flipkart's automated warehouse dispatch algorithms.",
        "requirement": [
          "Java / Python",
          "Data Structures",
          "Algorithms",
          "SQL",
          "Git"
        ],
        "salary": 450000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 10,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Swiggy",
    "description": "Swiggy is India's leading on-demand convenience platform for food, groceries (Instamart), and dining.",
    "website": "https://careers.swiggy.com",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FC8019%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3ES%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ESwiggy%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Engineer - Instamart Quick Commerce Engine",
        "description": "Develop sub-second batching and delivery partner assignment algorithms for 10-minute grocery dark-store deliveries.",
        "requirement": [
          "Go",
          "Java",
          "PostgreSQL",
          "Kafka",
          "Redis",
          "Microservices"
        ],
        "salary": 1500000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Mobile App Engineer - Android Core Team",
        "description": "Architect core modular navigation frameworks and live order tracking maps for Swiggy's consumer app.",
        "requirement": [
          "Kotlin",
          "Android SDK",
          "Jetpack Compose",
          "Coroutines",
          "Google Maps API"
        ],
        "salary": 750000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Backend Engineering Intern - Instamart Routing",
        "description": "Work on route optimization and microservice telemetry for Instamart delivery fleets across top Indian metros.",
        "requirement": [
          "Go / Python",
          "REST APIs",
          "PostgreSQL",
          "Data Structures",
          "Git"
        ],
        "salary": 300000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 6,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Zomato",
    "description": "Zomato's mission is better food for more people, operating India's leading food delivery network.",
    "website": "https://zomato.com/careers",
    "location": "Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23E23744%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EZ%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EZomato%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Engineer - Restaurant Partner Growth Platform",
        "description": "Scale cloud kitchen management systems, menu sync pipelines, and merchant payout analytics.",
        "requirement": [
          "Node.js",
          "Python",
          "MongoDB",
          "RabbitMQ",
          "AWS",
          "REST APIs"
        ],
        "salary": 800000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "1-3"
      },
      {
        "title": "iOS Engineer - Dining & Discovery Experience",
        "description": "Craft immersive video menus, table booking flows, and curated culinary discovery features in Swift and SwiftUI.",
        "requirement": [
          "Swift",
          "SwiftUI",
          "Combine",
          "Core Animation",
          "RESTful APIs"
        ],
        "salary": 700000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Mobile Engineering Intern - iOS Dining & Discovery",
        "description": "Build delightful interactive restaurant cards, dish reviews, and photo upload components on iOS.",
        "requirement": [
          "Swift",
          "iOS Basics",
          "AutoLayout / SwiftUI",
          "Problem Solving"
        ],
        "salary": 300000,
        "location": "Gurgaon, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Razorpay",
    "description": "Razorpay powers digital payments and business banking for over 10 million Indian businesses.",
    "website": "https://razorpay.com/jobs",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230C2340%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%233395FF%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3ER%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%233395FF%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ERazorpay%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Fintech Systems Engineer - UPI & Payment Gateway Core",
        "description": "Engineer ultra-reliable payment processing pipelines achieving 99.999% uptime during peak flash sales.",
        "requirement": [
          "Go",
          "PHP / Laravel",
          "PostgreSQL",
          "Redis",
          "Kafka",
          "Distributed Systems"
        ],
        "salary": 2500000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-5"
      },
      {
        "title": "Full Stack Engineer - RazorpayX Neobanking Suite",
        "description": "Build financial operations dashboards, vendor payout workflows, and corporate credit card management tools.",
        "requirement": [
          "React",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Tailwind CSS"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Fintech Engineering Intern - Payment Gateway Core",
        "description": "Hands-on internship integrating webhook dispatchers, sandbox payment emulators, and SDK documentation.",
        "requirement": [
          "Node.js / Go",
          "JavaScript",
          "SQL",
          "REST APIs",
          "Git"
        ],
        "salary": 480000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 6,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "PhonePe",
    "description": "PhonePe is India's leading digital payments company, processing over 45% of UPI volume.",
    "website": "https://phonepe.com/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%235F259F%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EPe%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EPhonePe%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Software Engineer - UPI Switching & Core Settlement",
        "description": "Scale high-frequency transactional switching engines interfacing with NPCI and major Indian banking hosts.",
        "requirement": [
          "Java",
          "Spring Boot",
          "HBase",
          "Kafka",
          "Aerospike",
          "High Concurrency"
        ],
        "salary": 1800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 4,
        "experiance": "2-4"
      },
      {
        "title": "Site Reliability Engineer - High Volume Payments",
        "description": "Maintain bulletproof infrastructure handling over 200 million daily financial transactions.",
        "requirement": [
          "Kubernetes",
          "Linux",
          "Prometheus",
          "Golang / Python",
          "Ceph / Storage",
          "SRE"
        ],
        "salary": 1500000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Backend Engineering Intern - High-Concurrency UPI",
        "description": "Participate in stress testing, synthetic latency injection, and distributed caching optimizations for UPI APIs.",
        "requirement": [
          "Java",
          "Multithreading",
          "Data Structures",
          "Linux",
          "Git"
        ],
        "salary": 420000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 5,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "CRED",
    "description": "CRED is a members-only club rewarding creditworthy individuals with financial privileges and lifestyle products.",
    "website": "https://cred.club/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230F0F0F%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ECRED%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Product Engineer - High-End Aesthetic UI/UX",
        "description": "Craft pixel-perfect, neo-brutalist dark-themed web and mobile interfaces with smooth physics and micro-interactions.",
        "requirement": [
          "React",
          "React Native",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "WebGL"
        ],
        "salary": 2600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-5"
      },
      {
        "title": "Backend Engineer - CRED Pay & Peer Lending",
        "description": "Architect secure financial ledger services and credit score monitoring engines with end-to-end encryption.",
        "requirement": [
          "Java",
          "Go",
          "PostgreSQL",
          "Kafka",
          "Microservices",
          "Security Compliance"
        ],
        "salary": 1900000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Frontend Design Engineering Intern - Visual Interactions",
        "description": "Internship crafting fluid SVG animations, dark mode shaders, and interactive reward unlock mini-games.",
        "requirement": [
          "React",
          "CSS / Tailwind",
          "Framer Motion",
          "Creative Coding",
          "JavaScript"
        ],
        "salary": 650000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Zerodha",
    "description": "Zerodha is India's largest retail stock broker by active clients, pioneering discount brokerage with minimalist tech.",
    "website": "https://zerodha.com/about",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23387ED1%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EZ%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EZerodha%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Systems Engineer - Kite Trading Platform Core",
        "description": "Build lean, zero-bloat order execution gateways handling gigabytes of real-time WebSocket market depth ticks.",
        "requirement": [
          "Go",
          "PostgreSQL",
          "Redis",
          "WebSockets",
          "Linux",
          "Minimalist Architecture"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Frontend Engineer - Kite Web & Charts",
        "description": "Optimize high-frequency financial charts, technical indicator overlays, and keyboard-first trade interfaces.",
        "requirement": [
          "Vue.js / React",
          "HTML5 Canvas",
          "WebSockets",
          "Data Visualization",
          "JavaScript"
        ],
        "salary": 1200000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Systems Engineering Intern - Kite Trading Infrastructure",
        "description": "Work on low-overhead micro-benchmarks, Redis cache eviction telemetry, and Go concurrency utilities.",
        "requirement": [
          "Go",
          "Linux Basics",
          "Algorithms",
          "Network Sockets",
          "Git"
        ],
        "salary": 400000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 3,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Ola",
    "description": "Ola is India's leading mobility platform, pioneering ride-hailing and electric vehicle manufacturing.",
    "website": "https://olacabs.com/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23000000%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2256%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2226%22%20fill%3D%22%23A4D65E%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EOLA%3C%2Ftext%3E%0A%20%20%20%20%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Staff Backend Engineer - Ride Dispatch & Map Matching Engine",
        "description": "Scale high-throughput ride-matching algorithms and real-time routing engines powering cab and auto bookings.",
        "requirement": [
          "Java",
          "Go",
          "Kafka",
          "Redis",
          "Geospatial Indexing",
          "Distributed Systems"
        ],
        "salary": 2700000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "4-7"
      },
      {
        "title": "Lead Systems Engineer - Battery Management & Telematics",
        "description": "Develop embedded firmware and telemetry ingestion pipelines for Ola Electric scooters and Gen-3 platforms.",
        "requirement": [
          "Embedded C++",
          "CAN Bus",
          "IoT Protocols (MQTT)",
          "Linux",
          "Battery Systems"
        ],
        "salary": 1400000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Fleet Telemetry & Dispatch Operations Analyst",
        "description": "Part-time role monitoring EV charging station utilization, battery diagnostics, and driver shift scheduling.",
        "requirement": [
          "Data Analysis",
          "Excel / SQL",
          "IoT Dashboard Monitoring",
          "Problem Solving"
        ],
        "salary": 300000,
        "location": "Bangalore, India (Flexible / Part-time)",
        "jobType": "Part-time",
        "position": 4,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Meesho",
    "description": "Meesho is India's fastest-growing social e-commerce platform, empowering small businesses across Bharat.",
    "website": "https://meesho.io",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23F43397%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3Em%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EMeesho%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Software Engineer - Supply Chain & Fulfillment Logistics",
        "description": "Design automated 3PL courier assignment, reverse logistics tracking, and warehouse dispatch software.",
        "requirement": [
          "Java",
          "Spring Boot",
          "Kafka",
          "MySQL",
          "Microservices",
          "AWS"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Data Platform Engineer - Feed Personalization & Catalog Ranking",
        "description": "Implement machine learning recommendation models matching relevant products with price-sensitive regional shoppers.",
        "requirement": [
          "Python",
          "Spark",
          "PyTorch",
          "Redis",
          "Data Pipelines",
          "Recommendation Systems"
        ],
        "salary": 850000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Data Analytics Intern - Reseller Growth & Catalog",
        "description": "Internship running SQL analysis on regional tier-2 and tier-3 consumer cohorts, discounts, and return rates.",
        "requirement": [
          "SQL",
          "Python",
          "Tableau / Metabase",
          "Data Analysis",
          "Curiosity"
        ],
        "salary": 240000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Groww",
    "description": "Groww is India's leading wealth-tech platform, enabling 40+ million users to invest in stocks, mutual funds, and ETFs.",
    "website": "https://groww.in/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%2300D09C%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EG%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EGroww%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Backend Engineer - Mutual Funds & Demat Execution Engine",
        "description": "Build atomic financial transaction engines communicating with BSE Star MF, NSE, and depositories with sub-ms latency.",
        "requirement": [
          "Go",
          "Java",
          "PostgreSQL",
          "Kafka",
          "Redis",
          "Financial Systems"
        ],
        "salary": 1800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "3-5"
      },
      {
        "title": "Mobile Engineer - High-Speed Trading Mobile App",
        "description": "Develop interactive stock charts and real-time market depth streaming using React Native and native TurboModules.",
        "requirement": [
          "React Native",
          "TypeScript",
          "WebSockets",
          "Native iOS/Android Bridge",
          "Performance Tuning"
        ],
        "salary": 1300000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Fintech Product Intern - Mutual Funds & Wealth Management",
        "description": "Assist product managers in designing user-friendly SIP calculators, ETF discovery filters, and onboarding journeys.",
        "requirement": [
          "Product Thinking",
          "Figma Basics",
          "Financial Markets Interest",
          "Data Analysis"
        ],
        "salary": 360000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 3,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Zepto",
    "description": "Zepto delivers groceries, fresh produce, and essentials in 10 minutes via optimized dark stores.",
    "website": "https://zeptonow.com/careers",
    "location": "Mumbai, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23800080%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EZ%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EZepto%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Engineer - Dark Store Inventory & Dispatch Algorithm",
        "description": "Optimize pick-and-pack warehouse pathing and automated rider routing algorithms guaranteeing sub-10 minute delivery.",
        "requirement": [
          "Go",
          "Python",
          "PostgreSQL",
          "Redis",
          "Kafka",
          "Graph Algorithms"
        ],
        "salary": 1500000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 4,
        "experiance": "2-4"
      },
      {
        "title": "Frontend Engineer - Customer Checkout Web & PWA",
        "description": "Build high-conversion checkout flows, instant cart search, and live delivery telemetry tracking in Next.js.",
        "requirement": [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Redux Toolkit"
        ],
        "salary": 650000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Quick Commerce Logistics Intern - Dark Store Automation",
        "description": "Internship studying store layout ergonomics, SKU replenishment triggers, and real-time picker app usability.",
        "requirement": [
          "Process Optimization",
          "Python / SQL",
          "Problem Solving",
          "Field Observations"
        ],
        "salary": 240000,
        "location": "Mumbai, India",
        "jobType": "Internship",
        "position": 5,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Postman",
    "description": "Postman is the enterprise API platform used by 30+ million developers and 500,000+ organizations.",
    "website": "https://postman.com/careers",
    "location": "Bangalore, India (Remote-friendly)",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FF6C37%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EPM%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EPostman%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Systems Engineer - Cloud Runtime & API Mocking Services",
        "description": "Build distributed cloud execution runtimes that simulate, mock, and validate millions of API endpoints.",
        "requirement": [
          "Node.js",
          "TypeScript",
          "Docker",
          "AWS",
          "Distributed Systems",
          "HTTP/2 & gRPC"
        ],
        "salary": 2800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-6"
      },
      {
        "title": "Full Stack Engineer - API Collaboration & Workspace Experience",
        "description": "Build real-time collaborative workspace tools with live version history, branch merges, and commenting.",
        "requirement": [
          "React",
          "TypeScript",
          "Node.js",
          "WebSockets",
          "Operational Transformation / CRDT"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "2-4"
      },
      {
        "title": "Developer Relations & API Engineering Intern",
        "description": "Write public Postman collections, run live API testing workshops for university hackathons, and contribute to open-source.",
        "requirement": [
          "JavaScript / Node.js",
          "REST APIs",
          "Technical Writing",
          "Postman App",
          "Public Speaking"
        ],
        "salary": 450000,
        "location": "Bangalore, India (Remote)",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Freshworks",
    "description": "Freshworks builds modern cloud software for IT service management and customer support worldwide.",
    "website": "https://freshworks.com/careers",
    "location": "Chennai, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230B63E5%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EFW%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EFreshworks%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Full Stack Engineer - Freshdesk Omnichannel Messaging",
        "description": "Architect multi-tenant customer support software unifying WhatsApp, LiveChat, Email, and Phone tickets.",
        "requirement": [
          "Ruby on Rails",
          "React",
          "Node.js",
          "MySQL",
          "AWS SQS",
          "WebSockets"
        ],
        "salary": 850000,
        "location": "Chennai, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "1-3"
      },
      {
        "title": "Cloud DevOps Engineer - Multi-Tenant SaaS Infrastructure",
        "description": "Automate zero-downtime microservice deployments across global AWS availability zones with Terraform and ArgoCD.",
        "requirement": [
          "Terraform",
          "Kubernetes (EKS)",
          "AWS",
          "Helm",
          "ArgoCD",
          "Prometheus"
        ],
        "salary": 900000,
        "location": "Chennai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Customer Support Associate - Freshdesk Chat",
        "description": "Part-time customer assistance role handling product inquiries, debugging chat widget installations, and onboarding users.",
        "requirement": [
          "Communication Skills",
          "Basic HTML/JS Troubleshooting",
          "Patience",
          "Empathy"
        ],
        "salary": 280000,
        "location": "Chennai, India (Part-time / Remote)",
        "jobType": "Part-time",
        "position": 4,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Lenskart",
    "description": "Lenskart transforms vision care with 3D face mapping, robotic manufacturing, and smart eyewear.",
    "website": "https://lenskart.com/careers",
    "location": "Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23000042%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%2300BAC6%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3ELK%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%2300BAC6%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ELenskart%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Computer Vision Engineer - 3D Virtual Try-On AR Engine",
        "description": "Develop real-time facial landmark detection and 3D frame rendering algorithms for browser and native apps.",
        "requirement": [
          "Python",
          "C++",
          "OpenCV",
          "TensorFlow / PyTorch",
          "WebAssembly",
          "3D Computer Vision"
        ],
        "salary": 1700000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-5"
      },
      {
        "title": "Backend Engineer - Global Supply Chain & Optical Lab ERP",
        "description": "Automate manufacturing floor robotics orchestration and prescription lens verification workflows.",
        "requirement": [
          "Java",
          "Spring Boot",
          "Kafka",
          "PostgreSQL",
          "Redis",
          "Microservices"
        ],
        "salary": 1300000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Computer Vision Intern - 3D Virtual Try-On AR",
        "description": "Research 3D frame lighting reflections, pupil distance measurement, and browser WebGL shader benchmarks.",
        "requirement": [
          "Python",
          "OpenCV Basics",
          "Linear Algebra",
          "Computer Vision Fundamentals"
        ],
        "salary": 380000,
        "location": "Gurgaon, India",
        "jobType": "Internship",
        "position": 3,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Nykaa",
    "description": "Nykaa is India's leading beauty and fashion lifestyle e-commerce unicorn with thousands of brands.",
    "website": "https://nykaa.com/careers",
    "location": "Mumbai, Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FC2779%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EN%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3ENykaa%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Senior Frontend Engineer - Nykaa Man & Fashion Discovery",
        "description": "Build immersive product discovery feeds, shade finder visualizers, and interactive beauty tutorials.",
        "requirement": [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Redux",
          "Web Performance"
        ],
        "salary": 700000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "1-3"
      },
      {
        "title": "Backend Engineer - High-Concurrency Flash Sale Architecture",
        "description": "Scale high-volume coupon verification engines and payment authorization microservices for Pink Friday sales.",
        "requirement": [
          "Node.js",
          "Java",
          "MongoDB",
          "Redis",
          "Kafka",
          "AWS"
        ],
        "salary": 1400000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Beauty & Lifestyle Catalog Quality Specialist",
        "description": "Part-time editorial and catalog curator reviewing ingredient compliance, color swatches, and product descriptions.",
        "requirement": [
          "Content Quality",
          "Cosmetics / Fashion Knowledge",
          "Attention to Detail",
          "CMS Management"
        ],
        "salary": 240000,
        "location": "Mumbai, India (Flexible)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "InMobi",
    "description": "InMobi is India's first tech unicorn, providing mobile advertising platforms and consumer intelligence.",
    "website": "https://inmobi.com/company/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23E02636%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EIM%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EInMobi%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Staff Big Data Engineer - Real-Time Ad Bidding (RTB) Pipeline",
        "description": "Architect sub-10ms real-time auction bidding pipelines processing billions of bid requests every day.",
        "requirement": [
          "Java",
          "Scala",
          "Apache Flink",
          "Kafka",
          "Cassandra",
          "Aerospike"
        ],
        "salary": 3200000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-8"
      },
      {
        "title": "Machine Learning Engineer - Audience Graph & Click Prediction",
        "description": "Train click-through rate (CTR) prediction neural networks on petabyte-scale mobile telemetry data.",
        "requirement": [
          "Python",
          "PyTorch",
          "Spark",
          "Transformers",
          "Distributed Systems"
        ],
        "salary": 1800000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Ad Campaign Optimization & QA Specialist",
        "description": "Part-time digital campaign analyst monitoring ad impression anomalies, pixel firing integrity, and mobile fraud.",
        "requirement": [
          "Digital Advertising Basics",
          "Excel / SQL",
          "Analytical Thinking",
          "Attention to Detail"
        ],
        "salary": 420000,
        "location": "Bangalore, India (Flexible / Part-time)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "BrowserStack",
    "description": "BrowserStack is the leading cloud web and mobile testing platform used by millions of developers.",
    "website": "https://browserstack.com/careers",
    "location": "Mumbai, Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%230052FF%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EBS%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EBrowserStack%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Distributed Systems Engineer - Virtual Device Cloud Infrastructure",
        "description": "Scale hypervisors, real device Android/iOS farms, and automated browser sandboxes running concurrent tests.",
        "requirement": [
          "Node.js",
          "Go",
          "C++",
          "Linux Virtualization (KVM/LXC)",
          "WebSockets",
          "Docker"
        ],
        "salary": 3200000,
        "location": "Mumbai, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-7"
      },
      {
        "title": "Site Reliability Engineer - Global Selenium & Appium Grid",
        "description": "Maintain zero-latency video streaming backplanes for remote debugging sessions across 15 global data centers.",
        "requirement": [
          "Kubernetes",
          "WebRTC",
          "Linux",
          "Prometheus",
          "Golang",
          "Network Optimization"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Cloud Infrastructure Intern - Real Device Farm",
        "description": "Internship configuring automated Android ADB scripting, device battery cycling, and iOS provisioning profiles.",
        "requirement": [
          "Linux / Shell Scripting",
          "Python",
          "Android / iOS Basics",
          "Git"
        ],
        "salary": 420000,
        "location": "Mumbai, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  },
  {
    "name": "Urban Company",
    "description": "Urban Company is Asia's largest home services marketplace connecting customers with verified professionals.",
    "website": "https://urbancompany.com/careers",
    "location": "Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%231A1A1A%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23FFFFFF%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EUC%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EUrban%20Co%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Backend Architect - Partner Scheduling & Dynamic Matching",
        "description": "Design automated booking dispatch algorithms, dynamic service pricing, and fraud prevention engines.",
        "requirement": [
          "Node.js",
          "Go",
          "PostgreSQL",
          "Kafka",
          "Redis",
          "System Design"
        ],
        "salary": 1900000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "3-5"
      },
      {
        "title": "Mobile Engineer - Urban Company Partner Super-App",
        "description": "Build robust offline-capable gig partner apps for scheduling, navigation, job verification, and earnings settlement.",
        "requirement": [
          "React Native",
          "TypeScript",
          "Redux",
          "Offline-first Architecture",
          "Android SDK"
        ],
        "salary": 1300000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Partner Onboarding & Technical Operations Lead",
        "description": "Part-time operational specialist coordinating field verification, digital identity checks, and device training.",
        "requirement": [
          "Operations",
          "Hindi & English Fluency",
          "Problem Solving",
          "Basic Tech Proficiency"
        ],
        "salary": 480000,
        "location": "Gurgaon, India (Flexible)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "1-3"
      }
    ]
  },
  {
    "name": "Cars24",
    "description": "Cars24 transforms the pre-owned vehicle ecosystem with AI pricing algorithms and digital financing.",
    "website": "https://cars24.com/careers",
    "location": "Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23FF5722%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2256%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2226%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EC24%3C%2Ftext%3E%0A%20%20%20%20%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Full Stack Engineer - Instant Vehicle Inspection & Pricing AI",
        "description": "Develop computer vision vehicle inspection apps and dynamic market value estimation engines.",
        "requirement": [
          "React",
          "Node.js",
          "Python",
          "MongoDB",
          "AWS S3",
          "Tailwind CSS"
        ],
        "salary": 850000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Backend Engineer - Auction Engine & Dealer Financing Services",
        "description": "Build real-time auction bidding engines handling thousands of live bids from verified car dealers across India.",
        "requirement": [
          "Java",
          "Spring Boot",
          "WebSockets",
          "Redis",
          "MySQL",
          "Kafka"
        ],
        "salary": 750000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Automotive Digital Catalog & Quality Analyst",
        "description": "Part-time specialist verifying digital vehicle diagnostic reports, chassis photos, and warranty certificates.",
        "requirement": [
          "Automotive Knowledge",
          "Data Verification",
          "Quality Checking",
          "Attention to Detail"
        ],
        "salary": 250000,
        "location": "Gurgaon, India (Part-time)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Pine Labs",
    "description": "Pine Labs is a merchant commerce platform powering point-of-sale terminals and merchant fintech.",
    "website": "https://pinelabs.com/careers",
    "location": "Noida, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23138808%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EPL%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EPine%20Labs%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Embedded Systems & POS Engineer - Android Payment Terminal Core",
        "description": "Engineer PCI-PTS certified cryptographic payment software running on next-generation Smart POS Android terminals.",
        "requirement": [
          "Android NDK",
          "C / C++",
          "EMV Chip / Contactless",
          "Cryptographic HSM",
          "Java"
        ],
        "salary": 1400000,
        "location": "Noida, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Cloud Payments Engineer - Buy-Now-Pay-Later (BNPL) Engine",
        "description": "Scale real-time banking EMI qualification engines connecting 20+ top banks directly at checkout.",
        "requirement": [
          "Java",
          "Spring Boot",
          "Oracle / PostgreSQL",
          "Kafka",
          "REST APIs"
        ],
        "salary": 800000,
        "location": "Noida, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "1-3"
      },
      {
        "title": "Merchant Technical Helpdesk Engineer",
        "description": "Part-time support engineer helping merchants troubleshoot POS internet connectivity, thermal printers, and firmware updates.",
        "requirement": [
          "Hardware Troubleshooting",
          "Customer Support",
          "Android OS",
          "Communication"
        ],
        "salary": 380000,
        "location": "Noida, India (Flexible)",
        "jobType": "Part-time",
        "position": 3,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Delhivery",
    "description": "Delhivery is India's largest fully integrated logistics and supply chain technology provider.",
    "website": "https://delhivery.com/careers",
    "location": "Gurgaon, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%23D6001C%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3ED%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EDelhivery%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Staff Optimization Scientist - Automated Route & Load Planning",
        "description": "Formulate mixed-integer linear programs (MILP) optimizing truckload routes and aircraft freight allocations.",
        "requirement": [
          "Python",
          "Operations Research (Gurobi / OR-Tools)",
          "Algorithms",
          "C++",
          "PostGIS"
        ],
        "salary": 3000000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "4-8"
      },
      {
        "title": "Backend Engineer - Sortation Center Robotics & IoT Pipeline",
        "description": "Manage real-time telemetry streaming from automated sorters, conveyor belts, and parcel barcode scanners.",
        "requirement": [
          "Go",
          "Python",
          "MQTT / Kafka",
          "TimescaleDB",
          "Microservices"
        ],
        "salary": 750000,
        "location": "Gurgaon, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "1-3"
      },
      {
        "title": "Warehouse Hub Systems Coordinator",
        "description": "Part-time coordinator monitoring automated parcel sortation logs, reporting sensor downtime, and coordinating tech tickets.",
        "requirement": [
          "Logistics Tech",
          "System Monitoring",
          "Excel",
          "Problem Escalation"
        ],
        "salary": 260000,
        "location": "Gurgaon, India (Part-time / Shifts)",
        "jobType": "Part-time",
        "position": 4,
        "experiance": "0-2"
      }
    ]
  },
  {
    "name": "Unacademy",
    "description": "Unacademy is one of India's largest learning platforms, democratizing education with interactive live classes.",
    "website": "https://unacademy.com/careers",
    "location": "Bangalore, India",
    "logo": "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%20width%3D%22100%22%20height%3D%22100%22%3E%0A%20%20%20%20%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2222%22%20fill%3D%22%2308BD80%22%2F%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2246%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2240%22%20fill%3D%22%23ffffff%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20letter-spacing%3D%22-0.5%22%3EU%3C%2Ftext%3E%0A%20%20%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2274%25%22%20font-family%3D%22-apple-system%2C%20BlinkMacSystemFont%2C%20'Segoe%20UI'%2C%20Roboto%2C%20sans-serif%22%20font-weight%3D%22700%22%20font-size%3D%2210%22%20fill%3D%22%23ffffff%22%20opacity%3D%220.9%22%20text-anchor%3D%22middle%22%3EUnacademy%3C%2Ftext%3E%0A%20%20%3C%2Fsvg%3E",
    "jobs": [
      {
        "title": "Live Streaming Systems Engineer - Low Latency WebRTC Video",
        "description": "Optimize interactive multi-participant live classroom video feeds with interactive polls and sub-second delay.",
        "requirement": [
          "Go",
          "C++",
          "WebRTC",
          "FFmpeg",
          "HLS",
          "Redis",
          "Distributed Systems"
        ],
        "salary": 1600000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 2,
        "experiance": "2-4"
      },
      {
        "title": "Full Stack Engineer - Educator Studio & Interactive Quizzes",
        "description": "Create educator streaming dashboards, digital whiteboards, and real-time student quiz leaderboards.",
        "requirement": [
          "React",
          "TypeScript",
          "Node.js",
          "WebSockets",
          "Canvas API",
          "Tailwind CSS"
        ],
        "salary": 680000,
        "location": "Bangalore, India",
        "jobType": "Full-time",
        "position": 3,
        "experiance": "1-3"
      },
      {
        "title": "Live Video Engineering Intern - WebRTC Streaming",
        "description": "Campus internship testing browser WebRTC packet loss handling, audio echo cancellation, and chat widget latency.",
        "requirement": [
          "JavaScript / Node.js",
          "WebSockets",
          "HTML5 Video / Audio",
          "Problem Solving"
        ],
        "salary": 360000,
        "location": "Bangalore, India",
        "jobType": "Internship",
        "position": 4,
        "experiance": "0-1"
      }
    ]
  }
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
      } else {
        // Ensure logo and userId are up to date
        let needsSave = false;
        if (comp.userId.toString() === googleRecruiter._id.toString()) {
          comp.userId = otherRecruiter._id;
          needsSave = true;
        }
        if (compData.logo && comp.logo !== compData.logo) {
          comp.logo = compData.logo;
          needsSave = true;
        }
        if (needsSave) await comp.save();
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
          console.log(`🌱 [Seed] Created partner job: ${j.title} (${j.jobType})`);
        } else {
          // Ensure ownership is otherRecruiter and update jobType/salary
          if (existingJob.created_by.toString() === googleRecruiter._id.toString()) {
            existingJob.created_by = otherRecruiter._id;
          }
          existingJob.jobType = j.jobType;
          existingJob.salary = j.salary;
          existingJob.position = j.position;
          existingJob.description = j.description;
          await existingJob.save();
        }
      }
    }
    console.log("🌱 [Seed] Seeding completed successfully! Total companies:", 1 + otherCompaniesData.length);
  } catch (error) {
    console.error("⚠️ Error while seeding default data:", error.message);
  }
};
