module.exports = (sequelize, DataTypes) => {
    const member_roles = sequelize.define("member_roles", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_member: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "members",
                key: "id"
            }
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "music_roles",
                key: "id"
            }
        }
    });
    return member_roles;
}