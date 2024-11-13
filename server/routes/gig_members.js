const express = require("express");
const router = express.Router();
const GigMembersController = require("../controllers/tablesControllers/gigMembersController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", GigMembersController.getAll);
router.get("/:id", GigMembersController.getById);
router.post("/", authMiddleware, GigMembersController.create);
router.put("/:id", authMiddleware, GigMembersController.update);
router.delete("/:id", authMiddleware, GigMembersController.delete);

module.exports = router;
