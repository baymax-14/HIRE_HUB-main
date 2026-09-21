
import { Application } from "../models/applicationmodel.js";
import { Job } from "../models/jobmodel.js";
import { User } from "../models/usermodel.js";
import { evaluateApplicantResume } from "../utils/resumeAnalyzer.js";
import { saveUploadedResume } from "../utils/fileHandler.js";
import { createNotification } from "../controller/notificationcontroller.js";
import { sendApplicationReceivedEmail, sendNewApplicantEmail, sendStatusUpdateEmail } from "../utils/emailService.js";

export const applyjob = async (req, res) => {
  try {
    const userid = req.id;
    const jobid = req.params.id;  // this get from url means konty job la applied krt aahe
    if (!jobid) {
      return res.status(400).json({
        message: "job id is required",
        success: false,
      });
    }
    //now i will check if user has already applied for a job or not
    const existingapplication = await Application.findOne({
      job: jobid,
      applicant: userid,
    });

    if (existingapplication) {
      return res.status(400).json({
        message: "You already apply for this job",
        success: false,
      });
    }

    const job = await Job.findById(jobid);
    if (!job) {
      return res.status(404).json({
        message: "Job does not exist",
        success: false,
      });
    }

    // Fetch user details for resume & skills evaluation
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // If student uploaded a new resume with the application, save it
    if (req.file) {
      const uploaded = await saveUploadedResume(req.file, req);
      if (uploaded) {
        user.profile.resume = uploaded.url;
        user.profile.resumeOriginalName = uploaded.originalName;
        await user.save();
      }
    }

    let evaluation = null;
    try {
      evaluation = await evaluateApplicantResume(user, job);
    } catch (evalError) {
      console.error("Resume evaluation error:", evalError.message);
    }

    const newapplication = await Application.create({
      job: jobid,
      applicant: userid,
      ...(evaluation ? { aiEvaluation: evaluation } : {}),
    });

    //we create a array in that
    //we store all the applicant id for that company
    job.application.push(newapplication._id);
    await job.save();

    // ── Fire-and-forget: notifications + emails ──
    const populatedJob = await Job.findById(jobid).populate("company");
    const companyName = populatedJob?.company?.name || "Unknown Company";

    // Notify recruiter (in-app)
    createNotification({
      recipient: job.created_by,
      type: "application_received",
      title: "New Applicant",
      message: `${user.fullname} applied for ${job.title}`,
      relatedJob: jobid,
      relatedApplication: newapplication._id,
    }).catch(err => console.error("Notification error:", err.message));

    // Email to student (confirmation)
    sendApplicationReceivedEmail(user, job, companyName)
      .catch(err => console.error("Application email error:", err.message));

    // Email to recruiter (alert) — respect job & recruiter email preferences
    User.findById(job.created_by).select("email profile").then(recruiter => {
      const jobAlertsEnabled = job.emailAlerts !== false;
      const recruiterAlertsEnabled = recruiter?.profile?.emailNotifications !== false;

      if (recruiter && jobAlertsEnabled && recruiterAlertsEnabled) {
        sendNewApplicantEmail(recruiter.email, user.fullname, job)
          .catch(err => console.error("Recruiter email error:", err.message));
      }
    });

    return res.status(201).json({
      message: "Job applied Successfully",
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

export const getAppliedjob = async (req, res) => {
  try {
    //ya madhe application id midte
    const userid = req.id;
    //get all the job that user or applicant applied
    const application = await Application.find({ applicant: userid })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        options: { sort: { createdAt: -1 } },
        //job model chaya aat comapany ahe tyla pn populate kara lagel
        populate: {
          path:'company',
          options: { sort: { createdAt: -1 } },
        },
      });
      //if user not applied for any job
      if(!application)
      {
        return res.status(404).json({
            message:"No application",
            success:false
        })
      }

      //if found
      return res.status(200).json({
        application,
        success:true
      })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

//now when recruter or admin who post the job it will check how many stu applied for this job
export const getApplicants = async(req,res) =>{
    try {
      //first find the job
      const jobid = req.params.id;  
      //job id vrn mahit padnar konikoni appliedkela
      const job = await Job.findById(jobid).populate({
        path:'application',
        options: { sort: { createdAt: -1 } },
        populate:{
            path:'applicant',  //application model madhe applicant pn aahe tyla on populate, phile application and in that applicant is present
            options: { sort: { createdAt: -1 } }
        }
      })  
      if(!job)
      {
        return res.status(404).json({
            message:"Job not found",
            success:false
        })
      }
      //if found
      return res.status(200).json({
        job,
        success:true
      })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false,
        });
    }
}

// now for check selected rejected 
export const updateStatus = async (req,res) => {
    try {
      const {status} = req.body;
      const applicationid = req.params.id;
      if(!status)
      {
        return res.status(400).json({
            message:"Status is required",
            success:false
        })
      }

      // Find the application and populate job to verify recruiter authorization
      const application = await Application.findOne({_id:applicationid}).populate({
        path: 'job'
      });

      if(!application)
      {
        return res.status(404).json({
            message:"Application not found",
            success:false
        })
      }

      // Verify that the logged-in user is the recruiter who created the job
      if(application.job && application.job.created_by.toString() !== req.id)
      {
        return res.status(403).json({
            message:"You are not authorized to update this application status",
            success:false
        })
      }

      // Update status
      application.status = status.toLowerCase();
      await application.save();

      // ── Fire-and-forget: notification + email to student ──
      const applicant = await User.findById(application.applicant).select("fullname email");
      const jobDetails = await Job.findById(application.job._id || application.job).populate("company");
      const companyName = jobDetails?.company?.name || "Unknown Company";

      if (applicant && jobDetails) {
        // In-app notification
        createNotification({
          recipient: application.applicant,
          type: "status_update",
          title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          message: `Your application for ${jobDetails.title} has been ${status.toLowerCase()}`,
          relatedJob: jobDetails._id,
          relatedApplication: application._id,
        }).catch(err => console.error("Notification error:", err.message));

        // Email notification
        sendStatusUpdateEmail(applicant, jobDetails, companyName, status.toLowerCase())
          .catch(err => console.error("Status email error:", err.message));
      }

      return res.status(200).json({
        message:"Status updated successfully",
        success:true
      })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false,
        });
    }
}

// Re-analyze an existing applicant's resume on-demand
export const reAnalyzeApplicant = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await Application.findById(applicationId)
      .populate("applicant")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // Verify authorization: logged in user must be either the recruiter or the applicant
    const isRecruiter = application.job && application.job.created_by?.toString() === req.id;
    const applicantId = application.applicant?._id ? application.applicant._id.toString() : application.applicant?.toString();
    const isApplicant = applicantId === req.id;

    if (!isRecruiter && !isApplicant) {
      return res.status(403).json({
        message: "You are not authorized to evaluate this applicant",
        success: false,
      });
    }

    const evaluation = await evaluateApplicantResume(application.applicant, application.job);
    application.aiEvaluation = evaluation;
    await application.save();

    return res.status(200).json({
      message: "Applicant evaluated successfully",
      aiEvaluation: evaluation,
      success: true,
    });
  } catch (error) {
    console.error("reAnalyzeApplicant error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

