const mongoose = require("mongoose");

const PackagingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String }, // e.g., "Plastic Drum", "Glass Bottle", "Jerrycan"
    description: { type: String },
    capacity: { type: String }, // e.g., "200L", "5kg"
    material: { type: String }, // e.g., "HDPE", "Stainless Steel"
    imageUrl: { type: String }, // URL to the packaging image
  },
  { timestamps: true },
);

module.exports = mongoose.model("Packaging", PackagingSchema);
