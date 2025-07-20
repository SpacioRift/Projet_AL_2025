const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commandeController = require('../controller/commande.controller');

router.get("/", auth.authenticate, commandeController.getAll);
router.get("/:id", auth.authenticate, commandeController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), commandeController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), commandeController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), commandeController.delete);

module.exports = router;