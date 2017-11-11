let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupFileSchema = new Schema({
  name: {type: String, required: true},
  groupId: {type: String, required: true},
  uploader: {type: String, required: true}
});

module.exports = mongoose.model('GroupFile', groupFileSchema);
