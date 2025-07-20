const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controller/auth.controller');

router.post("/login", authController.login);
router.post("/signin", auth.authenticate, auth.authorize('admin'), authController.signin);

module.exports = router;
