import serverConfig from '../config';

var path = require('path');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fs = require('fs-extra');

// User Sign up
router.post('/signup', function (req, res, next) {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  User.create(user)
    .then((user) => {
      // Creates root directory for the signed up user.
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'tmp'))
        .then(() => {
          console.log("Created root directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create root directory for " + user.email + ". Error: " + error);
        });

      res.status(201).json({
        message: 'Successfully signed up.',
        userId: user.email,
      });
    })
    .catch((error) => {
      res.status(400).json({
        title: 'Signing up failed.',
        error: {message: 'Invalid Data.'},
      });
    });
});

// User Sign in
router.post('/signin', function (req, res, next) {
  User.find({where: {email: req.body.email}})
    .then((user) => {
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: 'Signing in failed.',
          error: {message: 'Invalid credentials.'},
        });
      }
      var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
      res.status(200).json({
        message: 'Successfully signed in.',
        token: token,
        userId: user.email,
      });
    })
    .catch((error) => {
      res.status(401).json({
        title: 'Signing in failed.',
        error: {message: 'Invalid credentials.'},
      });
    });
});

module.exports = router;
