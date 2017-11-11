let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let activitySchema = new Schema({
  email: {type: String, required: true},
  log: {type: String, required: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);
