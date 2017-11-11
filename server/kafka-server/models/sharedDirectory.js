let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sharedDirectorySchema = new Schema({
  name: {type: String, required: true},
  path: {type: String, required: true},
  owner: {type: String, required: true},
  starred: {type: Boolean, default: false},
  sharer: {type: String, required: true},
  link: {type: String},
  show: {type: Boolean, default: false}
});

module.exports = mongoose.model('SharedDirectory', sharedDirectorySchema);
