const { music_roles } = require("../models");

const MusicRolesController = {
    getAll: async (req, res) => {
        try {
            const listOfMusicRoles = await music_roles.findAll();
            res.json(listOfMusicRoles);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка ролей",
            });
        }
    },

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const role = await music_roles.findByPk(id);
            if (role) {
                res.json(role);
            } else {
                res.status(404).json({ error: "Роль не найдена" });
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении роли" });
        }
    },

    create: async (req, res) => {
        const musRole = {
            role_name: req.body.role_name,
        };
        try {
            const newRole = await music_roles.create(musRole);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при создании роли" });
        }
    },

    update: async (req, res) => {
        const id = req.params.id;
        try {
            const role = await music_roles.findByPk(id);
            if (role) {
                const data = {
                    role_name: req.body.role_name,
                };
                await role.update(data);
                res.json(role);
            } else {
                res.status(404).json({ error: "Роль не найдена" });
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при обновлении роли" });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;
        try {
            const role = await music_roles.findByPk(id);
            if (role) {
                await role.destroy();
                res.status(204).send();
            } else {
                res.status(404).json({ error: "Роль не найдена" });
            }
        } catch (error) {
            res.status(500).json({ error: "Ошибка при удалении роли" });
        }
    },
};

module.exports = MusicRolesController;
