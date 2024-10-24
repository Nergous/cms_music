module.exports = (sequelize, DataTypes) => {
    const members = sequelize.define("members", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name_of_member: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        path_to_photo: {
            type: DataTypes.STRING,
            maxLength: 100,
            allowNull: false,
        },
        date_start: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        date_end: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        is_member: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    });

    return members;
};
