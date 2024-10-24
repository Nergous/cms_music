const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload, deleteOldLogo } = require("../middleware/multer");

router.post("/login", adminController.authenticate);
router.get("/checkAuth", authMiddleware, adminController.checkAuth);

router.get("/load", adminController.loadText);
router.get("/images", adminController.getImages);
router.delete("/images/:filename", authMiddleware, adminController.deleteImage);
router.post(
    "/upload_files",
    authMiddleware,
    (req, res, next) => {
         upload.array("files")(req, res, (err) => {
            if (err) {
                return res.status(400).contentType('text/plain').send(err.message);
            }
            next();
        });
    },
    adminController.uploadFiles
);
router.post("/save", authMiddleware, adminController.saveText);
router.post(
    "/update_credentials",
    authMiddleware,
    adminController.updateCredentials
);
router.post(
    "/upload_logo",
    authMiddleware,
    deleteOldLogo,
    (req, res, next) => {
        upload.single("logo")(req, res, (err) => {
            if (err) {
                console.log("Я умер здесь");
                console.log(err.message);
                return res.status(400).contentType('text/plain').send(err.message);
            }
            next();
        });
    },
    adminController.uploadLogo
);

module.exports = router;
