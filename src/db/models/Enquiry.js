const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },

    // Admin tracking fields
    status: {
      type: String,
      enum: ["New", "Read", "In Review", "Completed"],
      default: "New",
    },
    updatedBy: { type: String, default: "" }, // Name of the admin/sales person
  },
  { timestamps: true },
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
