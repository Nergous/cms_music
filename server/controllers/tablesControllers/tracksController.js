const { tracks } = require("../../models");
const fs = require("fs");
const { music_authors, members } = require("../../models");

const TracksController = {
    getAll: async (req, res) => {
        try {
            const listOfTracks = await tracks.findAll({
                include: [
                    {
                        model: members,
                        as: "authors",
                    },
                    {
                        model: members,
                        as: "lyrics_authored",
                    },
                ],
            });
            res.json(listOfTracks);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка треков",
            });
        }
    },

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const track = await tracks.findByPk(id, {
                include: [
                    {
                        model: members,
                        as: "authors",
                    },
                    {
                        model: members,
                        as: "lyrics_authored",
                    },
                ],
            });
            if (track) {
                res.json(track);
            } else {
                res.status(404).json({ error: "Трек не найден" });
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении трека" });
        }
    },

    create: async (req, res) => {
        const track = req.body;
        try {
            const newTrack = await tracks.create(track);
            res.status(201).json(newTrack);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при создании трека" });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;
        try {
            const deletedTrack = await tracks.findByPk(id);
            if (deletedTrack) {
                const filePath = deletedTrack.path_to_file;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                await deletedTrack.destroy();
                res.json(deletedTrack);
            } else {
                res.status(404).json({ error: "Трек не найден" });
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при удалении трека" });
        }
    },
};

module.exports = TracksController;
