import Sequelize from 'sequelize';
import sequelize from '../mysql';

var Activity = sequelize.define('activity', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  log: {
    type: Sequelize.STRING,
  },
});

Activity.sync()
  .then(() => {
    console.log("'activity' table successfully created.")
  })
  .catch(() => {
    console.log("'activity' table already exists or cannot be created.")
  });

module.exports = Activity;
