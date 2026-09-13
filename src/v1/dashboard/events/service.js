const Event = require("../../../db/models/Event");

// 1. List All
const getAllEvents = async () => {
  try {
    const data = await Event.find().sort({ eventDate: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// 2. List Upcoming (Today and into the future)
const getUpcomingEvents = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const data = await Event.find({ eventDate: { $gte: today } }).sort({
      eventDate: 1,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// 3. List Past Events (Already happened)
const getPastEvents = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const data = await Event.find({ eventDate: { $lt: today } }).sort({
      eventDate: -1,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// 4. Get by ID
const getEventById = async (id) => {
  try {
    const data = await Event.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// 5. Add, Edit, Remove
const createEvent = async (data) => {
  try {
    const newEvent = await Event.create(data);
    return { success: true, data: newEvent };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateEvent = async (id, data) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return { success: true, data: updatedEvent };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteEvent = async (id) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    return { success: true, data: deletedEvent };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
