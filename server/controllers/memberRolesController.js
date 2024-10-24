const { member_roles } = require("../models");

const MemberRolesController = {
    getAll: async (req, res) => {
        try {
            const listOfMemberRoles = await member_roles.findAll();
            res.json(listOfMemberRoles);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при получении списка ролей участников",
            });
        }
    },

    create: async (req, res) => {
        try {
            const memRole = req.body;
            const createdMemRole = await member_roles.create(memRole);
            res.json(createdMemRole);
        } catch (error) {
            res.status(500).json({
                error: "Ошибка при создании роли участника",
            });
        }
    },
};

module.exports = MemberRolesController;
