const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const statController = require("../controller/stat.controller")

router.get("/", auth.authenticate, statController.getAll)
router.get("/summary", auth.authenticate, statController.getSummary)
router.get("/entries-exits", auth.authenticate, statController.getEntriesExits)
router.get("/top-products", auth.authenticate, statController.getTopProducts)
router.get("/sales-evolution", auth.authenticate, statController.getSalesEvolution)
router.get("/:id", auth.authenticate, statController.getById)
router.post("/", auth.authenticate, auth.authorize("admin"), statController.create)
router.put("/:id", auth.authenticate, auth.authorize("admin"), statController.update)
router.delete("/:id", auth.authenticate, auth.authorize("admin"), statController.delete)

module.exports = router
