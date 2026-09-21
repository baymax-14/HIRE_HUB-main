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
            description: "Design resilient cloud infrastructure and developer tooling for Microsoft Azure. Architect services processing petabytes of telemetry daily.",
            requirement: ["C#", ".NET", "Azure", "Distributed Systems", "SQL Server", "Microservices"],
            salary: 3100000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
          {
            title: "Security Software Engineer - Microsoft Defender",
            description: "Develop automated vulnerability scanning and real-time endpoint protection systems safeguarding enterprise cloud environments.",
            requirement: ["C++", "Python", "Cybersecurity", "Threat Intelligence", "Reverse Engineering"],
            salary: 2700000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
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
            description: "Build robust, low-latency microservices powering AWS cloud computing products used by millions of global developers.",
            requirement: ["Java", "AWS", "DynamoDB", "REST APIs", "System Design", "Docker"],
            salary: 2900000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 4,
            experiance: "2-5",
          },
          {
            title: "Frontend Engineer - Amazon Prime Video Web",
            description: "Craft responsive, blazing-fast streaming interfaces and media player components across millions of living room and web devices.",
            requirement: ["React", "TypeScript", "HTML5 Video", "Web Performance", "State Management"],
            salary: 2500000,
            location: "Chennai, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-4",
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
            description: "Lead design systems and user experience patterns across mobile and web interfaces for WhatsApp, Instagram, and Horizon.",
            requirement: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
            salary: 2400000,
            location: "Gurugram, India (Remote)",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
          {
            title: "Data Engineer - Analytics & Experimentation",
            description: "Build scalable data pipelines, data models, and metrics frameworks to support A/B testing across billions of active social accounts.",
            requirement: ["SQL", "Python", "Spark", "Airflow", "Data Warehousing", "Statistical Modeling"],
            salary: 3000000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
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
            description: "Scale resilient encoding and content delivery pipelines reaching hundreds of millions of concurrent global viewers.",
            requirement: ["Go", "Distributed Systems", "Kafka", "Redis", "Microservices", "Docker"],
            salary: 4500000,
            location: "Remote, India",
            jobType: "Full-time",
            position: 2,
            experiance: "4-8",
          },
          {
            title: "Full Stack Engineer - Studio Production Tools",
            description: "Build mission-critical web applications helping creative directors, animators, and cinematographers manage film productions.",
            requirement: ["Node.js", "React", "GraphQL", "PostgreSQL", "Cloud Native"],
            salary: 3800000,
            location: "Mumbai, India (Hybrid)",
            jobType: "Full-time",
            position: 2,
            experiance: "3-6",
          },
        ],
      },
      {
        name: "Apple",
        description: "Apple leads the world in innovation with iPhone, iPad, Mac, Apple Watch, Apple Vision Pro, and iOS.",
        website: "https://jobs.apple.com",
        location: "Hyderabad, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        jobs: [
          {
            title: "iOS Platform Engineer - Core System Frameworks",
            description: "Contribute to native iOS frameworks and system services, ensuring smooth animation frame rates and maximum power efficiency.",
            requirement: ["Swift", "Objective-C", "iOS SDK", "Instruments", "Memory Management", "Concurrency"],
            salary: 3500000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
          {
            title: "Machine Learning Scientist - Siri & Multimodal AI",
            description: "Develop on-device intelligence models for natural voice interactions, context-aware suggestions, and speech synthesis.",
            requirement: ["PyTorch", "Python", "NLP", "Speech Recognition", "CoreML"],
            salary: 4000000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-6",
          },
        ],
      },
      {
        name: "Adobe",
        description: "Adobe is changing the world through digital experiences with Photoshop, Premiere, Illustrator, and Creative Cloud.",
        website: "https://careers.adobe.com",
        location: "Noida, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Corporate_Logo.svg",
        jobs: [
          {
            title: "Senior C++ Graphics Engineer - Creative Cloud",
            description: "Work on GPU-accelerated raster and vector rendering engines powering Photoshop and Illustrator on modern web and desktop platforms.",
            requirement: ["C++", "OpenGL / Metal / Vulkan", "Shader Programming", "WebAssembly", "Data Structures"],
            salary: 3200000,
            location: "Noida, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-6",
          },
          {
            title: "Cloud Infrastructure Engineer - Firefly Generative AI",
            description: "Scale high-throughput GPU training and inference clusters serving millions of text-to-image prompts across Adobe Firefly.",
            requirement: ["Kubernetes", "Python", "Terraform", "NVIDIA Triton", "Prometheus"],
            salary: 3600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "Uber",
        description: "Uber reimagines the way the world moves for the better, connecting mobility, delivery, and freight.",
        website: "https://uber.com/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
        jobs: [
          {
            title: "Backend Engineer - Real-Time Marketplace Matching",
            description: "Build ultra-low-latency dispatch and pricing algorithms matching riders with drivers across millions of simultaneous rides.",
            requirement: ["Go", "Java", "Kafka", "Redis", "Distributed Consensus", "Cassandra"],
            salary: 3600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 4,
            experiance: "3-5",
          },
          {
            title: "Staff Data Scientist - Dynamic Pricing & ETA",
            description: "Train real-time geospatial machine learning models to predict traffic delays, driver supply dynamics, and demand surge elasticity.",
            requirement: ["Python", "Machine Learning", "Spatial Data", "Causal Inference", "SQL"],
            salary: 4400000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 1,
            experiance: "5-8",
          },
        ],
      },
      {
        name: "Spotify",
        description: "Spotify is the world's most popular audio streaming subscription service with hundreds of millions of users.",
        website: "https://lifeatspotify.com",
        location: "Mumbai / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        jobs: [
          {
            title: "Audio Recommendation Engineer - Discover Weekly",
            description: "Build collaborative filtering and acoustic vector embedding pipelines that personalize music and podcast feeds worldwide.",
            requirement: ["Python", "Java", "GCP", "Vector Databases", "ML Personalization", "BigQuery"],
            salary: 3700000,
            location: "Mumbai, India (Hybrid)",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
          {
            title: "Client Platform Engineer - Desktop & Web Player",
            description: "Maintain and optimize Spotify's web player architecture, audio codec streaming, and offline playback caching engines.",
            requirement: ["TypeScript", "React", "Web Audio API", "Service Workers", "Performance"],
            salary: 2900000,
            location: "Remote, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Airbnb",
        description: "Airbnb exists to create a world where anyone can belong anywhere, providing travel accommodations and experiences.",
        website: "https://careers.airbnb.com",
        location: "Gurugram, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
        jobs: [
          {
            title: "Full Stack Engineer - Host Hospitality & Payouts",
            description: "Develop seamless listing management, financial reconciliation, and cross-border currency conversion flows for Airbnb hosts.",
            requirement: ["Ruby on Rails", "React", "GraphQL", "MySQL", "Fintech Compliance"],
            salary: 3300000,
            location: "Gurugram, India (Hybrid)",
            jobType: "Full-time",
            position: 3,
            experiance: "3-6",
          },
          {
            title: "Security & Trust Engineer - Anti-Fraud Detection",
            description: "Build automated identity verification and risk scoring pipelines to detect fraudulent reservations and host identity theft.",
            requirement: ["Java", "Python", "Risk Scoring", "Kafka", "Graph Databases"],
            salary: 3500000,
            location: "Gurugram, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "LinkedIn",
        description: "LinkedIn connects the world's professionals to make them more productive and successful.",
        website: "https://careers.linkedin.com",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
        jobs: [
          {
            title: "Software Engineer - Economic Graph & Feed Ranking",
            description: "Optimize organic feed ranking algorithms, professional news distribution, and real-time interaction feeds.",
            requirement: ["Java", "Kafka", "Distributed Systems", "Recommendation Engines", "Rest.li"],
            salary: 3000000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-5",
          },
          {
            title: "Frontend Engineer - Talent Solutions & Recruiter Web",
            description: "Build enterprise recruiting portals and candidate sourcing dashboards utilized by corporate HR teams worldwide.",
            requirement: ["Ember.js", "React", "TypeScript", "Accessibility", "GraphQL"],
            salary: 2600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Stripe",
        description: "Stripe is a financial infrastructure platform for businesses, powering billions in transactions every year.",
        website: "https://stripe.com/jobs",
        location: "Bangalore / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        jobs: [
          {
            title: "Staff Payment Infrastructure Engineer - Core Banking",
            description: "Build nine-nines reliable ledger engines and payment settlement rails across international clearing networks.",
            requirement: ["Ruby", "Go", "Distributed Transactions", "PostgreSQL", "Raft", "Financial Ledgers"],
            salary: 4800000,
            location: "Bangalore, India (Remote)",
            jobType: "Full-time",
            position: 2,
            experiance: "5-9",
          },
          {
            title: "Developer Experience Engineer - Public APIs & SDKs",
            description: "Design developer-centric REST and GraphQL interfaces, documentation generators, and idiomatic SDKs in multiple languages.",
            requirement: ["API Design", "TypeScript", "Python", "Go", "Technical Writing"],
            salary: 3400000,
            location: "Remote, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "Atlassian",
        description: "Atlassian creates software like Jira, Confluence, and Trello that helps teams unleash their potential.",
        website: "https://atlassian.com/careers",
        location: "Bangalore / Remote",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Atlassian-Logo.svg",
        jobs: [
          {
            title: "Senior Full Stack Engineer - Jira Cloud Agility",
            description: "Build next-generation kanban boards, real-time team collaboration canvas features, and enterprise agile reporting.",
            requirement: ["React", "Node.js", "GraphQL", "AWS Lambda", "Performance Optimization"],
            salary: 3100000,
            location: "Bangalore, India (Remote)",
            jobType: "Full-time",
            position: 3,
            experiance: "3-6",
          },
          {
            title: "DevOps & Cloud Reliability Engineer - Platform Identity",
            description: "Manage global SSO, user directory sync, and zero-trust authentication fabrics for Atlassian Cloud.",
            requirement: ["Terraform", "Kubernetes", "AWS", "IAM / OAuth", "Datadog"],
            salary: 2800000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-5",
          },
        ],
      },
      {
        name: "Salesforce",
        description: "Salesforce is the world's #1 customer relationship management (CRM) platform.",
        website: "https://salesforce.com/careers",
        location: "Hyderabad, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
        jobs: [
          {
            title: "Cloud Software Engineer - Einstein 1 AI Platform",
            description: "Integrate LLM copilots, automated CRM workflows, and autonomous sales agents into enterprise customer clouds.",
            requirement: ["Java", "Python", "LLMs", "Microservices", "Spring Boot", "Kafka"],
            salary: 2900000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-5",
          },
          {
            title: "Full Stack Engineer - Lightning Web Components",
            description: "Develop enterprise-grade modular UI components using the latest web standards and accessibility guidelines.",
            requirement: ["JavaScript", "LWC", "HTML5", "CSS3", "Apex", "Jest"],
            salary: 2400000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Oracle",
        description: "Oracle offers comprehensive and fully integrated cloud applications and cloud platform services.",
        website: "https://oracle.com/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
        jobs: [
          {
            title: "Cloud Infrastructure Architect - OCI Virtualization",
            description: "Architect high-performance bare metal compute instances, NVMe storage networks, and hypervisor virtualization for OCI.",
            requirement: ["Linux Kernel", "C", "Go", "KVM", "BGP Networking", "Cloud Architecture"],
            salary: 3300000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "4-7",
          },
          {
            title: "Database Systems Engineer - Autonomous Database",
            description: "Optimize database query compilation, self-tuning indexing algorithms, and disaster replication services.",
            requirement: ["C++", "Oracle DB", "SQL", "Storage Systems", "Performance Tuning"],
            salary: 2800000,
            location: "Hyderabad, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "Cisco",
        description: "Cisco is the worldwide leader in technology that powers the Internet, networking, and cybersecurity.",
        website: "https://cisco.com/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg",
        jobs: [
          {
            title: "Network Systems Engineer - SD-WAN & Cloud Mesh",
            description: "Develop software-defined networking control planes, automated traffic steering, and zero-loss path failovers.",
            requirement: ["C++", "Python", "Networking Protocols (TCP/IP, BGP)", "SD-WAN", "Linux"],
            salary: 2600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-5",
          },
          {
            title: "Cybersecurity Analyst - Splunk Threat Intelligence",
            description: "Build anomaly detection models on massive network flow logs to uncover zero-day attacks and lateral intrusions.",
            requirement: ["Splunk", "Python", "Threat Hunting", "SIEM", "MITRE ATT&CK"],
            salary: 2200000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Flipkart",
        description: "Flipkart is India's leading digital commerce marketplace, providing access to over 150 million products.",
        website: "https://flipkartcareers.com",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/en/2/24/Flipkart_logo.svg",
        jobs: [
          {
            title: "Software Development Engineer (SDE-II) - Big Billion Days Tech",
            description: "Build checkout microservices capable of handling millions of transactions per minute during peak e-commerce sales.",
            requirement: ["Java", "Dropwizard", "HBase", "Kafka", "Redis", "Distributed Caching"],
            salary: 3200000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 4,
            experiance: "3-5",
          },
          {
            title: "Frontend Architect - Flipkart Mobile Web",
            description: "Ensure lightning fast load times on spotty network connections across Tier-2 and Tier-3 Indian cities.",
            requirement: ["React", "Next.js", "PWA", "Web Vitals", "State Management"],
            salary: 2700000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
        ],
      },
      {
        name: "Swiggy",
        description: "Swiggy is India's leading on-demand convenience platform, delivering food, groceries (Instamart), and dining.",
        website: "https://careers.swiggy.com",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
        jobs: [
          {
            title: "Backend Engineer - Instamart Quick Commerce Engine",
            description: "Optimize dark store inventory picking, delivery partner batching algorithms, and sub-10-minute order routing.",
            requirement: ["Go", "Java", "PostgreSQL", "Kafka", "Geo-Hashing", "Microservices"],
            salary: 2900000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-4",
          },
          {
            title: "Mobile App Engineer - Android Core Team",
            description: "Build battery-conscious delivery tracking animations, interactive food ordering menus, and instant UPI checkout.",
            requirement: ["Kotlin", "Jetpack Compose", "Coroutines", "Clean Architecture", "Android SDK"],
            salary: 2500000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Zomato",
        description: "Zomato connects customers, restaurant partners, and delivery partners across India and beyond.",
        website: "https://zomato.com/careers",
        location: "Gurugram, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        jobs: [
          {
            title: "Backend Engineer - Restaurant Partner Growth Platform",
            description: "Build live sales analytics, automated dynamic menu pricing, and kitchen order ticketing integrations.",
            requirement: ["PHP", "Go", "MySQL", "AWS", "Redis", "High-Concurrency"],
            salary: 2600000,
            location: "Gurugram, India",
            jobType: "Full-time",
            position: 3,
            experiance: "2-5",
          },
          {
            title: "iOS Engineer - Dining & Discovery Experience",
            description: "Craft immersive video reviews, curated food collections, and interactive restaurant booking experiences on iOS.",
            requirement: ["Swift", "SwiftUI", "Combine", "iOS Architecture", "CoreGraphics"],
            salary: 2400000,
            location: "Gurugram, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "Razorpay",
        description: "Razorpay is India's leading full-stack financial services and business banking payments platform.",
        website: "https://razorpay.com/jobs",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg",
        jobs: [
          {
            title: "Fintech Systems Engineer - UPI & Payment Gateway Core",
            description: "Scale India's most reliable payment gateway integration with 99.99% success rate across all major card networks and UPI.",
            requirement: ["Go", "PHP", "PostgreSQL", "Kafka", "PCI-DSS", "High Availability"],
            salary: 3100000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
          {
            title: "Full Stack Engineer - RazorpayX Neobanking Suite",
            description: "Build corporate credit card issuance portals, instant payroll disbursements, and automated tax filing for startups.",
            requirement: ["Node.js", "React", "TypeScript", "Microservices", "REST APIs"],
            salary: 2600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
          },
        ],
      },
      {
        name: "PhonePe",
        description: "PhonePe is India's leading digital payments app, trusted by over 500 million registered users.",
        website: "https://phonepe.com/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg",
        jobs: [
          {
            title: "Software Engineer - UPI Switching & Core Settlement",
            description: "Design fault-tolerant settlement engines communicating with NPCI payment switches processing billions of monthly transactions.",
            requirement: ["Java", "HBase", "Aerospike", "Kafka", "Low Latency", "Distributed Systems"],
            salary: 3300000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 3,
            experiance: "3-5",
          },
          {
            title: "Site Reliability Engineer - High Volume Payments",
            description: "Operate massive bare-metal and hybrid cloud server clusters maintaining absolute uptime during major festive sales.",
            requirement: ["Linux", "Kubernetes", "Ansible", "Prometheus", "Network Tuning"],
            salary: 2800000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-5",
          },
        ],
      },
      {
        name: "CRED",
        description: "CRED is a members-only club that rewards individuals for their financial trustworthiness.",
        website: "https://cred.club/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Cred_logo.png",
        jobs: [
          {
            title: "Product Engineer - High-End Aesthetic UI/UX",
            description: "Build award-winning fluid micro-interactions, neo-brutalist dark mode designs, and celebratory reward gamification.",
            requirement: ["React Native", "TypeScript", "Reanimated", "Skia", "Mobile UI Performance"],
            salary: 3400000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-5",
          },
          {
            title: "Backend Engineer - CRED Pay & Peer Lending",
            description: "Design secure peer-to-peer lending ledgers and instant merchant settlement infrastructure.",
            requirement: ["Go", "Kafka", "PostgreSQL", "Temporal.io", "Event-Driven Architecture"],
            salary: 3600000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-6",
          },
        ],
      },
      {
        name: "Zerodha",
        description: "Zerodha is India's largest discount stock broker, trusted by over 10 million active stock and commodity traders.",
        website: "https://zerodha.com/careers",
        location: "Bangalore, India",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/Zerodha_logo.svg",
        jobs: [
          {
            title: "Systems Engineer - Kite Trading Platform Core",
            description: "Build lean, zero-bloat order execution gateways handling gigabytes of real-time WebSocket market depth ticks.",
            requirement: ["Go", "PostgreSQL", "Redis", "WebSockets", "Linux", "Minimalist Architecture"],
            salary: 3500000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "3-6",
          },
          {
            title: "Frontend Engineer - Kite Web & Charts",
            description: "Optimize high-frequency financial charts, technical indicator overlays, and keyboard-first trade execution interfaces.",
            requirement: ["Vue.js / React", "HTML5 Canvas", "WebSockets", "Data Visualization", "JavaScript"],
            salary: 2800000,
            location: "Bangalore, India",
            jobType: "Full-time",
            position: 2,
            experiance: "2-4",
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
      } else {
        // Ensure logo and userId are set
        let needsSave = false;
        if (comp.userId.toString() === googleRecruiter._id.toString()) {
          comp.userId = otherRecruiter._id;
          needsSave = true;
        }
        if (!comp.logo && compData.logo) {
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
          console.log(`🌱 [Seed] Created partner job: ${j.title}`);
        } else {
          // Ensure ownership is not googleRecruiter
          if (existingJob.created_by.toString() === googleRecruiter._id.toString()) {
            existingJob.created_by = otherRecruiter._id;
            await existingJob.save();
          }
        }
      }
    }
  } catch (error) {
    console.error("⚠️ Error while seeding default data:", error.message);
  }
};
