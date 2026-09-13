const { body } = require("express-validator");

const createCatalogueValidation = [
  body("title").notEmpty().withMessage("Catalogue title is required"),
];

const updateCatalogueValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Catalogue title cannot be empty"),
];

module.exports = { createCatalogueValidation, updateCatalogueValidation };
