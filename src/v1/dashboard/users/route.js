const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  registerUserValidation,
  loginUserValidation,
  updateUserValidation,
} = require("../../../vaidations/userValidations");
const validateResult = require("../../../utils/validationResultHandler");

// Register a new admin user
router.post(
  "/register",
  registerUserValidation,
  validateResult,
  controller.registerAdmin,
);

// User login route
router.post(
  "/login",
  loginUserValidation,
  validateResult,
  controller.loginAdmin,
);

// Get user by ID
router.get("/:id", controller.getUser);

// Update user by ID
router.put("/update/:id", updateUserValidation, validateResult, controller.editUser);

module.exports = router;
