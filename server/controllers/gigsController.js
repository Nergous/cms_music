const { gigs } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { gig_members, members } = require("../models");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathToDir = path.join(__dirname, "../../client/public/uploads/")
        cb(null, pathToDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени файла
    },
});

const imageFileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Отправлены не картинки"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

function deleteFile(filePath) {
    const path_to_delete = filePath.replace(
        "uploads",
        "../client/public/uploads"
    );
    const pathFile = path.join(__dirname, path_to_delete);
    if (fs.existsSync(path_to_delete)) {
        fs.unlinkSync(path_to_delete);
    }
}

const GigsController = {
    getAll: async (req, res) => {
        try {
            const listOfGigs = await gigs.findAll();
            res.json(listOfGigs);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка выступлений",
            });
        }
    },
    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const gig = await gigs.findByPk(id, {
                include: [
                    {
                        model: members,
                    },
                ],
            });
            res.json(gig);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении выступления" });
        }
    },
    create: async (req, res) => {
        upload.single("poster")(req, res, async (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Ошибка при загрузке файла\nПроверьте расширение файла: файл должен иметь расширение jpg, jpeg или png" });
            }
            const data = req.body;
            const posterPath = req.file.path;
            const fileName = path.basename(posterPath);
            const relativePath = path.join("..", "uploads", fileName);

            const gig = {
                title: data.title,
                link_to_social: data.social_link,
                place: data.venue,
                date_of_gig: data.date,
                gig_status: data.status,
                path_to_poster: relativePath,
            };

            try {
                const created_gig = await gigs.create(gig);
                if (data.participants) {
                    for (let i = 0; i < data.participants.length; i++) {
                        const data_member = {
                            id_gig: created_gig.id,
                            id_member: data.participants[i].id,
                        };
                        await gig_members.create(data_member);
                    }
                }
                res.json(created_gig);
            } catch (error) {
                res.status(500).json({
                    error: "Ошибка при создании выступления",
                });
            }
        });
    },
    update: async (req, res) => {
        const id = req.params.id;
        upload.single("poster")(req, res, async (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Ошибка при загрузке файла:\n" + err.message });
            }
            const raw_data = req.body;

            try {
                const gig = await gigs.findByPk(id);
                let relativePath = gig.path_to_poster;
                if (req.file) {
                    const posterPath = req.file.path;
                    const fileName = path.basename(posterPath);
                    relativePath = path.join("..", "uploads", fileName);
                    if (gig && gig.path_to_poster) {
                        deleteFile(gig.path_to_poster);
                    }
                }

                const data = {
                    title: req.body.title,
                    link_to_social: req.body.social_link,
                    place: req.body.venue,
                    date_of_gig: req.body.date,
                    gig_status: req.body.status,
                    path_to_poster: relativePath,
                };

                await gigs.update(data, { where: { id: id } });

                if (raw_data.participants) {
                    for (let i = 0; i < raw_data.participants.length; i++) {
                        const data_member = {
                            id_gig: id,
                            id_member: raw_data.participants[i].id,
                        };
                        const existingLink = await gig_members.findOne({
                            where: {
                                id_gig: id,
                                id_member: raw_data.participants[i].id,
                            },
                        });
                        if (existingLink) {
                            await gig_members.update(data_member, {
                                where: {
                                    id_gig: id,
                                    id_member: raw_data.participants[i].id,
                                },
                            });
                        } else {
                            await gig_members.create(data_member);
                        }
                    }
                } else {
                    await gig_members.destroy({ where: { id_gig: id } });
                }
                res.json({ success: true });
            } catch (error) {
                res.status(500).json({
                    error: "Ошибка при обновлении выступления: " + error,
                });
            }
        });
    },
    delete: async (req, res) => {
        const id = req.params.id;
        try {
            const gig = await gigs.findByPk(id);
            if (gig && gig.path_to_poster) {
                deleteFile(gig.path_to_poster);
            }

            await gig_members.destroy({ where: { id_gig: id } });
            await gigs.destroy({ where: { id: id } });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при удалении выступления" });
        }
    },
};

module.exports = GigsController;
