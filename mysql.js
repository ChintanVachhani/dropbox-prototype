let Sequelize = require('sequelize');
let serverConfig = require('./config');

// Database Setup
let sequelize = new Sequelize(serverConfig.database.name, serverConfig.database.username, serverConfig.database.password, {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
