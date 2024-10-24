module.exports = (sequelize, DataTypes) => {
    const gig_members = sequelize.define("gig_members", {
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
        id_gig: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "gigs",
                key: "id"
            }
        }
    });
    return gig_members;
}