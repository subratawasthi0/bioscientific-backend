const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createEnquiryValidation,
  updateEnquiryValidation,
} = require("../../../vaidations/enquiryVaidations");
const validateResult = require("../../../utils/validationResultHandler");

// Routes
router.get("/list", controller.listEnquiries);
router.get("/:id", controller.getEnquiry);
router.post(
  "/",
  createEnquiryValidation,
  validateResult,
  controller.addEnquiry,
);
router.put(
  "/:id",
  updateEnquiryValidation,
  validateResult,
  controller.updateEnquiry,
);
router.delete("/:id", controller.removeEnquiry);

module.exports = router;
