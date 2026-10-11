const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/list", controller.listSubCategories);
router.post("/add", controller.addSubCategory);
router.put("/update/:id", controller.editSubCategory);

module.exports = router;
