const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema(
  {
    pack: {
      type: String,
      required: true,
      trim: true,
    },

    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: true,
  },
);

const ProductSchema = new mongoose.Schema(
  {
    catNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    cas: {
      type: String,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    hsn: {
      type: String,
      trim: true,
    },

    primaryCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    secondaryCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    variants: {
      type: [ProductVariantSchema],
      required: true,
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "At least one product variant is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
