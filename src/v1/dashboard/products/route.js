const express = require("express");
const router = express.Router();
const controller = require("./controller");

const {
  createProductValidation,
  updateProductValidation,
} = require("../../../vaidations/productValidations");

const validateResult = require("../../../utils/validationResultHandler");

const upload = require("../../../middlewares/uploadFile");

// List products
router.get("/list", controller.listProducts);

// Get single product
router.get("/:id", controller.getProduct);

// Create product
router.post(
  "/add",
  createProductValidation,
  validateResult,
  controller.addProduct,
);

// Update product
router.put(
  "/update/:id",
  updateProductValidation,
  validateResult,
  controller.editProduct,
);

// Delete product
router.delete("/:id", controller.deleteProduct);

// Bulk upload - keep for later
router.post("/bulk-upload", upload.single("file"), controller.bulkUpload);

module.exports = router;
