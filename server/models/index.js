'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

const {
    members,
    music_roles,
    member_roles,
    record,
    tracks,
    tracks_in_record,
    gigs,
    gig_members,
    music_authors,
} = db;

members.belongsToMany(music_roles, {through: member_roles, foreignKey: 'id_member'});
music_roles.belongsToMany(members, {through: member_roles, foreignKey: 'id_role'});

record.belongsToMany(tracks, {through: tracks_in_record, foreignKey: 'id_record', as: 'tracks'});
tracks.belongsToMany(record, {through: tracks_in_record, foreignKey: 'id_track', as: 'records'});

gigs.belongsToMany(members, {through: gig_members, foreignKey: 'id_gig'});
members.belongsToMany(gigs, {through: gig_members, foreignKey: 'id_member'});

tracks.belongsToMany(members, {through: music_authors, foreignKey: 'id_track', as: 'authors'});
members.belongsToMany(tracks, {through: music_authors, foreignKey: 'id_member', as: 'authored'});

members.hasMany(tracks, { foreignKey: 'lyrics_author', sourceKey: 'id', as: 'lyrics_author' });
tracks.belongsTo(members, { foreignKey: 'lyrics_author', targetKey: 'id', as: 'lyrics_authored' });


module.exports = db;
