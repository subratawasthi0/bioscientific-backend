const Category = require("../../../db/models/Category");
const SubCategory = require("../../../db/models/SubCategory");

const makeSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getAllCategories = async () => {
  try {
    const data = await Category.find().sort({ name: 1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createCategory = async (payload) => {
  try {
    const name = payload.name.trim();
    const slug = makeSlug(payload.slug || name);

    const existing = await Category.findOne({
      $or: [
        {
          name: {
            $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            $options: "i",
          },
        },
        { slug },
      ],
    });

    if (existing) {
      return {
        success: false,
        error: "Category name or slug already exists",
      };
    }

    const data = await Category.create({
      name,
      slug,
      isActive: payload.isActive ?? true,
    });

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateCategory = async (id, payload) => {
  try {
    const category = await Category.findById(id);

    if (!category) {
      return { success: true, data: null };
    }

    const name = payload.name?.trim() ?? category.name;
    const slug = payload.slug
      ? makeSlug(payload.slug)
      : payload.name
        ? makeSlug(name)
        : category.slug;

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      $or: [
        {
          name: {
            $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            $options: "i",
          },
        },
        { slug },
      ],
    });

    if (duplicate) {
      return {
        success: false,
        error: "Another category already uses this name or slug",
      };
    }

    if (payload.name !== undefined) category.name = name;
    if (payload.slug !== undefined || payload.name !== undefined) {
      category.slug = slug;
    }
    if (payload.isActive !== undefined) {
      category.isActive = payload.isActive;
    }

    const data = await category.save();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
};
