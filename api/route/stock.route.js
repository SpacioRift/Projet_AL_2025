const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stockController = require('../controller/stock.controller');

router.get("/", auth.authenticate, stockController.getAll);
router.get("/:id", auth.authenticate, stockController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), stockController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), stockController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), stockController.delete);
router.get("/critical", auth.authenticate, stockController.getCriticalStocks);

module.exports = router;