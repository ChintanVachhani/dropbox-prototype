let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator'); //mongoose plugin that provides extra validation check for unique values

let userAccountSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  work: {type: String},
  education: {type: String},
  address: {type: String},
  country: {type: String},
  city: {type: String},
  zipcode: {type: String},
  interests: {type: String},
});

userAccountSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('UserAccount', userAccountSchema);
