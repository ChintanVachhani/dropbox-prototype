import Sequelize from 'sequelize';
import sequelize from '../mysql';

let SharedFile = sequelize.define('sharedFile', {
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
  sharer: {
    type: Sequelize.STRING,
  },
  link: {
    type: Sequelize.TEXT,
  },
  show: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

SharedFile.sync()
  .then(() => {
    console.log("'sharedFile' table successfully created.")
  })
  .catch(() => {
    console.log("'sharedFile' table already exists or cannot be created.")
  });

module.exports = SharedFile;
