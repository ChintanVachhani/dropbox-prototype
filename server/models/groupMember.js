import Sequelize from 'sequelize';
import sequelize from '../mysql';

let GroupMember = sequelize.define('groupMember', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
  },
});

GroupMember.sync()
  .then(() => {
    console.log("'groupMember' table successfully created.")
  })
  .catch(() => {
    console.log("'groupMember' table already exists or cannot be created.")
  });

module.exports = GroupMember;
