const fs = require("fs");
const path = require("path");
const {
    record,
    music_authors,
    members,
    tracks,
    tracks_in_record,
} = require("../models");

const RecordsController = {
    getAll: async (req, res) => {
        try {
            const listOfRecords = await record.findAll();
            res.json(listOfRecords);
        } catch (error) {
            res.status(500).json({
                message: "Ошибка при получении всех релизов",
            });
        }
    },

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const recordData = await record.findByPk(id, {
                include: [
                    {
                        model: tracks,
                        as: "tracks",
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
                    },
                ],
            });
            if (!recordData) {
                return res.status(404).json({ message: "Релиз не найден" });
            }
            res.json(recordData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка при получении релиза" });
        }
    },

    create: async (req, res) => {
        try {
            const { recordName, recordType, releaseYear } = req.body;

            const coverFullPath = req.files["cover"][0].path;
            const coverName = path.basename(coverFullPath);
            const coverRelativePath = path.join("..", "uploads", coverName);

            let trackFiles = req.files["trackFiles"];

            const recordData = {
                record_name: recordName,
                type_of_record: recordType,
                path_to_cover: coverRelativePath,
                year_of_publish: releaseYear,
            };
            // Создание новой записи
            const created_record = await record.create(recordData);

            const trackFile = JSON.parse(req.body["tracks"]);
            // Создание новых треков и связей
            for (let i = 0; i < trackFiles.length; i++) {
                const filePath = trackFiles[i].path;
                const fileName = path.basename(filePath);
                const relativePath = path.join("..", "uploads", fileName);

                const trackData = {
                    track_name: trackFile[i].name,
                    path_to_file: relativePath,
                    lyrics_author: trackFile[i].author,
                };

                const track = await tracks.create(trackData);

                // Создание связи между треком и записью
                await tracks_in_record.create({
                    id_track: track.id,
                    id_record: created_record.id,
                });

                const participants = trackFile[i].participants;
                const authorPromise = participants.map((participantsId) => {
                    return music_authors.create({
                        id_track: track.id,
                        id_member: participantsId,
                    });
                });

                // Создание связи между треком и автором
                await Promise.all(authorPromise);
            }

            res.status(200).json({ message: "Релиз успешно добавлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка при добавлении релиза" });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;

        try {
            const recordDelete = await record.findByPk(id);
            if (!recordDelete) {
                return res.status(404).json({ message: "Релиз не найден" });
            }

            const allTracksInRecord = await tracks_in_record.findAll({
                where: { id_record: id },
            });

            const trackPromises = allTracksInRecord.map(
                async (trackInRecord) => {
                    const track = await tracks.findByPk(trackInRecord.id_track);

                    if (track) {
                        const oldCoverPath = path.join(
                            __dirname,
                            "../../client/public/uploads",
                            track.path_to_file
                        );

                        if (fs.existsSync(oldCoverPath)) {
                            fs.unlinkSync(oldCoverPath);
                        }
                        await track.destroy();
                    }
                }
            );

            await Promise.all(trackPromises);

            const filePath = path.join(
                __dirname,
                "../../client/public/uploads",
                recordDelete.path_to_cover
            )
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await recordDelete.destroy();
            res.status(200).json({ message: "Релиз успешно удален" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка при удалении релиза" });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { recordName, recordType, releaseYear } = req.body;

            const existingRecord = await record.findByPk(id);
            if (!existingRecord) {
                return res.status(404).json({ message: "Релиз не найден" });
            }

            existingRecord.record_name = recordName;
            existingRecord.type_of_record = recordType;
            existingRecord.year_of_publish = releaseYear;
            try {
                if (req.files["cover"][0]) {
                    // Удалить старый файл обложки, если он существует
                    if (existingRecord.path_to_cover) {
                        const oldCoverPath = path.join(
                            __dirname,
                            "../../client/public/uploads",
                            existingRecord.path_to_cover
                        );
                        if (fs.existsSync(oldCoverPath)) {
                            fs.unlinkSync(oldCoverPath);
                        }
                    }

                    const coverFullPath = req.files["cover"][0].path;
                    const coverName = path.basename(coverFullPath);
                    const coverRelativePath = path.join(
                        "..",
                        "uploads",
                        coverName
                    );
                    existingRecord.path_to_cover = coverRelativePath;
                }
            } catch (error) {
                console.error(error);
            }

            await existingRecord.save();

            if (req.body.tracks) {
                const trackFiles = req.files["trackFiles"];
                const tracksRecord = JSON.parse(req.body["tracks"]);

                for (let i = 0; i < tracksRecord.length; i++) {
                    if (!tracksRecord[i].id) {
                        const trackData = {
                            track_name: tracksRecord[i].track_name,
                            lyrics_author: tracksRecord[i].lyrics_author,
                        };

                        const filePath = trackFiles.find(
                            (obj) => obj.originalname === `trackFiles_${i}.mp3`
                        ).path;

                        const fileName = path.basename(filePath);

                        const relativePath = path.join(
                            "..",
                            "uploads",
                            fileName
                        );

                        trackData.path_to_file = relativePath;

                        const createdTrack = await tracks.create(trackData);
                        if (members) {
                            for (let j = 0; j < members.length; j++) {
                                await music_authors.create({
                                    id_track: createdTrack.id,
                                    id_member: members[j].id,
                                });
                            }
                        }
                        await tracks_in_record.create({
                            id_track: createdTrack.id,
                            id_record: id,
                        });
                        continue;
                    }
                    const existingTrack = await tracks.findByPk(
                        tracksRecord[i].id
                    );
                    existingTrack.track_name = tracksRecord[i].track_name;
                    existingTrack.lyrics_author = tracksRecord[i].lyrics_author;
                    if (trackFiles) {
                        if (
                            trackFiles.find(
                                (obj) =>
                                    obj.originalname === `trackFiles_${i}.mp3`
                            )
                        ) {
                            const filePath = trackFiles.find(
                                (obj) =>
                                    obj.originalname === `trackFiles_${i}.mp3`
                            ).path;
                            const fileName = path.basename(filePath);
                            const relativePath = path.join(
                                "..",
                                "uploads",
                                fileName
                            );
                            const oldFile = path.join(
                                __dirname,
                                "../../client/public/uploads",
                                existingTrack.path_to_file
                            );

                            if (fs.existsSync(oldFile)) {
                                fs.unlinkSync(oldFile);
                            }
                            existingTrack.path_to_file = relativePath;
                        }
                    }

                    await existingTrack.save();

                    const existingLinks = await tracks_in_record.findAll({
                        where: { id_track: tracksRecord[i].id },
                    });
                    for (const link of existingLinks) {
                        await link.destroy();
                    }

                    await tracks_in_record.create({
                        id_track: tracksRecord[i].id,
                        id_record: existingRecord.id,
                    });

                    const existingAuthors = await music_authors.findAll({
                        where: { id_track: tracksRecord[i].id },
                    });
                    for (const author of existingAuthors) {
                        await author.destroy();
                    }
                    if (tracksRecord[i].authors) {
                        const participants = tracksRecord[i].authors;

                        const authorPromise = participants.map(
                            (participants) => {
                                return music_authors.create({
                                    id_track: tracksRecord[i].id,
                                    id_member: participants.id,
                                });
                            }
                        );
                        await Promise.all(authorPromise);
                    }

                    // Создание связи между треком и автором
                }
            }

            res.status(200).json({ message: "Релиз успешно добавлен" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Ошибка при добавлении релиза" });
        }
    },
};

module.exports = RecordsController;
