let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator'); //mongoose plugin that provides extra validation check for unique values

let userSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true}
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);
