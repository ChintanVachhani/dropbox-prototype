import Sequelize from 'sequelize';
import sequelize from '../mysql';

let Group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  creator: {
    type: Sequelize.STRING,
  },
});

Group.sync()
  .then(() => {
    console.log("'group' table successfully created.")
  })
  .catch(() => {
    console.log("'group' table already exists or cannot be created.")
  });

module.exports = Group;
