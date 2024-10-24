const express = require("express");
const router = express.Router();
const GigsController = require("../controllers/gigsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", GigsController.getAll);
router.get("/:id", GigsController.getById);
router.post("/", authMiddleware, GigsController.create);
router.put("/:id", authMiddleware, GigsController.update);
router.delete("/:id", authMiddleware, GigsController.delete);

module.exports = router;
