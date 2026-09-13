const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true }, // For pretty URLs like /blog/my-blog-post
    excerpt: { type: String }, // Short summary for the list page
    content: { type: String, required: true }, // Full blog HTML/Text
    coverImage: { type: String }, // URL from MinIO/S3
    category: { type: String, required: true }, // e.g., "Industry Trends", "Technical Guide"
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    author: { type: String, default: "Admin" },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", BlogSchema);
