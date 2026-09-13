const packagingService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responsemessages");

exports.listPackagings = async (req, res) => {
  try {
    const result = await packagingService.getAllPackagings();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getPackaging = async (req, res) => {
  try {
    const result = await packagingService.getPackagingById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.PACKAGING_NOT_FOUND, 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addPackaging = async (req, res) => {
  try {
    const result = await packagingService.createPackaging(req.body);
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data, messages.PACKAGING_CREATED, 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.removePackaging = async (req, res) => {
  try {
    const result = await packagingService.deletePackaging(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.PACKAGING_NOT_FOUND, 404);
    sendSuccess(res, null, messages.PACKAGING_REMOVED);
  } catch (err) {
    sendError(res, err.message);
  }
};
