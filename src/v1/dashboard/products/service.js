const Product = require("../../../db/models/Product");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

const getAllProducts = async () => {
  try {
    const data = await Product.find().sort({ createdAt: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getProductById = async (id) => {
  try {
    const data = await Product.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createProduct = async (data) => {
  try {
    const newProduct = await Product.create(data);
    return { success: true, data: newProduct };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateProduct = async (id, data) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return { success: true, data: updatedProduct };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return { success: true, data: deletedProduct };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const bulkUploadProducts = async (file) => {
  try {
    const filePath = file.path;
    const ext = file.originalname.split(".").pop().toLowerCase();
    let products = [];

    if (ext === "csv") {
      const readStream = fs.createReadStream(filePath).pipe(csv());
      for await (const row of readStream) products.push(row);
    } else if (ext === "xlsx" || ext === "xls") {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      products = xlsx.utils.sheet_to_json(sheet);
    } else {
      fs.unlinkSync(filePath);
      return {
        success: false,
        error: "Only .csv, .xlsx, .xls files are allowed",
      };
    }

    // Clean up temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!products || products.length === 0) {
      return { success: false, error: "File is empty or malformed" };
    }

    await Product.insertMany(products);
    return { success: true, data: products.length };
  } catch (err) {
    // Attempt to clean up temp file if an error occurred
    if (file && file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUploadProducts,
};
