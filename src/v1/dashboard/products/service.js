const Product = require("../../../db/models/Product");

const Category = require("../../../db/models/Category");

const SubCategory = require("../../../db/models/SubCategory");

const csv = require("csv-parser");

const xlsx = require("xlsx");
const mongoose = require("mongoose");

const fs = require("fs");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../../../db/s3");
const { Readable } = require("stream");
const path = require("path");

// ==========================================
// LIST ALL PRODUCTS
// ==========================================

const getAllProducts = async (
  page,
  limit,
  search = "",
  categoryId = "",
  subCategoryId = ""
) => {
  try {
    // Do not reassign the incoming parameters
    const currentPage = Math.max(1, Number(page) || 1);
    const pageLimit = Math.max(1, Math.min(100, Number(limit) || 50));
    const skip = (currentPage - 1) * pageLimit;

    const searchText = String(search || "").trim();

    // Escape regex special characters so search is treated literally
    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchFilter = escapedSearch
      ? {
          $or: [
            { productName: { $regex: escapedSearch, $options: "i" } },
            { catNo: { $regex: escapedSearch, $options: "i" } },
            { cas: { $regex: escapedSearch, $options: "i" } },
            { hsn: { $regex: escapedSearch, $options: "i" } },
          ],
        }
      : {};

      // Combine search, category, and subcategory filters
const productFilter = { ...searchFilter };

if (categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return {
      success: false,
      error: "Invalid category ID",
    };
  }

  productFilter.primaryCategory =
    new mongoose.Types.ObjectId(categoryId);
}

if (subCategoryId) {
  if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
    return {
      success: false,
      error: "Invalid subcategory ID",
    };
  }

  productFilter.secondaryCategory =
    new mongoose.Types.ObjectId(subCategoryId);
}
    // Count only matching products, across the entire collection
   const totalProducts =
  await Product.countDocuments(productFilter);

    const products = await Product.aggregate([
      // Search BEFORE sorting and pagination
      { $match: productFilter },

      // Convert CB001, CB002... into numbers for correct sorting
      {
        $addFields: {
          catNoNumber: {
            $convert: {
              input: {
                $arrayElemAt: [
                  {
                    $split: [{ $ifNull: ["$catNo", ""] }, "CB"],
                  },
                  1,
                ],
              },
              to: "int",
              onError: 999999999,
              onNull: 999999999,
            },
          },
        },
      },

      { $sort: { catNoNumber: 1, _id: 1 } },

      // Paginate the matching results
      { $skip: skip },
      { $limit: pageLimit },

      // Populate primary category
      {
        $lookup: {
          from: "categories",
          localField: "primaryCategory",
          foreignField: "_id",
          as: "primaryCategoryData",
        },
      },
      {
        $unwind: {
          path: "$primaryCategoryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Populate secondary category
      {
        $lookup: {
          from: "subcategories",
          localField: "secondaryCategory",
          foreignField: "_id",
          as: "secondaryCategoryData",
        },
      },
      {
        $unwind: {
          path: "$secondaryCategoryData",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Return category and subcategory name and slug
      {
        $addFields: {
          primaryCategory: {
            $cond: [
              { $ne: ["$primaryCategoryData", null] },
              {
                _id: "$primaryCategoryData._id",
                name: "$primaryCategoryData.name",
                slug: "$primaryCategoryData.slug",
              },
              null,
            ],
          },
          secondaryCategory: {
            $cond: [
              { $ne: ["$secondaryCategoryData", null] },
              {
                _id: "$secondaryCategoryData._id",
                name: "$secondaryCategoryData.name",
                slug: "$secondaryCategoryData.slug",
              },
              null,
            ],
          },
        },
      },

      // Remove temporary fields
      {
        $project: {
          catNoNumber: 0,
          primaryCategoryData: 0,
          secondaryCategoryData: 0,
        },
      },
    ]);

    return {
      success: true,
      data: products,
      pagination: {
        currentPage,
        limit: pageLimit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / pageLimit),
      },
    };
  } catch (err) {
    console.error("getAllProducts error:", err);

    return {
      success: false,
      message: err.message,
    };
  }
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================

const getProductById = async (id) => {
  try {
    const data = await Product.findById(id)
      .populate({
        path: "primaryCategory",
        select: "name slug",
      })
      .populate({
        path: "secondaryCategory",
        select: "name slug category",
      });

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (data) => {
  try {
    // --------------------------------------
    // Check duplicate Cat No
    // --------------------------------------

    const existingProduct = await Product.findOne({
      catNo: data.catNo,
    });

    if (existingProduct) {
      return {
        success: false,
        error: `Product with Cat No "${data.catNo}" already exists`,
      };
    }

    // --------------------------------------
    // Validate category
    // --------------------------------------

    const category = await Category.findById(data.primaryCategory);

    if (!category) {
      return {
        success: false,
        error: "Primary category not found",
      };
    }

    // --------------------------------------
    // Validate subcategory
    // --------------------------------------

    const subCategory = await SubCategory.findOne({
      _id: data.secondaryCategory,
      category: data.primaryCategory,
    });

    console.log(category, subCategory, "---------cat sub cat ");
    if (!subCategory) {
      return {
        success: false,
        error:
          "Secondary category does not belong to the selected primary category",
      };
    }

    // --------------------------------------
    // Create product
    // --------------------------------------

    const newProduct = await Product.create(data);

    // --------------------------------------
    // Populate response
    // --------------------------------------

    const populatedProduct = await Product.findById(newProduct._id)
      .populate({
        path: "primaryCategory",
        select: "name slug",
      })
      .populate({
        path: "secondaryCategory",
        select: "name slug category",
      });

    return {
      success: true,
      data: populatedProduct,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (id, data) => {
  try {
    // --------------------------------------
    // Find existing product
    // --------------------------------------

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return {
        success: true,
        data: null,
      };
    }

    // --------------------------------------
    // Check Cat No duplication
    // --------------------------------------

    if (data.catNo) {
      const duplicateProduct = await Product.findOne({
        catNo: data.catNo,
        _id: {
          $ne: id,
        },
      });

      if (duplicateProduct) {
        return {
          success: false,
          error: `Product with Cat No "${data.catNo}" already exists`,
        };
      }
    }

    // --------------------------------------
    // Validate category if provided
    // --------------------------------------

    const primaryCategory =
      data.primaryCategory || existingProduct.primaryCategory;

    const secondaryCategory =
      data.secondaryCategory || existingProduct.secondaryCategory;

    const category = await Category.findById(primaryCategory);

    if (!category) {
      return {
        success: false,
        error: "Primary category not found",
      };
    }

    // --------------------------------------
    // Validate subcategory
    // --------------------------------------

    const subCategory = await SubCategory.findOne({
      _id: secondaryCategory,
      category: primaryCategory,
    });

    if (!subCategory) {
      return {
        success: false,
        error:
          "Secondary category does not belong to the selected primary category",
      };
    }

    // --------------------------------------
    // Update
    // --------------------------------------

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "primaryCategory",
        select: "name slug",
      })
      .populate({
        path: "secondaryCategory",
        select: "name slug category",
      });

    return {
      success: true,
      data: updatedProduct,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    return {
      success: true,
      data: deletedProduct,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

// ==========================================
// BULK UPLOAD
// ==========================================

const bulkUploadProducts = async (file) => {
  try {
    // 1. Validate uploaded file
    if (!file?.bucket || !file?.key) {
      return {
        success: false,
        error: "Uploaded file not found in cloud storage",
      };
    }

    const ext = path.extname(file.originalname).toLowerCase();

    if (![".csv", ".xlsx", ".xls"].includes(ext)) {
      return {
        success: false,
        error: "Only .csv, .xlsx, and .xls files are allowed",
      };
    }

    // 2. Download file from MinIO
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: file.bucket,
        Key: file.key,
      }),
    );

    if (!response.Body) {
      throw new Error("Could not read file from cloud storage");
    }

    const chunks = [];

    for await (const chunk of response.Body) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    // 3. Parse CSV or Excel
    let rows = [];

    if (ext === ".csv") {
      rows = await new Promise((resolve, reject) => {
        const data = [];

        Readable.from(buffer)
          .pipe(csv())
          .on("data", (row) => data.push(row))
          .on("end", () => resolve(data))
          .on("error", reject);
      });
    } else {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      if (!firstSheet) {
        throw new Error("Excel file does not contain a worksheet");
      }

      rows = xlsx.utils.sheet_to_json(firstSheet, {
        defval: "",
      });
    }

    if (!rows.length) {
      return {
        success: false,
        error: "File is empty or malformed",
      };
    }

    // 4. Normalize headers
    rows = rows.map((row) => {
      const normalized = {};

      for (const [key, value] of Object.entries(row)) {
        normalized[key.trim().toLowerCase()] = value;
      }

      return normalized;
    });

    const errors = [];
    const products = [];
    const categoryCache = new Map();
    const subCategoryCache = new Map();
    const productCodes = new Set();

    // Add a detailed validation error
    const addError = (row, rowNumber, field, value, reason) => {
      errors.push({
        row: rowNumber,
        catNo: String(row["cat no"] ?? "").trim(),
        field,
        value: String(value ?? ""),
        reason,
      });
    };

    // Escape special regex characters
    const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // 5. Validate each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      const catNo = String(row["cat no"] ?? "").trim();
      const cas = String(row["cas"] ?? "").trim();
      const productName = String(row["product name"] ?? "").trim();
      const hsn = String(row["hsn"] ?? "").trim();
      const categoryName = String(row["category"] ?? "").trim();
      const subCategoryName = String(
        row["sub category"] ?? row["subcategory"] ?? "",
      ).trim();

      const packSizes = String(row["pack sizes"] ?? "")
        .split("|")
        .map((pack) => pack.trim())
        .filter(Boolean);

      let rowHasError = false;

      // Required field validation
      const requiredFields = [
        ["Cat No", catNo],
        ["Product Name", productName],
        ["Category", categoryName],
        ["Sub Category", subCategoryName],
        ["Pack Sizes", packSizes.join(" | ")],
      ];

      for (const [field, value] of requiredFields) {
        if (!value) {
          addError(row, rowNumber, field, value, `${field} is required`);
          rowHasError = true;
        }
      }

      // Check duplicate Cat No inside the uploaded file
      if (catNo) {
        const codeKey = catNo.toLowerCase();

        if (productCodes.has(codeKey)) {
          addError(
            row,
            rowNumber,
            "Cat No",
            catNo,
            "Duplicate Cat No found in the uploaded file",
          );
          rowHasError = true;
        } else {
          productCodes.add(codeKey);
        }
      }

      // Do not process rows missing required values
      if (rowHasError) {
        continue;
      }

      // 6. Find category
      const categoryKey = categoryName.toLowerCase();
      let categoryId = categoryCache.get(categoryKey);

      if (!categoryId) {
        const category = await Category.findOne({
          name: {
            $regex: `^${escapeRegex(categoryName)}$`,
            $options: "i",
          },
        }).select("_id");

        if (!category) {
          addError(
            row,
            rowNumber,
            "Category",
            categoryName,
            `Category "${categoryName}" does not exist`,
          );
          continue;
        }

        categoryId = category._id;
        categoryCache.set(categoryKey, categoryId);
      }

      // 7. Find subcategory under the selected category
      const subKey = `${String(categoryId)}:${subCategoryName.toLowerCase()}`;

      let subCategoryId = subCategoryCache.get(subKey);

      if (!subCategoryId) {
        const subCategory = await SubCategory.findOne({
          name: {
            $regex: `^${escapeRegex(subCategoryName)}$`,
            $options: "i",
          },
          category: categoryId,
        }).select("_id");

        if (!subCategory) {
          addError(
            row,
            rowNumber,
            "Sub Category",
            subCategoryName,
            `Subcategory "${subCategoryName}" does not exist under category "${categoryName}"`,
          );
          continue;
        }

        subCategoryId = subCategory._id;
        subCategoryCache.set(subKey, subCategoryId);
      }

      // 8. Build product object
      products.push({
        catNo,
        cas,
        productName,
        hsn,
        primaryCategory: categoryId,
        secondaryCategory: subCategoryId,
        variants: packSizes.map((pack) => ({
          pack,
          oldPrice: 0,
          price: 0,
        })),
      });
    }

    // 9. Return detailed errors without inserting anything
    if (errors.length > 0) {
      return {
        success: false,
        error: "Some rows have invalid data. No products were inserted.",
        data: {
          totalRows: rows.length,
          validRows: products.length,
          invalidRows: new Set(errors.map((e) => e.row)).size,
          errors,
        },
      };
    }

    // 10. Check Cat No values against existing database records
    const catNos = products.map((product) => product.catNo);

    const existingProducts = await Product.find({
      catNo: { $in: catNos },
    }).select("catNo");

    if (existingProducts.length > 0) {
      const existingCodes = new Set(
        existingProducts.map((product) => product.catNo.toLowerCase()),
      );

      const duplicateErrors = products
        .map((product, index) => ({
          product,
          row: index + 2,
        }))
        .filter(({ product }) => existingCodes.has(product.catNo.toLowerCase()))
        .map(({ product, row }) => ({
          row,
          catNo: product.catNo,
          field: "Cat No",
          value: product.catNo,
          reason: "This Cat No already exists in the database",
        }));

      return {
        success: false,
        error: "Duplicate product codes found. No products were inserted.",
        data: {
          totalRows: rows.length,
          invalidRows: duplicateErrors.length,
          errors: duplicateErrors,
        },
      };
    }

    // 11. Insert all products
    await Product.insertMany(products, { ordered: true });

    return {
      success: true,
      data: {
        totalRows: rows.length,
        insertedCount: products.length,
      },
    };
  } catch (err) {
    console.error("Bulk upload error:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
};
