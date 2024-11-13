const express = require("express");
const router = express.Router();
const MusicRolesController = require("../controllers/tablesControllers/musicRolesController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", MusicRolesController.getAll);
router.get("/:id", MusicRolesController.getById);
router.post("/", authMiddleware, MusicRolesController.create);
router.put("/:id", authMiddleware, MusicRolesController.update);
router.delete("/:id", authMiddleware, MusicRolesController.delete);

module.exports = router;