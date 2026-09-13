// src/v1/common/uploads/controller.js
const uploadService = require("./service"); // Import the service above
const { sendSuccess, sendError } = require("../../../../utils/responseHandler");
const messages = require("../../../../utils/responsemessages");

exports.uploadFile = async (req, res) => {
  try {
    // Actually call the service
    const file = await uploadService.uploadFileToS3(req);

    // If we reach here, the upload to AWS S3 was successful!
    sendSuccess(
      res,
      {
        url: file.location, // The direct S3 public URL
        key: file.key, // The path/filename in S3 (e.g., events/12345.jpg)
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      },
      messages.UPLOAD_SUCCESS,
      201,
    );
  } catch (err) {
    // If the Service rejects (e.g., invalid file type, S3 connection error)
    sendError(res, err.message || messages.UPLOAD_FAILED, 400);
  }
};
