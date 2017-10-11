import Sequelize from 'sequelize';
import sequelize from '../mysql';

let User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.sync()
  .then(() => {
    console.log("'user' table successfully created.")
  })
  .catch(() => {
    console.log("'user' table already exists or cannot be created.")
  });

module.exports = User;
