// src/v1/common/uploads/service.js
const uploadMiddleware = require('../../../../middlewares/uploadFile');

const uploadFileToS3 = (req) => {
  return new Promise((resolve, reject) => {
    // The string 'file' here MUST match the key used by your React frontend in FormData
    uploadMiddleware.single('file')(req, {}, (err) => {
      // 1. If Multer encounters an error (like fileFilter rejecting the type)
      if (err) {
        return reject(new Error(err.message));
      }
      
      // 2. If the file was not sent or is missing
      if (!req.file) {
        return reject(new Error('No file uploaded'));
      }
      
      // 3. Success: Return the uploaded file object (which contains req.file.location)
      resolve(req.file);
    });
  });
};

module.exports = { uploadFileToS3 };