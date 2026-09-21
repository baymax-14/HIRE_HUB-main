import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import { Application } from "../models/applicationmodel.js";
import cloudinary from "../utils/cloudinary.js";
import getDaturi from "../utils/datauri.js";
import { saveUploadedImage } from "../utils/fileHandler.js";
//thid is company resgistered controlller after registered the company then only you can post the job
export const registerCompany = async (req,res) =>{

    try {
        const{name} = req.body;
        // if company name not come from field
        if(!name)
        {
            return res.status(400).json({
                message:"Company name is required",
                success:false
            })
        }
        //it should be unique

        let company = await Company.findOne({name})
        if(company)
        {
            return res.status(400).json({
                message:"you cant register with same company",
                success:false
            })
        }

        //return
        company = await Company.create({
            name, //....
            userId:req.id
        })

        return res.status(200).json({
            message:"Company registered successfully",
            company,
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

export const getCompany = async(req,res) =>{
    //get that company only not that user registered , not all the companies 
    try {
        const userId = req.id;  //log in user only
        const comapnies = await Company.find({userId});//find one gives only one compnya find gives all
        if(!comapnies)
        {
            return res.status(404).json({
                message:"Company not found",
                success:false
            })
        }
        return res.status(200).json({
            comapnies,
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

//get company by id
export const companybyId = async(req,res) =>{
  try {
    const companyid = req.params.id;
    const company =  await Company.findById(companyid);
    if(!company)
    {
        return res.status(404).json({
            message:"Company not found",
            success:false
        })
    }

    return res.status(200).json({
        company,//
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

export const updatecompany = async (req,res) =>{
    try {
        const {name,description,website,location} = req.body;
        const file = req.file;  //logo file

        const existingCompany = await Company.findById(req.params.id);
        if(!existingCompany)
        {
            return res.status(404).json({
                message:"Company not found",
                success:false
            })
        }

        // Verify ownership
        if(existingCompany.userId.toString() !== req.id)
        {
            return res.status(403).json({
                message:"You are not authorized to update this company",
                success:false
            })
        }

        let logo;
        if (file) {
            const uploadedLogo = await saveUploadedImage(file, req, "logos");
            if (uploadedLogo?.url) {
                logo = uploadedLogo.url;
            }
        }

        // build update object conditionally
        const updatedata = {
            name,
            description,
            website,
            location,
        };
        if (logo) {
            updatedata.logo = logo;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updatedata, {new:true})

        return res.status(200).json({
            message:"Company Information updated",
            company,
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

// delete company (admin only)
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const userId = req.id;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        // Verify ownership
        if (company.userId.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this company",
                success: false
            });
        }

        // Find all jobs by this company and delete their applications
        const companyJobs = await Job.find({ company: companyId });
        const jobIds = companyJobs.map(job => job._id);
        await Application.deleteMany({ job: { $in: jobIds } });
        await Job.deleteMany({ company: companyId });

        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company and related data deleted successfully",
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
