let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let kafka = require('./kafka/client');

module.exports = function (passport) {
  passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, function (username, password, done) {
    console.log('in passport', username);
    kafka.make_request('userTopic', {name: 'signin', body: {email: username, password: password}}, function (err, response) {
      console.log('in result--->');
      console.log(response);
      if (err) {
        done(err, response);
      }
      else {
        if (response.status == 200) {
          done(null, response);
        }
        else {
          done(null, response);
        }
      }
    });
  }));
};


