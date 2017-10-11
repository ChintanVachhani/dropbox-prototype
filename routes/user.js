let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let User = require('../models/user');
let UserAccount = require('../models/userAccount');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');

// User Sign up
router.post('/signup', function (req, res, next) {
  let user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  User.create(user)
    .then((user) => {
      // Creates root directory for the signed up user.
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'root'))
        .then(() => {
          console.log("Created root directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create root directory for " + user.email + ". Error: " + error);
        });
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'tmp'))
        .then(() => {
          console.log("Created tmp directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create tmp directory for " + user.email + ". Error: " + error);
        });
      fs.ensureDir(path.resolve(serverConfig.box.path, user.email, 'groups'))
        .then(() => {
          console.log("Created group directory for " + user.email);
        })
        .catch((error) => {
          console.error("Cannot create group directory for " + user.email + ". Error: " + error);
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
      let token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
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

// Get user
router.get('/:userId', function (req, res, next) {
  User.find({attributes: ['firstName', 'lastname', 'email'], where: {email: req.body.userId}})
    .then((user) => {
      res.status(200).json({
        message: 'Successfully retrieved user information.',
        data: user,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot retrieve user information.',
        error: {message: 'User not found.'},
      });
    });
});

// Get users
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

router.patch('/account', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.body.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  User.find({where: {email: req.body.userId}})
    .then((user) => {
      UserAccount.find({where: {email: req.body.userId}})
        .then((userAccount) => {
          userAccount.updateAttributes({
            overview: req.body.overview,
            work: req.body.work,
            education: req.body.education,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            zipcode: req.body.zipcode,
            interests: req.bo.interests,
          });
          res.status(200).json({
            message: 'User account successfully updated.',
            userId: userAccount.email,
          });
        })
        .catch(() => {
          res.status(404).json({
            title: 'Cannot update user account.',
            error: {message: 'User account not found.'},
          });
        })
        .catch(() => {
          res.status(404).json({
            title: 'Cannot update user account.',
            error: {message: 'User not found.'},
          });
        });
    });
});
module.exports = router;
