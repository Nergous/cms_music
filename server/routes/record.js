const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const RecordsController = require("../controllers/tablesControllers/recordsController");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, "../../client/public/uploads");
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.get("/", RecordsController.getAll);
router.get("/:id", RecordsController.getById);
router.post(
    "/",
    authMiddleware, 
    upload.fields([
        { name: "cover", maxCount: 1 },
        { name: "trackFiles", maxCount: 100 },
    ]),
    RecordsController.create
);
router.delete("/:id", authMiddleware, RecordsController.delete);
router.put(
    "/:id",
    authMiddleware, 
    upload.fields([
        { name: "cover", maxCount: 1 },
        { name: "trackFiles", maxCount: 100 },
    ]),
    RecordsController.update
);

module.exports = router;
