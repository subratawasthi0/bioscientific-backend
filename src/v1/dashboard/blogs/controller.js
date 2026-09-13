const blogService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responsemessages"); // If you want to use centralized messages

exports.listBlogs = async (req, res) => {
  try {
    const result = await blogService.getAllBlogs();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.listPublishedBlogs = async (req, res) => {
  try {
    const result = await blogService.getPublishedBlogs();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getBlog = async (req, res) => {
  try {
    const result = await blogService.getBlogById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, "Blog not found", 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addBlog = async (req, res) => {
  try {
    const result = await blogService.createBlog(req.body);
    if (!result.success) return sendError(res, result.error, 400);
    sendSuccess(res, result.data, "Blog created successfully", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.editBlog = async (req, res) => {
  try {
    const result = await blogService.updateBlog(req.params.id, req.body);
    if (!result.success) return sendError(res, result.error, 400);
    if (!result.data) return sendError(res, "Blog not found", 404);
    sendSuccess(res, result.data, "Blog updated successfully");
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.removeBlog = async (req, res) => {
  try {
    const result = await blogService.deleteBlog(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, "Blog not found", 404);
    sendSuccess(res, null, "Blog removed successfully");
  } catch (err) {
    sendError(res, err.message);
  }
};
