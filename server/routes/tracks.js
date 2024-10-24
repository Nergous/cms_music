const express = require("express");
const router = express.Router();
const TracksController = require("../controllers/tracksController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", TracksController.getAll);
router.get("/:id", TracksController.getById);
router.post("/", authMiddleware, TracksController.create);
router.delete("/:id", authMiddleware, TracksController.delete);

module.exports = router;