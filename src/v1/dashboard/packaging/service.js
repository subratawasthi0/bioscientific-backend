const Packaging = require("../../../db/models/Packaging");

const getAllPackagings = async () => {
  try {
    const data = await Packaging.find().sort({ createdAt: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getPackagingById = async (id) => {
  try {
    const data = await Packaging.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createPackaging = async (data) => {
  try {
    const newPackaging = await Packaging.create(data);
    return { success: true, data: newPackaging };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deletePackaging = async (id) => {
  try {
    const deletedPackaging = await Packaging.findByIdAndDelete(id);
    return { success: true, data: deletedPackaging };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllPackagings,
  getPackagingById,
  createPackaging,
  deletePackaging,
};
