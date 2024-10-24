const express = require("express");
const router = express.Router();
const TracksInRecordController = require("../controllers/tracksInRecordController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", TracksInRecordController.getAll);
router.post("/", authMiddleware, TracksInRecordController.create);

module.exports = router;