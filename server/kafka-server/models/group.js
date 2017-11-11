let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
  name: {type: String, required: true},
  creator: {type: String, required: true}
});

module.exports = mongoose.model('Group', groupSchema);
