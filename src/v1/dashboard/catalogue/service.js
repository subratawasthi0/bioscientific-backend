const Catalogue = require("../../../db/models/Catalogue");

const getAllCatalogues = async () => {
  try {
    const data = await Catalogue.find().sort({ createdAt: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getCatalogueById = async (id) => {
  try {
    const data = await Catalogue.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createCatalogue = async (data) => {
  try {
    const newCatalogue = await Catalogue.create(data);
    return { success: true, data: newCatalogue };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateCatalogue = async (id, data) => {
  try {
    const updatedCatalogue = await Catalogue.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return { success: true, data: updatedCatalogue };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteCatalogue = async (id) => {
  try {
    const deletedCatalogue = await Catalogue.findByIdAndDelete(id);
    return { success: true, data: deletedCatalogue };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllCatalogues,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
};
