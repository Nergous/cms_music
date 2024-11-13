const express = require("express");
const router = express.Router();
const TracksInRecordController = require("../controllers/tablesControllers/tracksInRecordController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", TracksInRecordController.getAll);
router.post("/", authMiddleware, TracksInRecordController.create);

module.exports = router;