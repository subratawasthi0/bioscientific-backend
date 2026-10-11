
const SubCategory = require("../../../db/models/SubCategory");
const Category = require("../../../db/models/Category");
const mongoose = require("mongoose");

const makeSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getAllSubCategories = async (categoryId) => {
  try {
    const filter = {};

    if (categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) {
        return { success: false, error: "Invalid category ID" };
      }

      filter.category = categoryId;
    }

    const data = await SubCategory.find(filter)
      .populate("category", "name slug")
      .sort({ name: 1 });

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createSubCategory = async (payload) => {
  try {
    if (!mongoose.isValidObjectId(payload.category)) {
      return { success: false, error: "Invalid category ID" };
    }

    const category = await Category.findById(payload.category);

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const name = payload.name.trim();
    const slug = makeSlug(payload.slug || name);

    const existing = await SubCategory.findOne({
      category: payload.category,
      $or: [
        { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
        { slug },
      ],
    });

    if (existing) {
      return {
        success: false,
        error: "Subcategory name or slug already exists in this category",
      };
    }

    const created = await SubCategory.create({
      name,
      slug,
      category: payload.category,
      isActive: payload.isActive ?? true,
    });

    const data = await SubCategory.findById(created._id)
      .populate("category", "name slug");

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateSubCategory = async (id, payload) => {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return { success: false, error: "Invalid subcategory ID" };
    }

    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return { success: true, data: null };
    }

    const categoryId = payload.category || subCategory.category.toString();

    if (!mongoose.isValidObjectId(categoryId)) {
      return { success: false, error: "Invalid category ID" };
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const name = payload.name?.trim() ?? subCategory.name;
    const slug = payload.slug
      ? makeSlug(payload.slug)
      : payload.name
        ? makeSlug(name)
        : subCategory.slug;

    const duplicate = await SubCategory.findOne({
      _id: { $ne: id },
      category: categoryId,
      $or: [
        { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } },
        { slug },
      ],
    });

    if (duplicate) {
      return {
        success: false,
        error: "Another subcategory uses this name or slug in this category",
      };
    }

    if (payload.name !== undefined) subCategory.name = name;
    if (payload.slug !== undefined || payload.name !== undefined) {
      subCategory.slug = slug;
    }

    subCategory.category = categoryId;

    if (payload.isActive !== undefined) {
      subCategory.isActive = payload.isActive;
    }

    await subCategory.save();

    const data = await SubCategory.findById(id)
      .populate("category", "name slug");

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
};
