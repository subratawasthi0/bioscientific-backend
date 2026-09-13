const { body } = require("express-validator");

const createEnquiryValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

const updateEnquiryValidation = [
  body("status")
    .optional()
    .isIn(["New", "Read", "In Review", "Completed"])
    .withMessage("Invalid status value"),
  body("updatedBy")
    .optional()
    .notEmpty()
    .withMessage("Updated by cannot be empty"),
];

module.exports = { createEnquiryValidation, updateEnquiryValidation };
