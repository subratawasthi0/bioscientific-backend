const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createBlogValidation,
  updateBlogValidation,
} = require("../../../vaidations/blogValidations");
const validateResult = require("../../../utils/validationResultHandler");

// Routes
router.get("/list", controller.listBlogs); // Dashboard: All blogs
router.get("/published", controller.listPublishedBlogs); // Public Website: Only published blogs
router.get("/:id", controller.getBlog);
router.post("/add", createBlogValidation, validateResult, controller.addBlog);
router.put(
  "/update/:id",
  updateBlogValidation,
  validateResult,
  controller.editBlog,
);
router.delete("/:id", controller.removeBlog);

module.exports = router;
