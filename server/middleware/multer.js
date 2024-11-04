const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "logo") {
            const filePath = path.join(__dirname, "../../client/public/uploads/logo")
            cb(null, filePath);
        } else if (file.fieldname === "files") {
            const filePath = path.join(__dirname, "../../client/public/uploads/carousel");
            cb(null, filePath);
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "logo") {
            cb(null, "logo.png");
        } else if (file.fieldname === "files") {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    },
});

const imageFileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Отправлены не картинки"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const deleteOldLogo = (req, res, next) => {
    const logoPath = path.join(__dirname, '../../client/public/uploads/logo', 'logo.png');
    if (fs.existsSync(logoPath)) {
        fs.unlink(logoPath, (err) => {
            if (err) {
                return res.status(500).send('Ошибка при удалении старого логотипа');
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = {upload, deleteOldLogo};
