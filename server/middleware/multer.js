const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "logo") {
            const filePath = path.join(__dirname, "../../client/public/uploads/logo");
            cb(null, filePath);
        } else if (file.fieldname === "files") {
            const filePath = path.join(__dirname, "../../client/public/uploads/carousel");
            cb(null, filePath);
        } else if (file.fieldname === "favicon") {
            const filePath = path.join(__dirname, "../../client/public");
            cb(null, filePath);
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "logo") {
            cb(null, "logo.png");
        } else if (file.fieldname === "files") {
            cb(null, Date.now() + path.extname(file.originalname));
        } else if (file.fieldname === "favicon") {
            cb(null, "favicon.ico");
        }
    },
});


const storageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    },
});

const uploadImg = multer({ storage: storageImg });

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

const faviconFileFilter = (req, file, cb) => {
    const filetypes = /ico/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Отправлена не иконка фавикон формата .ico"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });
const uploadFavicon = multer({ storage: storage, fileFilter: faviconFileFilter });

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

const deleteOldFavicon = (req, res, next) => {
    const faviconPath = path.join(__dirname, '../../client/public', 'favicon.ico');
    if (fs.existsSync(faviconPath)) {
        fs.unlink(faviconPath, (err) => {
            if (err) {
                return res.status(500).send('Ошибка при удалении старого фавикона');
            }
            next();
        });
    } else {
        next();
    }
};

module.exports = { upload, uploadFavicon, deleteOldLogo, deleteOldFavicon, uploadImg };