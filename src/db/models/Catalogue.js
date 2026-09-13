const mongoose = require("mongoose");

const CatalogueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    productCategory: { type: String }, // Optional: e.g., "Solvents", "Lab Chemicals"

    // PDF Metadata
    fileUrl: { type: String, required: true },
    fileOriginalName: { type: String },
    fileSize: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Catalogue", CatalogueSchema);
