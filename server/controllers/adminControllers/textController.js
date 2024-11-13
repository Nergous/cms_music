const fs = require("fs");
const path = require("path");

exports.loadText = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Не удалось загрузить файл конфигурации!");
        }
        try {
            const parsedData = JSON.parse(data);
            const mainText = parsedData.mainText;

            if (!mainText) {
                return res.status(404).send("Текст не найден");
            }
            res.status(200).json({ MainText: mainText });
        } catch (error) {
            return res.status(500).send("Не удалось прочесть файл конфигурации!");
        }
    });
};

exports.saveText = (req, res) => {
    const text = req.body.text;
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
        jsonData.mainText = text;

        // Записываем обновленное содержимое обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).send("Ошибка при сохранении текста в файл");
            }
            res.status(200).send("Текст успешно сохранен");
        });
    });
};