const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathDir = path.join(__dirname, "../../../client/public/");
        cb(null, pathDir);
    },
    filename: (req, file, cb) => {
        cb(null, "favicon.ico");
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [".ico"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error("Неверный тип файла. Допустимо: .ico"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024, // 100 KB
    },
});

exports.getImages = (req, res) => {
    const imageDir = path.join(__dirname, "../../../client/public/uploads/carousel");
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка при чтении директории" });
        }
        res.status(200).json(files);
    });
};

exports.deleteImage = (req, res) => {
    const imagePath = path.join(__dirname, "../../../client/public/uploads/carousel", req.params.filename);

    fs.unlink(imagePath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка при удалении файла" });
        }
        res.status(200).json({ success: "Файл успешно удален" });
    });
};

exports.uploadFiles = (req, res) => {
    if (!req.files) {
        return res.status(400).json({ error: "Нет файлов" });
    }
    res.status(200).json({ success: "Файлы загружены успешно" });
};

exports.uploadLogo = (req, res) => {
    if (!req.file) {
        return res.status(400).contentType("text/plain").json({ error: "Файл не был загружен" });
    }
    res.status(200).json({ success: "Логотип успешно загружен" });
};

exports.getFavicon = (req, res) => {
    const faviconPath = path.join(__dirname, "../../../client/public/favicon.ico");
    if (fs.existsSync(faviconPath)) {
        res.status(200).send({ faviconUrl: "/favicon.ico" });
    } else {
        res.status(404).json({ error: "Фавикон не найден" });
    }
};
exports.saveFavicon = (req, res) => {
    if (!req.file) {
        return res.status(400).contentType("text/plain").json({ error: "Файл не был загружен" });
    }

    res.status(200).json({ success: "Фавикон успешно загружен" });
};