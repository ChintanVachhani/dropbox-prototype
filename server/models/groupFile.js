import Sequelize from 'sequelize';
import sequelize from '../mysql';

let GroupFile = sequelize.define('groupFile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  groupId: {
    type: Sequelize.STRING,
  },
  uploader: {
    type: Sequelize.STRING,
  },
});

GroupFile.sync()
  .then(() => {
    console.log("'groupFile' table successfully created.")
  })
  .catch(() => {
    console.log("'groupFile' table already exists or cannot be created.")
  });

module.exports = GroupFile;
