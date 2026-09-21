import fs from "fs";
import path from "path";
import cloudinary from "./cloudinary.js";
import getDaturi from "./datauri.js";

/**
 * Saves an uploaded file: tries Cloudinary first if configured,
 * otherwise safely saves to the local disk under /uploads/resumes
 */
export const saveUploadedResume = async (file, req) => {
  if (!file) return null;

  // 1. Check if valid Cloudinary credentials are provided
  const hasCloudinary =
    process.env.API_SECRET &&
    process.env.CLOUD_NAME &&
    process.env.CLOUD_NAME !== "demo_cloud" &&
    process.env.API_KEY &&
    process.env.API_KEY !== "1234567890";

  if (hasCloudinary) {
    try {
      const fileuri = getDaturi(file);
      if (fileuri && fileuri.content) {
        const cloudResponse = await cloudinary.uploader.upload(fileuri.content, {
          resource_type: "auto",
        });
        if (cloudResponse?.secure_url) {
          return {
            url: cloudResponse.secure_url,
            originalName: file.originalname,
          };
        }
      }
    } catch (cloudErr) {
      console.warn("Cloudinary upload failed, falling back to local disk:", cloudErr.message);
    }
  }

  // 2. Guaranteed Local Disk Storage
  try {
    const uploadsDir = path.resolve(process.cwd(), "uploads", "resumes");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, file.buffer);

    const protocol = req?.protocol || "http";
    const host = req?.get ? req.get("host") : `localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${protocol}://${host}/uploads/resumes/${safeName}`;

    return {
      url: fileUrl,
      originalName: file.originalname,
      localPath: filePath,
    };
  } catch (fsErr) {
    console.error("Local disk file save error:", fsErr.message);
    return null;
  }
};
