import multer from "multer";

const storage = multer.memoryStorage();

const uploadAny = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max — prevents demo crashes from oversized uploads
}).any();

export const singleUpload = (req, res, next) => {
  uploadAny(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      // Set req.file to 'file' or the first uploaded file for backwards compatibility
      req.file = req.files.find((f) => f.fieldname === "file") || req.files[0];
    }
    next();
  });
};