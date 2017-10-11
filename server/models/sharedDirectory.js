import Sequelize from 'sequelize';
import sequelize from '../mysql';

let SharedDirectory = sequelize.define('sharedDirectory', {
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

SharedDirectory.sync()
  .then(() => {
    console.log("'sharedDirectory' table successfully created.")
  })
  .catch(() => {
    console.log("'sharedDirectory' table already exists or cannot be created.")
  });

module.exports = SharedDirectory;
