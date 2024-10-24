const fs = require("fs");
const path = require("path");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");

env.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathDir = path.join(__dirname, "../../client/public/uploads")
        cb(null, pathDir);
    },
    filename: (req, file, cb) => {
        cb(null, "logo.png");
    },
})
const upload = multer({ storage: storage });

exports.loadText = (req, res) => {
    const filePath = path.join(__dirname, '../../client/public/uploads/text.txt');
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Failed to load text");
        }
        res.status(200).send(data);
    });
};

exports.authenticate = (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.REACT_APP_ADMIN_LOGIN &&
        password === process.env.REACT_APP_ADMIN_PASSWORD
    ) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({
            success: false,
            message: "Ошибка авторизации",
        });
    }
};

exports.checkAuth = (req, res) => {
    res.status(200).json({ success: true });
};

exports.getImages = (req, res) => {
    const imageDir = path.join(__dirname, '../../client/public/uploads/carousel');
    fs.readdir(imageDir, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Ошибка при чтении директории");
        }
        res.status(200).json(files);
    });
};

exports.deleteImage = (req, res) => {

    const imagePath = path.join(__dirname, '../../client/public/uploads/carousel', req.params.filename);

    fs.unlink(imagePath, (err) => {
        if (err) {
            return res.status(500).send("Ошибка при удалении файла");
        }
        res.status(200).send("Файл успешно удален");
    });
};

exports.uploadFiles = (req, res) => {
    if (!req.files) {
        return res.status(400).send("Нет файлов");
    }
    res.status(200).send("Файлы загружены успешно");
};

exports.saveText = (req, res) => {
    const text = req.body.text;
    const filePath = path.join(
        __dirname,
        "../../client/public/uploads",
        "text.txt"
    );
    fs.writeFile(filePath, text, (err) => {
        if (err) {
            return res.status(500).send("Ошибка при сохранении текста в файл");
        }
        res.status(200).send("Текст успешно сохранен");
    });
};

exports.updateCredentials = (req, res) => {
    const { login, password } = req.body;
    const envPath = path.join(__dirname, "../../server/.env");

    fs.readFile(envPath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Ошибка при чтении файла .env");
        }

        let envConfig = {};
        data.split("\n").forEach((line) => {
            const [key, value] = line.split("=");
            if (key && value) {
                envConfig[key.trim()] = value.trim();
            }
        });

        envConfig.REACT_APP_ADMIN_LOGIN = login;
        envConfig.REACT_APP_ADMIN_PASSWORD = password;

        const newEnv = Object.keys(envConfig)
            .map((key) => `${key}=${envConfig[key]}`)
            .join("\n");

        fs.writeFile(envPath, newEnv, (err) => {
            if (err) {
                return res.status(500).send("Ошибка при обновлении .env файла");
            }
            res.status(200).send("Данные успешно обновлены");
        });
    });
};

exports.uploadLogo = (req, res) => {

    if (!req.file) {
        return res.status(400).contentType('text/plain').send("Файл не был загружен");
    }
    res.status(200).send("Логотип успешно загружен");

}
