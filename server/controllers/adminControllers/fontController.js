const fs = require("fs");
const path = require("path");

exports.getFont = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const fonts = parsedData.fonts;

            if (!fonts) {
                return res.status(404).send("Шрифт не найден");
            }
            res.status(200).json({ Font: fonts });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveFont = (req, res) => {
    const font = req.body.fonts;
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
        jsonData.fonts = font;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении шрифта в файл");
            }
            res.status(200).send("Шрифт успешно сохранен");
        });
    });
};
exports.deleteFont = (req, res) => {
    const fontToDelete = req.body.font;
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

        // Проверяем, существует ли шрифт в списке
        if (!jsonData.fonts || !jsonData.fonts.available_fonts.includes(fontToDelete)) {
            return res.status(404).send("Шрифт не найден");
        }

        // Удаляем шрифт из списка
        jsonData.fonts.available_fonts = jsonData.fonts.available_fonts.filter(font => font !== fontToDelete);

        // Если удаляемый шрифт был выбранным, выбираем первый доступный шрифт
        if (jsonData.fonts.selected_font === fontToDelete) {
            jsonData.fonts.selected_font = jsonData.fonts.available_fonts[0] || "";
        }

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при удалении шрифта из файла");
            }
            res.status(200).send("Шрифт успешно удален");
        });
    });
};

