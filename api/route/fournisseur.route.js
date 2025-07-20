const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const fournisseurController = require('../controller/fournisseur.controller');

router.get("/", auth.authenticate, fournisseurController.getAll);
router.get("/:id", auth.authenticate, fournisseurController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), fournisseurController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), fournisseurController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), fournisseurController.delete);

module.exports = router;
