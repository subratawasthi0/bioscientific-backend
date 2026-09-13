const { body } = require("express-validator");

const createPackagingValidation = [
  body("name").notEmpty().withMessage("Packaging name is required"),
];

module.exports = { createPackagingValidation };
