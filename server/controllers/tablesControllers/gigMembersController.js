const { gig_members } = require("../../models");

const GigMembersController = {
    getAll: async (req, res) => {
        try {
            const listOfGigMembers = await gig_members.findAll();
            res.json(listOfGigMembers);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    },

    getById: async (req, res) => {
        const id = req.params.id;
        try {
            const gigMember = await gig_members.findAll({
                where: { id_gig: id },
            });
            res.json(gigMember);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении данных" });
        }
    },

    create: async (req, res) => {
        const gigMember = req.body;
        try {
            const newGigMember = await gig_members.create(gigMember);
            res.status(201).json(newGigMember);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при попытке создания" });
        }
    },

    update: async (req, res) => {
        const id = req.params.id;
        const gigMember = req.body;
        try {
            await gig_members.update(gigMember, {
                where: { id: id },
            });
            res.json({ message: "Запись успешно обновлена" });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при попытке обновления" });
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;
        try {
            await gig_members.destroy({ where: { id: id } });
            res.json({ message: "Запись успешно удалена" });
        } catch (error) {
            res.status(500).json({ error: "Ошибка при попытке удаления" });
        }
    },
};

module.exports = GigMembersController;
