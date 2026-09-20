const fs = require("fs");
const path = require("path");
const eventService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responseMessages");

// Safe delete helper that handles local and remote files (Crash-Proof)
const deleteFileFromDisk = (filePath) => {
  if (!filePath) return;
  
  // 1. If it's a MinIO / AWS URL (starts with http), skip it entirely.
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return; 
  }

  // 2. If it's a local path, wrap the deletion in a try...catch.
  try {
    const fullPath = path.join(__dirname, '../../../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('Deleted local file:', fullPath);
    }
  } catch (err) {
    // Log the error, but DO NOT CRASH THE SERVER
    console.error('Failed to delete old file (ignoring):', err.message);
  }
};

exports.listEvents = async (req, res) => {
  try {
    const result = await eventService.getAllEvents();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.listUpcomingEvents = async (req, res) => {
  try {
    const result = await eventService.getUpcomingEvents();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.listPastEvents = async (req, res) => {
  try {
    const result = await eventService.getPastEvents();
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.getEvent = async (req, res) => {
  try {
    const result = await eventService.getEventById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, messages.EVENT_NOT_FOUND, 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.addEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.file) eventData.imageUrl = req.file.path.replace(/\\/g, "/");

    const result = await eventService.createEvent(eventData);
    if (!result.success) return sendError(res, result.error);
    sendSuccess(res, result.data, messages.EVENT_CREATED, 201);
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);
    sendError(res, err.message);
  }
};

exports.editEvent = async (req, res) => {
  try {
    const getResult = await eventService.getEventById(req.params.id);
    if (!getResult.success) return sendError(res, getResult.error);
    if (!getResult.data) return sendError(res, messages.EVENT_NOT_FOUND, 404);

    const updateData = { ...req.body };
    if (req.file) {
      deleteFileFromDisk(getResult.data.imageUrl);
      updateData.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    const updateResult = await eventService.updateEvent(
      req.params.id,
      updateData,
    );
    if (!updateResult.success) return sendError(res, updateResult.error);
    sendSuccess(res, updateResult.data, messages.EVENT_UPDATED);
  } catch (err) {
    sendError(res, err.message);
  }
};

exports.removeEvent = async (req, res) => {
  try {
    const getResult = await eventService.getEventById(req.params.id);
    if (!getResult.success) return sendError(res, getResult.error);
    if (!getResult.data) return sendError(res, messages.EVENT_NOT_FOUND, 404);

    deleteFileFromDisk(getResult.data.imageUrl);

    const deleteResult = await eventService.deleteEvent(req.params.id);
    if (!deleteResult.success) return sendError(res, deleteResult.error);
    sendSuccess(res, null, messages.EVENT_REMOVED);
  } catch (err) {
    sendError(res, err.message);
  }
};
