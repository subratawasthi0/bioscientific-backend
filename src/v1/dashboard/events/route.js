const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  createEventValidation,
  updateEventValidation,
} = require("../../../vaidations/eventValidations");
const validateResult = require("../../../utils/validationResultHandler");
const upload = require("../../../middlewares/uploadFile");

// Routes
router.get("/list", controller.listEvents);
router.get("/upcoming", controller.listUpcomingEvents);
router.get("/past", controller.listPastEvents);
router.get("/:id", controller.getEvent);

// Use 'eventImage' as the field name for uploads
router.post(
  "/add",
  upload.single("eventImage"),
  createEventValidation,
  validateResult,
  controller.addEvent,
);
router.put(
  "/:id",
  upload.single("eventImage"),
  updateEventValidation,
  validateResult,
  controller.editEvent,
);
router.delete("/:id", controller.removeEvent);

module.exports = router;
