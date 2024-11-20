const fs = require("fs");
const path = require("path");

exports.getNavbarSettings = (req, res) => {
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            try {
                let parsedData = JSON.parse(data);
                if (!parsedData.navbarDisplayMode) {
                    parsedData.navbarDisplayMode = "auto"; // Устанавливаем значение по умолчанию
                    fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
                }
                res.status(200).json({ displayMode: parsedData.navbarDisplayMode });
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }
    });
};

exports.saveNavbarSettings = (req, res) => {
    const { displayMode } = req.body;
    const filePath = path.join(__dirname, "../../../client/config_cms.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        } else {
            try {
                let parsedData = JSON.parse(data);
                parsedData.navbarDisplayMode = displayMode;
                fs.writeFileSync(filePath, JSON.stringify(parsedData, null, 2));
                res.status(200).send("Настройки навигационной панели успешно сохранены");
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }
    });
};