const { members } = require("../../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { member_roles, music_roles } = require("../../models");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, "../../client/public/uploads");
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
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

const handleFileUpload = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single("img")(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const MembersController = {
    getAll: async (req, res) => {
        try {
            const listOfMembers = await members.findAll({
                include: [
                    {
                        model: music_roles,
                    },
                ],
            });
            res.json(listOfMembers);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка участников",
            });
        }
    },

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const member = await members.findByPk(id, {
                include: [
                    {
                        model: music_roles,
                    },
                ],
            });
            if (member) {
                res.json(member);
            } else {
                res.status(404).send("Участник не найден");
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении участника" });
        }
    },

    create: async (req, res) => {
        try {
            await handleFileUpload(req, res);

            const memberData = {
                name_of_member: req.body.name_of_member,
                nickname: req.body.nickname,
                description: req.body.description,
                date_start: req.body.date_start,
                date_end: req.body.date_end
                    ? new Date(req.body.date_end)
                    : null,
                path_to_photo: req.file
                    ? path.join("..", "uploads", req.file.filename)
                    : req.body.img,
                is_member: req.body.is_member,
            };

            const newMember = await members.create(memberData);

            if (req.body.roles) {
                for (let role of req.body.roles) {
                    await member_roles.create({
                        id_role: role,
                        id_member: newMember.id,
                    });
                }
            }

            res.status(200).json(newMember);
        } catch (error) {
            res.status(500).send(
                "Ошибка при сохранении участника в базу данных: " + error
            );
        }
    },

    update: async (req, res) => {
        const memberId = req.params.id;
        const member = await members.findByPk(memberId);

        if (!member) {
            return res.status(404).send("Участник не найден");
        }

        try {
            await handleFileUpload(req, res);

            const updatedMemberData = {
                name_of_member: req.body.name_of_member,
                nickname: req.body.nickname,
                description: req.body.description,
                date_start: req.body.date_start,
                date_end: req.body.date_end
                    ? new Date(req.body.date_end)
                    : null,
            };

            if (req.file) {
                if (member.path_to_photo) {
                    const oldFilePath = path.join(
                        __dirname,
                        "../../client/public/uploads",
                        member.path_to_photo
                    );
                    fs.unlink(oldFilePath, (err) => {
                        if (err)
                            console.error(
                                "Ошибка при удалении старого файла:",
                                err
                            );
                    });
                }
                updatedMemberData.path_to_photo = path.join(
                    "..",
                    "uploads",
                    req.file.filename
                );
            }

            await member.update(updatedMemberData);

            if (req.body.roles) {
                await member_roles.destroy({
                    where: {
                        id_member: memberId,
                    },
                });
                for (let role of req.body.roles) {
                    await member_roles.create({
                        id_role: role,
                        id_member: memberId,
                    });
                }
            }

            res.status(200).json(member);
        } catch (error) {
            res.status(500).send(
                "Ошибка при обновлении участника в базе данных" + error
            );
        }
    },

    delete: async (req, res) => {
        const memberId = req.params.id;
        const member = await members.findByPk(memberId);

        if (!member) {
            return res.status(404).send("Участник не найден");
        }

        try {
            if (member.path_to_photo) {
                const filePath = path.join(
                    __dirname,
                    "../../client/public/uploads",
                    member.path_to_photo
                );
                fs.unlink(filePath, (err) => {
                    if (err)
                        console.error(
                            "Ошибка при удалении фото участника:",
                            err
                        );
                });
            }

            await member.destroy();
            res.status(200).send("Участник успешно удален");
        } catch (error) {
            res.status(500).send(
                "Ошибка при удалении участника из базы данных"
            );
        }
    },
};

module.exports = MembersController;
