module.exports = (sequelize, DataTypes) => {
    const tracks = sequelize.define("tracks", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        track_name: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: false,
        },
        path_to_file: {
            type: DataTypes.STRING,
            maxLength: 100,
            allowNull: false,
        },
        lyrics_author: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "members",
                key: "id",
            },
        },
    });
    return tracks;
};
