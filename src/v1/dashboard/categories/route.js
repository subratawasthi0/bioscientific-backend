const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/list", controller.listCategories);
router.post("/add", controller.addCategory);
router.put("/update/:id", controller.editCategory);

module.exports = router;
