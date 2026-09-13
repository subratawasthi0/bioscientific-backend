const { body } = require("express-validator");

const createEventValidation = [
  body("title").notEmpty().withMessage("Event title is required"),
  body("location").notEmpty().withMessage("Event location is required"),
  body("eventDate")
    .isISO8601()
    .withMessage("Valid event date is required (YYYY-MM-DD)"),
];

const updateEventValidation = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Event title cannot be empty"),
  body("eventDate")
    .optional()
    .isISO8601()
    .withMessage("Valid event date is required (YYYY-MM-DD)"),
];

module.exports = { createEventValidation, updateEventValidation };
