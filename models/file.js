let Sequelize = require('sequelize');
let sequelize = require('../mysql');

let File = sequelize.define('file', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  path: {
    type: Sequelize.STRING,
  },
  owner: {
    type: Sequelize.STRING,
  },
  starred: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  shared: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  link: {
    type: Sequelize.TEXT,
  },
  show: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

File.sync()
  .then(() => {
    console.log("'file' table successfully created.")
  })
  .catch(() => {
    console.log("'file' table already exists or cannot be created.")
  });

module.exports = File;
