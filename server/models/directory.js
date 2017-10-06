import Sequelize from 'sequelize';
import sequelize from '../mysql';

var Directory = sequelize.define('directory', {
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
    type: Sequelize.STRING,
  },
});

Directory.sync()
  .then(() => {
    console.log("'directory' table successfully created.")
  })
  .catch(() => {
    console.log("'directory' table already exists or cannot be created.")
  });

module.exports = Directory;
