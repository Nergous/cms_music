const fs = require("fs");
const path = require("path");

exports.getColors = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const colors = parsedData.colors;

            if (!colors) {
                return res.status(404).send("Цвета не найдены");
            }
            res.status(200).json({ Colors: colors });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveColors = (req, res) => {
    const colors = req.body.Colors;
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
        jsonData.colors = colors;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении цветов в файл");
            }
            res.status(200).send("Цвета успешно сохранены");
        });
    });
};

exports.getFontColors = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const fontColors = parsedData.fontColors;

            if (!fontColors) {
                return res.status(404).send("Цвета не найдены");
            }
            res.status(200).json({ FontColors: fontColors });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveFontColors = (req, res) => {
    const colors = req.body.FontColors;
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
        jsonData.fontColors = colors;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении цветов в файл");
            }
            res.status(200).send("Цвета успешно сохранены");
        });
    });
};


exports.getIconColors = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const iconColors = parsedData.iconColors;

            if (!iconColors) {
                return res.status(404).send("Цвета не найдены");
            }
            res.status(200).json({ IconColors: iconColors });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveIconColors = (req, res) => {
    const colors = req.body.IconColors;
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
        jsonData.iconColors = colors;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении цветов в файл");
            }
            res.status(200).send("Цвета успешно сохранены");
        });
    });
};