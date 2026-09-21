import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirement: [
      {
        type: String,
      },
    ],
    salary:{
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String, // fulltime or part time
      required: true,
    },
    experiance: {
      type: String,
      required: true,
    },
    position:{
      type: Number,
      required: true,
    },
    emailAlerts: {
      type: Boolean,
      default: true,
    },
    company: {
      //company id
      type: mongoose.Schema.Types.ObjectId, // generate a relation
      ref: "Company", //it refersence to comoany model
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId, // generate a relation
      ref: "User", //it refersence to comoany model
      required: true,
    },
    application: [
      {
        type: mongoose.Schema.Types.ObjectId, // generate a relation
        ref: "Application", 
      },
    ],
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ company: 1 });
jobSchema.index({ created_by: 1 });

export const Job = mongoose.model("Job", jobSchema);
