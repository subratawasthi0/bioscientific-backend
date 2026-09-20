const userService = require("./service");
const { sendSuccess, sendError } = require("../../../utils/responseHandler");
const messages = require("../../../utils/responseMessages");
const jwt = require("jsonwebtoken");

const registerAdmin = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (!result.success) return sendError(res, result.error, 400);
    sendSuccess(res, result.data, "Admin registered successfully", 201);
  } catch (err) {
    sendError(res, err.message);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);

    if (!result.success) return sendError(res, result.error, 401);

    // Generate a JWT Token
    const token = jwt.sign(
      { id: result.data._id, email: result.data.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
    );

    sendSuccess(
      res,
      {
        user: result.data,
        token: token,
      },
      "Login successful",
    );
  } catch (err) {
    sendError(res, err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    if (!result.success) return sendError(res, result.error);
    if (!result.data) return sendError(res, "User not found", 404);
    sendSuccess(res, result.data);
  } catch (err) {
    sendError(res, err.message);
  }
};

const editUser = async (req, res) => {
  try {
    // 1. Explicitly pick which fields we allow to be updated
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.password) updateData.password = req.body.password;

    // 2. Ensure there's actually something to update
    if (Object.keys(updateData).length === 0) {
      return sendError(res, 'No valid fields to update', 400);
    }

    // 3. Perform the update explicitly using $set
    const result = await userService.updateUser(req.params.id, updateData);
    
    if (!result.success) return sendError(res, result.error, 400);
    if (!result.data) return sendError(res, 'User not found', 404);
    
    sendSuccess(res, result.data, 'User updated successfully');
  } catch (err) {
    sendError(res, err.message);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getUser,
  editUser,
};
