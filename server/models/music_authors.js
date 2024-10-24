module.exports = (sequelize, DataTypes) => {
    const music_authors = sequelize.define("music_authors", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_track: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "tracks",
                key: "id"
            }
        },
        id_member: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "members",
                key: "id"
            }
        },
    });
    return music_authors;
};
