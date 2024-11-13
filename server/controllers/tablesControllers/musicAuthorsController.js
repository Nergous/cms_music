const { music_authors } = require("../../models");

const MusicAuthorsController = {
    getAll: async (req, res) => {
        try {
            const listMusicAuthors = await music_authors.findAll();
            res.json(listMusicAuthors);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка авторов музыки",
            });
        }
    },

    create: async (req, res) => {
        try {
            const mus_auth = req.body;
            const newMusicAuthor = await music_authors.create(mus_auth);
            res.json(newMusicAuthor);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при создании автора музыки",
            });
        }
    },
};

module.exports = MusicAuthorsController;
