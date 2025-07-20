const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controller/product.controller');

router.get("/", auth.authenticate, productController.getAll);
router.get("/:id", auth.authenticate, productController.getById);
router.post("/", auth.authenticate, auth.authorize('admin'), productController.create);
router.put("/:id", auth.authenticate, auth.authorize('admin'), productController.update);
router.delete("/:id", auth.authenticate, auth.authorize('admin'), productController.delete);

module.exports = router;