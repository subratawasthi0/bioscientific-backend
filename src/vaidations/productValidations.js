const { body } = require('express-validator');

const createProductValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
];

const updateProductValidation = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
];

module.exports = { createProductValidation, updateProductValidation };