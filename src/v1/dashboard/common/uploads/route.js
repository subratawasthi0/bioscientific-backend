const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Generic file upload route
router.post('/upload', controller.uploadFile);

module.exports = router;