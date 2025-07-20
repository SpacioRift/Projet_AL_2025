const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controller/user.controller');

router.get("/", auth.authenticate, userController.getAll);
router.get("/:id", auth.authenticate, userController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), userController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), userController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), userController.delete);

module.exports = router;
