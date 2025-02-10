const express = require("express");
const router = express.Router();
const {
    adminController,
    authController,
    colorController,
    fontController,
    textController,
    imageController,
    footerController,
    htmlController,
    navbarController,
    pagesController,
    musicDisplayModeController
} = require("../controllers/adminControllers");

const authMiddleware = require("../middleware/authMiddleware");
const { upload, uploadFavicon, deleteOldLogo, deleteOldFavicon } = require("../middleware/multer");

router.get("/checkAuth", authMiddleware, authController.checkAuth);

router.post("/login", authController.authenticate);

router.post("/update_credentials", authMiddleware, adminController.updateCredentials);

// Текст на главной странице
router.get("/load", textController.loadText);
router.post("/save", authMiddleware, textController.saveText);

// Изображения в каруселе на главной странице
router.get("/images", imageController.getImages);
router.post("/upload_files", authMiddleware, imageController.uploadFiles);
router.delete("/images/:filename", authMiddleware, imageController.deleteImage);

// Подвал приложения
router.get("/footer", footerController.loadFooter);
router.post("/save_footer", authMiddleware, footerController.saveFooter);

// Значки социальных сетей в подвале
router.get("/socials", footerController.loadSocials);
router.post("/save_socials", authMiddleware, footerController.saveSocials);

// Шрифт приложения
router.get("/font", fontController.getFont);
router.post("/save_font", authMiddleware, fontController.saveFont);
router.delete("/delete_font", authMiddleware, fontController.deleteFont);

// Основные цвета приложения
router.get("/colors", colorController.getColors);
router.post("/save_colors", authMiddleware, colorController.saveColors);

// Цвет шрифтов приложения
router.get("/font_colors", colorController.getFontColors);
router.post("/save_font_colors", authMiddleware, colorController.saveFontColors);

// Цвет значков соц. сетей в подвале
router.get("/icon_colors", colorController.getIconColors);
router.post("/save_icon_colors", authMiddleware, colorController.saveIconColors);

// Логотип в шапке
router.post(
    "/upload_logo",
    authMiddleware,
    deleteOldLogo,
    (req, res, next) => {
        upload.single("logo")(req, res, (err) => {
            if (err) {
                return res.status(400).contentType("text/plain").send(err.message);
            }
            next();
        });
    },
    imageController.uploadLogo
);

// Favicon
router.get("/get_favicon", imageController.getFavicon);
router.post(
    "/save_favicon",
    authMiddleware,
    (req, res, next) => {
        uploadFavicon.single("favicon")(req, res, (err) => {
            if (err) {
                return res.status(400).contentType("text/plain").send(err.message);
            }
            next();
        });
    },
    imageController.saveFavicon
);

// Описание страницы
router.get("/get_description", htmlController.getDescription);
router.post("/save_description", authMiddleware, htmlController.saveDescription);

// Название страницы
router.get("/get_title", htmlController.getTitle);
router.post("/save_title", authMiddleware, htmlController.saveTitle);

// Навигационная панель
router.get("/navbar_settings", navbarController.getNavbarSettings);
router.post("/save_navbar_settings", authMiddleware, navbarController.saveNavbarSettings);

router.get("/get_music_display_mode", musicDisplayModeController.getMusicDisplayMode);
router.post("/save_music_display_mode", authMiddleware, musicDisplayModeController.saveMusicDisplayMode);

// Страница
router.get("/load_page/:pageName", pagesController.loadPage);
router.post("/save_page", authMiddleware, pagesController.savePage);

module.exports = router;
