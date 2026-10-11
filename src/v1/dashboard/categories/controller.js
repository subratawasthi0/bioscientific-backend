const categoryService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");

exports.listCategories = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();

    if (!result.success) {
      return sendError(res, result.error);
    }

    return sendSuccess(res, result.data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.addCategory = async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return sendError(res, "Category name is required", 400);
    }

    const result = await categoryService.createCategory(req.body);

    if (!result.success) {
      return sendError(res, result.error, 400);
    }

    return sendSuccess(res, result.data, "Category created successfully", 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );

    if (!result.success) {
      return sendError(res, result.error, 400);
    }

    if (!result.data) {
      return sendError(res, "Category not found", 404);
    }

    return sendSuccess(res, result.data, "Category updated successfully");
  } catch (err) {
    return sendError(res, err.message);
  }
};
