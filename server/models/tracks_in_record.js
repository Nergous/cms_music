module.exports = (sequelize, DataTypes) => {
    const tracks_in_record = sequelize.define("tracks_in_record", {
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
        id_record: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "record",
                key: "id"
            }
        }
    });
    return tracks_in_record
}