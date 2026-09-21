import { Job } from "../models/jobmodel.js";
import { Company } from "../models/companymodel.js";
import { Application } from "../models/applicationmodel.js";

//admin post the job
export const postjob = async (req,res) => {
    try {
        const {title,description,requirement,salary,location,jobType,position,experiance,companyId,emailAlerts} = req.body;
        const userId = req.id;  //which user post the job

        if(!title || !description || !requirement || !salary || !location || !jobType || !position || !experiance || !companyId){
            return res.status(400).json({
                message:"Something is missing!",
                success:false
            })
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        if (company.userId.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to post a job for this company",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirement: Array.isArray(requirement) ? requirement : requirement.split(","),
            salary: Number(salary),
            location,
            jobType,
            position,
            experiance,
            company: companyId,
            created_by: userId,
            emailAlerts: emailAlerts !== undefined ? Boolean(emailAlerts) : true,
        })

        return res.status(201).json({
            message:"New job created successfully",
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

//for student
export const getAllJob = async (req,res) =>{
    try {
        const keyword = req.query.keyword || "";
        const location = req.query.location || "";
        const jobType = req.query.jobType || "";
        const salaryMin = parseInt(req.query.salaryMin) || 0;
        const salaryMax = parseInt(req.query.salaryMax) || 0;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        const query = {};

        // Keyword search on title, description, and location
        if (keyword) {
            query.$or = [
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
                {location:{$regex:keyword,$options:"i"}}
            ];
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Job type filter
        if (jobType) {
            query.jobType = { $regex: jobType, $options: "i" };
        }

        // Salary range filter
        if (salaryMin > 0 || salaryMax > 0) {
            query.salary = {};
            if (salaryMin > 0) query.salary.$gte = salaryMin;
            if (salaryMax > 0) query.salary.$lte = salaryMax;
        }

        let jobQuery = Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});

        if (limit > 0) {
            jobQuery = jobQuery.skip((page - 1) * limit).limit(limit);
        }

        const job = await jobQuery;
        const totalJobs = await Job.countDocuments(query);

        return res.status(200).json({
            job: job || [],
            totalJobs,
            currentPage: page,
            totalPages: limit > 0 ? Math.ceil(totalJobs / limit) : 1,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

// get job by id for student
export const getjobid = async(req,res) =>{
    try {
        const jobid = req.params.id;

        const job  = await Job.findById(jobid).populate({
            path:"application"
        })

         if(!job)
        {
            return res.status(404).json({
                message:"jobs not found",
                success:false
            })
        }

         return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

//now here we have

export const getAdminjob = async (req,res) =>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:'company'
        }).sort({createdAt:-1});

        if(!jobs)
        {
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

// delete job by id (admin only)
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Verify ownership
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this job",
                success: false
            });
        }

        // Delete all applications for this job
        await Application.deleteMany({ job: jobId });

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

// Recruiter toggle email alert for specific job
export const toggleJobAlerts = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to edit this job",
                success: false
            });
        }

        // Toggle state (if undefined, set to false)
        job.emailAlerts = job.emailAlerts !== undefined ? !job.emailAlerts : false;
        await job.save();

        return res.status(200).json({
            message: `Applicant email alerts ${job.emailAlerts ? "enabled" : "muted"} for this job`,
            emailAlerts: job.emailAlerts,
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
}

// update job details (recruiter only)
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const {
            title,
            description,
            requirement,
            salary,
            location,
            jobType,
            experiance,
            position,
            companyId,
            emailAlerts
        } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Verify ownership
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to update this job",
                success: false
            });
        }

        let requirementsArray = job.requirement;
        if (requirement !== undefined) {
            if (Array.isArray(requirement)) {
                requirementsArray = requirement.map(r => String(r).trim()).filter(Boolean);
            } else if (typeof requirement === "string") {
                requirementsArray = requirement.split(",").map(r => r.trim()).filter(Boolean);
            }
        }

        if (title) job.title = title;
        if (description) job.description = description;
        if (requirement !== undefined) job.requirement = requirementsArray;
        if (salary !== undefined) job.salary = Number(salary);
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (experiance !== undefined) job.experiance = experiance;
        if (position !== undefined) job.position = Number(position);
        if (companyId) job.company = companyId;
        if (emailAlerts !== undefined) job.emailAlerts = emailAlerts === true || emailAlerts === "true";

        await job.save();
        const updatedJob = await Job.findById(jobId).populate("company");

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};