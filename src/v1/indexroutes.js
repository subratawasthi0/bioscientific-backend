const express = require("express");
const router = express.Router();
const productRoutes = require("./dashboard/products/route");
const packagingRoutes = require("./dashboard/packaging/route");
const catalogueRoutes = require("./dashboard/catalogue/route");
const eventRoutes = require("./dashboard/events/route");
const enquiryRoutes = require("./dashboard/enquires/route");
const uploadRoutes = require("./dashboard/common/uploads/route");
const userRoutes = require("./dashboard/users/route");
const blogRoutes = require("./dashboard/blogs/route");

router.use("/dashboard/products", productRoutes);
router.use("/dashboard/packagings", packagingRoutes);
router.use("/dashboard/catalogues", catalogueRoutes);
router.use("/dashboard/events", eventRoutes);
router.use("/dashboard/enquiries", enquiryRoutes);
router.use("/dashboard/common", uploadRoutes);
router.use("/dashboard/users", userRoutes);
router.use("/dashboard/blogs", blogRoutes);


module.exports = router;
