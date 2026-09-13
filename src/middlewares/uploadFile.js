const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3Client } = require("../db/s3"); // Import your MinIO client
const path = require("path");

// Configure S3/MinIO storage
const storage = multerS3({
  s3: s3Client,
  bucket: process.env.MINIO_BUCKET, // Reads from your .env file (e.g. cret-bio-cloud-db)
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    // Allows dynamic folder naming from the frontend (e.g., 'catalogues', 'events', 'packaging')
    const folder = req.body.folder || "general-uploads";
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, `${folder}/${filename}`);
  },
});

// File filter to allow various types (Unchanged)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [
    ".csv",
    ".xlsx",
    ".xls",
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
  ];
  if (allowedExtensions.includes(ext)) {
    return cb(null, true);
  }
  cb(
    new Error("Invalid file type. Allowed: CSV, Excel, PDF, and Image files."),
  );
};

// 10MB size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;