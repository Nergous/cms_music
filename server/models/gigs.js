module.exports = (sequelize, DataTypes) => {
    const gigs = sequelize.define("gigs", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            maxLength: 50,
            allowNull: false,
        },
        link_to_social: {
            type: DataTypes.STRING,
            allowNull: false,
            maxLength: 100,
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false,
            maxLength: 100,
        },
        date_of_gig: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gig_status: {
            type: DataTypes.ENUM("soon", "completed", "canceled"),
            allowNull: false,
        },
        path_to_poster: {
            type: DataTypes.STRING,
            allowNull: false,
            maxLength: 100,
        }

    });
    return gigs;
}