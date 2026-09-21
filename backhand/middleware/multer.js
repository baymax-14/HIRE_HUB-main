import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max — prevents demo crashes from oversized uploads
}).single("file");//file name should be same