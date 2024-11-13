const fs = require('fs');
const path = require('path');

exports.getDescription = (req, res) => {
    const configPath = path.join(__dirname, '../../../client/config_cms.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.status(200).send({ description: config.description });
    } else {
        res.status(404).send("Описание не найдено");
    }
};
exports.saveDescription = (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).contentType("text/plain").send("Описание не было отправлено");
    }

    const configPath = path.join(__dirname, '../../../client/config_cms.json');
    let config = {};
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    config.description = description;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    res.status(200).send("Описание успешно сохранено");
};


exports.getTitle = (req, res) => {
    const configPath = path.join(__dirname, '../../../client/config_cms.json');
    if (fs.existsSync(configPath)) {        
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.status(200).send({ title: config.title });
    } else {
        res.status(404).send("Название не найдено");
    }
}


exports.saveTitle = (req, res) => {
    const { title } = req.body;
    if (!title) {        
        return res.status(400).contentType("text/plain").send("Название не было отправлено");
    }

    const configPath = path.join(__dirname, '../../../client/config_cms.json');
    let config = {};
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    config.title = title;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

    res.status(200).send("Название успешно сохранено");
};