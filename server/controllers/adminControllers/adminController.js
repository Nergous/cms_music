const fs = require("fs");
const path = require("path");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
const multer = require("multer");

env.config();

exports.updateCredentials = (req, res) => {
    const { login, password } = req.body;
    const envPath = path.join(__dirname, "../../../server/.env");

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




