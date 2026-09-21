import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "application_received",  // recruiter gets this when someone applies
      "status_update",         // student gets this when status changes
      "new_job",               // student gets this when a new job is posted (future)
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for fast queries on recipient + read status
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
