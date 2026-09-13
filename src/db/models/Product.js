const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  casNumber: { type: String },
  chemicalFormula: { type: String },
  molecularWeight: { type: Number },
  purity: { type: String },
  appearance: { type: String },
  price: { type: Number },
  stockQuantity: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);