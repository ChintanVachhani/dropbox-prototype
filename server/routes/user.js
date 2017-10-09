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
    .catch(() => {
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
    .catch(() => {
      res.status(401).json({
        title: 'Signing in failed.',
        error: {message: 'Invalid credentials.'},
      });
    });
});

// Session Authentication
router.use('/', function (req, res, next) {
  jwt.verify(req.query.token, 'secret', function (error, decoded) {
    if (error) {
      return res.status(401).json({
        title: 'Not Authenticated.',
        error: error,
      });
    }
    next();
  });
});

// get users
router.get('/', function (req, res, next) {
  if (req.query.searchString.length > 0) {
    User.findAll({
      attributes: ['firstName', 'lastname', 'email'],
      where: {
        $or: {
          firstName: {$like: '%' + req.query.searchString + '%'},
          lastname: {$like: '%' + req.query.searchString + '%'},
          email: {$like: '%' + req.query.searchString + '%'},
        },
      },
    })
      .then((users) => {
        res.status(200).json({
          message: 'Users retrieved successfully.',
          data: users,
        });
      })
      .catch(() => {
        res.status(500).json({
          title: 'Cannot retrieve users.',
          error: {message: 'Internal Server Error.'},
        });
      });
  } else {
    res.status(200).json({
      message: 'No search string.',
      data: [],
    });
  }
});

module.exports = router;
