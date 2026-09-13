const Enquiry = require("../../../db/models/Enquiry");

const getAllEnquiries = async () => {
  try {
    const data = await Enquiry.find().sort({ createdAt: -1 });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getEnquiryById = async (id) => {
  try {
    const data = await Enquiry.findById(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const createEnquiry = async (data) => {
  try {
    const newEnquiry = await Enquiry.create(data);
    return { success: true, data: newEnquiry };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const updateEnquiry = async (id, data) => {
  try {
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return { success: true, data: updatedEnquiry };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const deleteEnquiry = async (id) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    return { success: true, data: deletedEnquiry };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
