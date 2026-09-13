const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createPackagingValidation,
} = require("../../../vaidations/packagingValidations");
const validateResult = require("../../../utils/validationResultHandler");

// Routes
router.get("/list", controller.listPackagings);
router.get("/:id", controller.getPackaging);
router.post(
  "/add",
  createPackagingValidation,
  validateResult,
  controller.addPackaging,
);
router.delete("/:id", controller.removePackaging);

module.exports = router;
