const fs = require("fs");
const path = require("path");
const catalogueService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responseMessages");

// Safe delete helper that doesn't crash on missing files or remote URLs
const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) return;

  try {
    const fullPath = path.join(__dirname, "../../../../", filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.error("Failed to delete old file (ignoring):", err.message);
  }
};

exports.listCatalogues = async (req, res) => {
  try {
    const result = await catalogueService.getAllCatalogues();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getCatalogue = async (req, res) => {
  try {
    const result = await catalogueService.getCatalogueById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.CATALOGUE_NOT_FOUND, 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addCatalogue = async (req, res) => {
  try {
    // Now we expect the fileUrl directly from the request body (JSON)
    const { title, description, productCategory, fileUrl } = req.body;
    if (!fileUrl) return sendError(res, "fileUrl is required", 400);

    const result = await catalogueService.createCatalogue({
      title,
      description,
      productCategory,
      fileUrl,
      fileOriginalName: fileUrl.split("/").pop(), // Extracts filename from URL
    });

    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data, messages.CATALOGUE_CREATED, 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.editCatalogue = async (req, res) => {
  try {
    const getResult = await catalogueService.getCatalogueById(req.params.id);
    if (!getResult.success) return sendError(res, getResult.error);
    if (!getResult.data) return sendError(res, messages.CATALOGUE_NOT_FOUND, 404);

    // 1. Log what came from Postman
    console.log('📩 Incoming Request Body:', req.body); 

    const updateData = { ...req.body };

    // 2. File logic
    if (req.body.fileUrl && req.body.fileUrl !== getResult.data.fileUrl) {
      deleteFileFromDisk(getResult.data.fileUrl);
      updateData.fileUrl = req.body.fileUrl;
    }

    // 3. Log what we are about to save
    console.log('💾 Updating MongoDB with data:', updateData);

    const updateResult = await catalogueService.updateCatalogue(req.params.id, updateData);
    if (!updateResult.success) return sendError(res, updateResult.error);
    
    console.log('✅ MongoDB Updated Successfully:', updateResult.data);
    
    sendSuccess(res, updateResult.data, messages.CATALOGUE_UPDATED);
  } catch (err) { sendError(res, err.message); }
};

exports.removeCatalogue = async (req, res) => {
  try {
    const getResult = await catalogueService.getCatalogueById(req.params.id);
    if (!getResult.success) return sendError(res, getResult.error);
    if (!getResult.data)
      return sendError(res, messages.CATALOGUE_NOT_FOUND, 404);

    deleteFileFromDisk(getResult.data.fileUrl);

    const deleteResult = await catalogueService.deleteCatalogue(req.params.id);
    if (!deleteResult.success) return sendError(res, deleteResult.error);
    sendSuccess(res, null, messages.CATALOGUE_REMOVED);
  } catch (err) {
    sendError(res, err.message);
  }
};
