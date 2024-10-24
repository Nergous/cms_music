const { tracks_in_record } = require("../models");

const TracksInRecordController = {
    getAll: async (req, res) => {
        try {
            const listOfTracksInRecord = await tracks_in_record.findAll();
            res.json(listOfTracksInRecord);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка треков в записи",
            });
        }
    },

    create: async (req, res) => {
        try {
            const trackInRecord = req.body;
            const newTrackInRecord = await tracks_in_record.create(
                trackInRecord
            );
            res.json(newTrackInRecord);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при создании трека в записи",
            });
        }
    },
};

module.exports = TracksInRecordController;
