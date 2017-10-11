let Sequelize = require('sequelize');
let sequelize = require('../mysql');

let UserAccount = sequelize.define('userAccount', {
  email: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  overview: {
    type: Sequelize.TEXT,
  },
  work: {
    type: Sequelize.STRING,
  },
  education: {
    type: Sequelize.STRING,
  },
  address: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  zipcode: {
    type: Sequelize.INTEGER,
  },
  interests: {
    type: Sequelize.TEXT,
  },
});

UserAccount.sync()
  .then(() => {
    console.log("'userAccount' table successfully created.")
  })
  .catch(() => {
    console.log("'userAccount' table already exists or cannot be created.")
  });

module.exports = UserAccount;
