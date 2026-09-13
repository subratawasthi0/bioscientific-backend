const enquiryService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responsemessages");

exports.listEnquiries = async (req, res) => {
  try {
    const result = await enquiryService.getAllEnquiries();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getEnquiry = async (req, res) => {
  try {
    const result = await enquiryService.getEnquiryById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.ENQUIRY_NOT_FOUND, 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addEnquiry = async (req, res) => {
  try {
    const result = await enquiryService.createEnquiry(req.body);
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data, messages.ENQUIRY_CREATED, 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.updatedBy) updateData.updatedBy = req.body.updatedBy;

    if (Object.keys(updateData).length === 0) {
      return sendError(res, messages.ENQUIRY_NO_FIELDS, 400);
    }

    const result = await enquiryService.updateEnquiry(
      req.params.id,
      updateData,
    );
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.ENQUIRY_NOT_FOUND, 404);
    sendSuccess(res, result.data, messages.ENQUIRY_UPDATED);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.removeEnquiry = async (req, res) => {
  try {
    const result = await enquiryService.deleteEnquiry(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.ENQUIRY_NOT_FOUND, 404);
    sendSuccess(res, null, messages.ENQUIRY_REMOVED);
  } catch (err) {
    sendError(res, err.message);
  }
};
