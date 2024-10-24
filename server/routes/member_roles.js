const express = require("express");
const router = express.Router();
const MemberRolesController = require("../controllers/memberRolesController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", MemberRolesController.getAll);
router.post("/", authMiddleware, MemberRolesController.create);

module.exports = router;
