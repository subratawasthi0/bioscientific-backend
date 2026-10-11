const productService = require("./service");

const { sendSuccess, sendError } = require("../../../utils/responseHandler");

const messages = require("../../../utils/responseMessages");

// ==========================================
// LIST PRODUCTS
// ==========================================

exports.listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const result = await productService.getAllProducts(page, limit);

    if (!result.success) {
      return sendError(res, result.error);
    }

    return sendSuccess(res, {
      products: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    return sendError(res, err.message);
  }
};


// ==========================================
// GET PRODUCT BY ID
// ==========================================

exports.getProduct = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);

    if (!result.success) {
      return sendError(res, result.error);
    }

    if (!result.data) {
      return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    }

    return sendSuccess(res, result.data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================

exports.addProduct = async (req, res) => {
  try {
    const result = await productService.createProduct(req.body);

    if (!result.success) {
      return sendError(res, result.error);
    }

    return sendSuccess(res, result.data, messages.PRODUCT_CREATED, 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

exports.editProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);

    if (!result.success) {
      return sendError(res, result.error);
    }

    if (!result.data) {
      return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    }

    return sendSuccess(res, result.data, messages.PRODUCT_UPDATED);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);

    if (!result.success) {
      return sendError(res, result.error);
    }

    if (!result.data) {
      return sendError(res, messages.PRODUCT_NOT_FOUND, 404);
    }

    return sendSuccess(res, null, messages.PRODUCT_DELETED);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// ==========================================
// BULK UPLOAD
// ==========================================

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", 400);
    }

    const result = await productService.bulkUploadProducts(req.file);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
        details: result.data || null,
      });
    }

    return sendSuccess(res, result.data, messages.BULK_UPLOAD_SUCCESS, 201);
  } catch (err) {
    console.error("Bulk upload controller error:", err);
    return sendError(res, err.message);
  }
};
