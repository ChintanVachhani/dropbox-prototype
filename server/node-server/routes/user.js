let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let User = require('../models/user');
let UserAccount = require('../models/userAccount');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let passport = require('passport');
let kafka = require('./kafka/client');

// User Sign up
router.post('/signup', function (req, res, next) {

  kafka.make_request('userTopic', {name: 'signup', body: req.body}, function (err, response) {
    console.log('in result--->');
    console.log(response);

    switch (response.status) {
      case 200:
        res.status(200).json(response);
        break;
      case 201:
        res.status(201).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 401:
        res.status(401).json(response);
        break;
      case 404:
        res.status(404).json(response);
        break;
      case 500:
        res.status(500).json(response);
        break;
    }
  });

  /*let user = {
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
      let userAccount = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        work: '',
        education: '',
        address: '',
        country: '',
        city: '',
        zipcode: '',
        interests: '',
      };
      UserAccount.create(userAccount);
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
    });*/
});

// User Sign in
router.post('/signin', function (req, res, next) {
  passport.authenticate('signin', function (err, response) {
    if (err) {
      return res.status(401).json(response);
    } else if (!response.userId) {
      return res.status(401).json(response);
    }
    res.status(200).json(response);
  })(req, res, next);
  /*User.find({where: {email: req.body.email}})
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
    });*/
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
router.get('/', function (req, res, next) {

  kafka.make_request('userTopic', {name: 'getUser', query: req.query, body: req.body}, function (err, response) {
    console.log('in result--->');
    console.log(response);

    switch (response.status) {
      case 200:
        res.status(200).json(response);
        break;
      case 201:
        res.status(201).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 401:
        res.status(401).json(response);
        break;
      case 404:
        res.status(404).json(response);
        break;
      case 500:
        res.status(500).json(response);
        break;
    }
  });

  /*User.find({attributes: ['firstName', 'lastName', 'email'], where: {email: req.query.userId}})
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
    });*/
});

// Get users
router.get('/search', function (req, res, next) {

  kafka.make_request('userTopic', {name: 'getUsers', query: req.query, body: req.body}, function (err, response) {
    console.log('in result--->');
    console.log(response);

    switch (response.status) {
      case 200:
        res.status(200).json(response);
        break;
      case 201:
        res.status(201).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 401:
        res.status(401).json(response);
        break;
      case 404:
        res.status(404).json(response);
        break;
      case 500:
        res.status(500).json(response);
        break;
    }
  });

  /*if (req.query.searchString.length > 0) {
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
  }*/
});

// Get user account
router.get('/account', function (req, res, next) {

  kafka.make_request('userTopic', {name: 'getUserAccount', query: req.query, body: req.body}, function (err, response) {
    console.log('in result--->');
    console.log(response);

    switch (response.status) {
      case 200:
        res.status(200).json(response);
        break;
      case 201:
        res.status(201).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 401:
        res.status(401).json(response);
        break;
      case 404:
        res.status(404).json(response);
        break;
      case 500:
        res.status(500).json(response);
        break;
    }
  });

  /*let decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  UserAccount.find({where: {email: req.query.userId}})
    .then((userAccount) => {
      res.status(200).json({
        message: 'User account successfully updated.',
        data: userAccount,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot update user account.',
        error: {message: 'User account not found.'},
      });
    });*/
});

// Update user account
router.patch('/account', function (req, res, next) {

  kafka.make_request('userTopic', {name: 'updateUserAccount', query: req.query, body: req.body}, function (err, response) {
    console.log('in result--->');
    console.log(response);

    switch (response.status) {
      case 200:
        res.status(200).json(response);
        break;
      case 201:
        res.status(201).json(response);
        break;
      case 400:
        res.status(400).json(response);
        break;
      case 401:
        res.status(401).json(response);
        break;
      case 404:
        res.status(404).json(response);
        break;
      case 500:
        res.status(500).json(response);
        break;
    }
  });

  /*let decoded = jwt.decode(req.query.token);
  if (req.body.email != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  User.find({where: {email: req.body.email}})
    .then((user) => {
      UserAccount.find({where: {email: req.body.email}})
        .then((userAccount) => {
          userAccount.updateAttributes({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            work: req.body.work,
            education: req.body.education,
            address: req.body.address,
            country: req.body.country,
            city: req.body.city,
            zipcode: req.body.zipcode,
            interests: req.body.interests,
          });
          res.status(200).json({
            message: 'User account successfully updated.',
            data: userAccount,
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
    });*/
});

module.exports = router;
