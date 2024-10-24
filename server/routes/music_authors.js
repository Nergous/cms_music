const express = require("express");
const router = express.Router();
const MusicAuthorsController = require("../controllers/musicAuthorsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", MusicAuthorsController.getAll);
router.post("/", authMiddleware, MusicAuthorsController.create);

module.exports = router;
