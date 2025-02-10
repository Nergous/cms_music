// server/controllers/pagesController.js
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const configPath = path.join(__dirname, "../../../client/config_cms.json");

exports.loadPage = (req, res) => {
    const pageName = req.params.pageName;

    if (!pageName) {
        return res.status(400).json({ error: "Имя страницы обязательно" });
    }

    fs.readFile(configPath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка при чтении файла конфигурации:", err);
            return res.status(500).json({ error: "Ошибка при чтении файла конфигурации" });
        }

        try {
            const config = JSON.parse(data);
            const page = config.pages[pageName] || [];
            res.json(page);
        } catch (parseError) {
            console.error("Ошибка при парсинге JSON:", parseError);
            res.status(500).json({ error: "Ошибка при парсинге JSON" });
        }
    });
};

exports.savePage = (req, res) => {
    const { pageName, page } = req.body;
    console.log(page);

    if (!pageName || !page) {
        return res.status(400).json({ error: "Имя страницы и данные страницы обязательны" });
    }

    fs.readFile(configPath, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка при чтении файла конфигурации:", err);
            return res.status(500).json({ error: "Ошибка при чтении файла конфигурации" });
        }

        try {
            let config = JSON.parse(data);
            if (!config.pages) {
                config.pages = {};
            }
            config.pages[pageName] = page;

            fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
                if (err) {
                    console.error("Ошибка при записи в файл конфигурации:", err);
                    return res.status(500).json({ error: "Ошибка при записи в файл конфигурации" });
                }
                res.status(200).json({ success: "Страница успешно сохранена" });
            });
        } catch (parseError) {
            console.error("Ошибка при парсинге JSON:", parseError);
            res.status(500).json({ error: "Ошибка при парсинге JSON" });
        }
    });
};

exports.upload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Файл не был загружен." });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.json({ path: filePath });
};
