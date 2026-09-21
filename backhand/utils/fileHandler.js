import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./cloudinary.js";
import getDaturi from "./datauri.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKHAND_ROOT = path.resolve(__dirname, "..");

/**
 * Checks if valid Cloudinary credentials have been provided
 */
export const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUD_NAME || process.env.CLOUDE_NAME;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET || process.env.SECREATE_KEY;

  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    cloudName !== "demo_cloud" &&
    cloudName !== "your_cloudinary_cloud_name" &&
    apiKey !== "1234567890" &&
    apiKey !== "your_cloudinary_api_key" &&
    apiSecret !== "your_cloudinary_api_secret" &&
    apiSecret !== "hirehub_secret_key_2026"
  );
};

/**
 * Generic file uploader:
 * 1. Attempts Cloudinary if valid credentials exist.
 * 2. Falls back to local disk storage (/uploads/<subfolder>).
 * 3. Falls back to Base64 Data URI for images if disk storage fails.
 */
export const saveUploadedFile = async (file, req, subfolder = "uploads") => {
  if (!file) return null;

  const fileuri = getDaturi(file);

  // 1. Check if valid Cloudinary credentials are provided and try uploading
  if (isCloudinaryConfigured()) {
    try {
      if (fileuri && fileuri.content) {
        const cloudResponse = await cloudinary.uploader.upload(fileuri.content, {
          resource_type: "auto",
          folder: subfolder,
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
    const uploadsDir = path.resolve(BACKHAND_ROOT, "uploads", subfolder);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, file.buffer);

    const protocol = req?.headers?.["x-forwarded-proto"] || req?.protocol || "http";
    const host = req?.get ? req.get("host") : `localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${protocol}://${host}/uploads/${subfolder}/${safeName}`;

    return {
      url: fileUrl,
      originalName: file.originalname,
      localPath: filePath,
    };
  } catch (fsErr) {
    console.warn("Local disk file save error, falling back to data URI:", fsErr.message);
  }

  // 3. Ultimate Fallback to Data URI (ensures images like logos never break)
  if (fileuri && fileuri.content) {
    return {
      url: fileuri.content,
      originalName: file.originalname,
    };
  }

  return null;
};

export const saveUploadedResume = async (file, req) => {
  return saveUploadedFile(file, req, "resumes");
};

export const saveUploadedImage = async (file, req, subfolder = "logos") => {
  return saveUploadedFile(file, req, subfolder);
};
