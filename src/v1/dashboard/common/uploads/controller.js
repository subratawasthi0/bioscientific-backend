// src/v1/common/uploads/controller.js
const uploadService = require("./service"); // Import the service above
const { sendSuccess, sendError } = require("../../../../utils/responseHandler");
const messages = require("../../../../utils/responseMessages");

exports.uploadFile = async (req, res) => {
  try {
    const file = await uploadService.uploadFileToS3(req);

    const publicBaseUrl = (
      process.env.MINIO_PUBLIC_URL || "https://crestbioscientific.com"
    ).replace(/\/+$/, "");

    const bucket = process.env.MINIO_BUCKET;
    const key = file.key;

    sendSuccess(
      res,
      {
        url: `${publicBaseUrl}/${bucket}/${key}`,
        key: key,
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
