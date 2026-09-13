const { body } = require("express-validator");

const registerUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginUserValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateUserValidation = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  registerUserValidation,
  loginUserValidation,
  updateUserValidation,
};
