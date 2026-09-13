const { body } = require("express-validator");

const createBlogValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("category").notEmpty().withMessage("Category is required"),
];

const updateBlogValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status value"),
];

module.exports = { createBlogValidation, updateBlogValidation };
