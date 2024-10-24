module.exports = (sequelize, DataTypes) => {
    const record = sequelize.define("record", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        record_name: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: false,
        },
        type_of_record: {
            type: DataTypes.ENUM("album", "EP", "single"),
            allowNull: false,
        },
        path_to_cover: {
            type: DataTypes.STRING,
            maxLength: 100,
            allowNull: false,
        },
        year_of_publish: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    });
    return record;
}