const Blog = require("../../../db/models/Blog");
const slugify = require("slugify"); // You may need to run: npm install slugify

const generateSlug = (title) => slugify(title, { lower: true, strict: true });

const getAllBlogs = async () => {
  try {
    const data = await Blog.find().sort({ createdAt: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// For the public website (only shows published blogs)
const getPublishedBlogs = async () => {
  try {
    const data = await Blog.find({ status: "published" }).sort({
      publishedAt: -1,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getBlogById = async (id) => {
  try {
    const data = await Blog.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createBlog = async (data) => {
  try {
    // Auto-generate slug if not provided
    if (!data.slug) data.slug = generateSlug(data.title);
    // Set published date if status is published
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const newBlog = await Blog.create(data);
    return { success: true, data: newBlog };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateBlog = async (id, data) => {
  try {
    if (data.title) data.slug = generateSlug(data.title);
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return { success: true, data: updatedBlog };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteBlog = async (id) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    return { success: true, data: deletedBlog };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
