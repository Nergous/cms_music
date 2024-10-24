module.exports = (sequelize, DataTypes) => {
    const music_roles = sequelize.define("music_roles", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role_name: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: false,
        }
    });
    return music_roles;
}