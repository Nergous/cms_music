const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "logo") {
            const filePath = path.join(__dirname, "../../client/public/uploads/logo")
            console.log("Вот вам путь к лого", filePath);
            cb(null, filePath);
        } else if (file.fieldname === "files") {
            const filePath = path.join(__dirname, "../../client/public/uploads/carousel");
            cb(null, filePath);
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "logo") {
            console.log("Вот вам имя лого");
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
        console.log("Удаляем по ", logoPath);
        fs.unlink(logoPath, (err) => {
            if (err) {
                console.log("Не получилось", err);
                return res.status(500).send('Ошибка при удалении старого логотипа');
            }
            next();
        });
    } else {
        console.log("Идем дальше");
        next();
    }
};

module.exports = {upload, deleteOldLogo};
