import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
         type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
    },
    aiEvaluation: {
        score: {
            type: Number,
            default: 0
        },
        verdict: {
            type: String,
            enum: ['Highly Qualified', 'Qualified', 'Partially Qualified', 'Not Qualified', 'Pending', 'No Resume'],
            default: 'Pending'
        },
        matchingSkills: [{ type: String }],
        missingSkills: [{ type: String }],
        experienceFit: { type: String, default: "" },
        strengths: [{ type: String }],
        concerns: [{ type: String }],
        summary: { type: String, default: "" },
        evaluatedAt: { type: Date }
    }
},{timestamps:true});

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application",applicationSchema);