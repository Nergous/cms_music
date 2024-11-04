const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload, deleteOldLogo } = require("../middleware/multer");

router.get("/checkAuth", authMiddleware, adminController.checkAuth);
router.get("/load", adminController.loadText);
router.get("/images", adminController.getImages);
router.get("/footer", adminController.loadFooter);
router.get("/socials", adminController.loadSocials);
router.get("/font", adminController.getFont);

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
router.post("/login", adminController.authenticate);
router.post("/save", authMiddleware, adminController.saveText);
router.post("/save_footer", authMiddleware, adminController.saveFooter);
router.post("/save_socials", authMiddleware, adminController.saveSocials);
router.post("/save_font", authMiddleware, adminController.saveFont);
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
                return res.status(400).contentType('text/plain').send(err.message);
            }
            next();
        });
    },
    adminController.uploadLogo
);

router.delete("/images/:filename", authMiddleware, adminController.deleteImage);

module.exports = router;
