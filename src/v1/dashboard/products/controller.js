const productService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responsemessages"); // Import messages

exports.listProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data, messages.PRODUCT_CREATED, 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.editProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    sendSuccess(res, result.data, messages.PRODUCT_UPDATED);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    sendSuccess(res, null, messages.PRODUCT_DELETED);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) return sendError(res, "No file uploaded", 400);
    const result = await productService.bulkUploadProducts(req.file);
    if (!result.success) return sendError(res, result.error, 400);
    sendSuccess(
      res,
      null,
      `${result.data} ${messages.BULK_UPLOAD_SUCCESS}`,
      201,
    );
  } catch (err) {
    sendError(res, err.message);
  }
};
