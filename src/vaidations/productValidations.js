const { body } = require('express-validator');

const createProductValidation = [
  body('productName').notEmpty().withMessage('Product name is required'),
  body('primaryCategory').notEmpty().withMessage('Category is required'),
];

const updateProductValidation = [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
];

module.exports = { createProductValidation, updateProductValidation };