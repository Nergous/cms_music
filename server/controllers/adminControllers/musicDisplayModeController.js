const fs = require("fs");
const path = require("path");

exports.getMusicDisplayMode = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка при чтении файла" });
        } else {
            try {
                let parsedData = JSON.parse(data);
                if (!parsedData.musicDisplayMode) {
                    parsedData.musicDisplayMode = "default"; // Устанавливаем значение по умолчанию
                    fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
                }
                res.status(200).json({ displayMode: parsedData.musicDisplayMode });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Ошибка при получении данных" });
            }
        }
    });
};


exports.saveMusicDisplayMode = (req, res) => {
    const { displayMode } = req.body;
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка при чтении файла" });
        } else {
            try {
                let parsedData = JSON.parse(data);
                parsedData.musicDisplayMode = displayMode;
                fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
                res.status(200).json({ success: "Настройки отображения музыкальных релизов успешно сохранены" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Ошибка при сохранении данных" });
            }
        }
    });
};
