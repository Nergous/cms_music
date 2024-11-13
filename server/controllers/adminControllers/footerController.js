const fs = require("fs");
const path = require("path");

exports.loadFooter = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const footerText = parsedData.footerText;

            if (!footerText) {
                return res.status(404).send("Текст подвала не найден");
            }
            res.status(200).json({ FooterText: footerText });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveFooter = (req, res) => {
    const footerText = req.body.footerText;
    const filePath = path.join(__dirname, "../../../client", "config_cms.json");

    // Читаем текущее содержимое файла
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Ошибка при чтении файла");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).send("Ошибка при парсинге JSON");
        }

        // Обновляем содержимое JSON
        jsonData.footerText = footerText;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении текста подвала в файл");
            }
            res.status(200).send("Текст подвала успешно сохранен");
        });
    });
};

exports.loadSocials = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const socials = parsedData.socials;

            if (!socials) {
                return res.status(404).send("Социальные сети не найдены");
            }
            res.status(200).json({ Socials: socials });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveSocials = (req, res) => {
    const socials = req.body.socials;
    const filePath = path.join(__dirname, "../../../client", "config_cms.json");

    // Читаем текущее содержимое файла
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Ошибка при чтении файла");
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).send("Ошибка при парсинге JSON");
        }

        // Обновляем содержимое JSON
        jsonData.socials = socials;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении социальных сетей в файл");
            }
            res.status(200).send("Социальные сети успешно сохранены");
        });
    });
};
