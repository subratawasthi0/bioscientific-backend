const User = require("../../../db/models/User");
const bcrypt = require("bcryptjs");

// Create a new user function
const createUser = async (data) => {
  try {
    const newUser = await User.create(data);
    // Exclude password from the returned object
    newUser.password = undefined;
    return { success: true, data: newUser };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

//Login user function
const loginUser = async (email, password) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // 2. Compare the provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // 3. Return user (exclude password)
    user.password = undefined;
    return { success: true, data: user };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get user by ID function
const getUserById = async (id) => {
  try {
    const data = await User.findById({ _id: id }).select("-password"); // Exclude password from result
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Update user by ID function
const updateUser = async (id, data) => {
  try {
    console.log(data, "updateData in service");
    // Using $set ensures Mongoose forcefully applies the changes
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $set: data }, 
      { new: true, runValidators: true }
    ).select('-password');
    return { success: true, data: updatedUser };
  } catch (err) { return { success: false, error: err.message }; }
};

module.exports = { createUser, loginUser, getUserById, updateUser };
