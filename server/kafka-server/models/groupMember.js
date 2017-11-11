let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupMemberSchema = new Schema({
  email: {type: String, required: true},
  groupId: {type: String, required: true}
});

module.exports = mongoose.model('GroupMember', groupMemberSchema);
