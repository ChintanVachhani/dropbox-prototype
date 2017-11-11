let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let directorySchema = new Schema({
  name: {type: String, required: true},
  path: {type: String, required: true},
  owner: {type: String, required: true},
  starred: {type: Boolean, default: false},
  shared: {type: Boolean, default: false},
  link: {type: String},
  show: {type: Boolean, default: false}
});

module.exports = mongoose.model('Directory', directorySchema);
