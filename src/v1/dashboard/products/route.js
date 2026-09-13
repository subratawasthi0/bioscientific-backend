const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createProductValidation,
  updateProductValidation,
} = require("../../../vaidations/productValidations");
const validateResult = require("../../../utils/validationResultHandler");
const upload = require("../../../middlewares/uploadFile");

// Routes
router.get("/list", controller.listProducts);
router.get("/:id", controller.getProduct);
router.post(
  "/add",
  createProductValidation,
  validateResult,
  controller.addProduct,
);
router.put(
  "/update/:id",
  updateProductValidation,
  validateResult,
  controller.editProduct,
);
router.delete("/:id", controller.deleteProduct);
router.post("/bulk-upload", upload.single("file"), controller.bulkUpload);

module.exports = router;
