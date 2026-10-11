
const subCategoryService = require("./service");

const {
  sendSuccess,
  sendError,
} = require("../../../utils/responseHandler");

exports.listSubCategories = async (req, res) => {
  try {
    const result = await subCategoryService.getAllSubCategories(
      req.query.categoryId
    );

    if (!result.success) {
      return sendError(res, result.error, 400);
    }

    return sendSuccess(res, result.data);
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return sendError(res, "Subcategory name is required", 400);
    }

    if (!req.body.category) {
      return sendError(res, "Category ID is required", 400);
    }

    const result = await subCategoryService.createSubCategory(req.body);

    if (!result.success) {
      return sendError(res, result.error, 400);
    }

    return sendSuccess(
      res,
      result.data,
      "Subcategory created successfully",
      201
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};

exports.editSubCategory = async (req, res) => {
  try {
    const result = await subCategoryService.updateSubCategory(
      req.params.id,
      req.body
    );

    if (!result.success) {
      return sendError(res, result.error, 400);
    }

    if (!result.data) {
      return sendError(res, "Subcategory not found", 404);
    }

    return sendSuccess(
      res,
      result.data,
      "Subcategory updated successfully"
    );
  } catch (err) {
    return sendError(res, err.message);
  }
};
