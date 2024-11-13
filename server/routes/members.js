const express = require("express");
const router = express.Router();
const MembersController = require("../controllers/tablesControllers/membersController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", MembersController.getAll);
router.get("/:id", MembersController.getById);
router.post("/", authMiddleware, MembersController.create);
router.put("/:id", authMiddleware, MembersController.update);
router.delete("/:id", authMiddleware, MembersController.delete);

module.exports = router;
