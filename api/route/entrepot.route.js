const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const entrepotController = require('../controller/entrepot.controller');

router.get("/", auth.authenticate, entrepotController.getAll);
router.get("/:id", auth.authenticate, entrepotController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), entrepotController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), entrepotController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), entrepotController.delete);

module.exports = router;