const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createCatalogueValidation,
  updateCatalogueValidation,
} = require("../../../vaidations/catalogueValidations");
const validateResult = require("../../../utils/validationResultHandler");

router.get("/list", controller.listCatalogues);
router.get("/:id", controller.getCatalogue);

router.post(
  "/add",
  createCatalogueValidation,
  validateResult,
  controller.addCatalogue,
);
router.put(
  "/update/:id",
  updateCatalogueValidation,
  validateResult,
  controller.editCatalogue,
);
router.delete("/:id", controller.removeCatalogue);

module.exports = router;
