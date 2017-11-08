let serverConfig = require('../../config');

let path = require('path');
let User = require('../../models/user');
let UserAccount = require('../../models/userAccount');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'signin') {
    User.find({where: {email: req.body.email}})
      .then((user) => {
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res = {
            status: 401,
            title: 'Signing in failed.',
            error: {message: 'Invalid credentials.'},
          };
          callback(null, res);
        } else {
          let token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
          res = {
            status: 200,
            message: 'Successfully signed in.',
            token: token,
            userId: user.email,
          };
          callback(null, res);
        }
      })
      .catch(() => {
        res = {
          status: 401,
          title: 'Signing in failed.',
          error: {message: 'Invalid credentials.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'signup') {
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
        res = {
          status: 201,
          message: 'Successfully signed up.',
          userId: user.email,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 400,
          title: 'Signing up failed.',
          error: {message: 'Invalid Data.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getUser') {
    User.find({attributes: ['firstName', 'lastName', 'email'], where: {email: req.query.userId}})
      .then((user) => {
        res = {
          status: 200,
          message: 'Successfully retrieved user information.',
          data: user,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot retrieve user information.',
          error: {message: 'User not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getUsers') {
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
          res = {
            status: 200,
            message: 'Users retrieved successfully.',
            data: users,
          };
          callback(null, res);
        })
        .catch(() => {
          res = {
            status: 500,
            title: 'Cannot retrieve users.',
            error: {message: 'Internal Server Error.'},
          };
          callback(null, res);
        });
    } else {
      res = {
        status: 200,
        message: 'No search string.',
        data: [],
      };
      callback(null, res);
    }
  }

  if (req.name === 'getUserAccount') {
    let decoded = jwt.decode(req.query.token);
    if (req.query.userId != decoded.user.email) {
      res = {
        status: 401,
        title: 'Not Authenticated.',
        error: {message: 'Users do not match.'},
      };
      callback(null, res);
    }
    UserAccount.find({where: {email: req.query.userId}})
      .then((userAccount) => {
        res = {
          status: 200,
          message: 'User account successfully updated.',
          data: userAccount,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot update user account.',
          error: {message: 'User account not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'updateUserAccount') {
    let decoded = jwt.decode(req.query.token);
    if (req.body.email != decoded.user.email) {
      res = {
        status: 401,
        title: 'Not Authenticated.',
        error: {message: 'Users do not match.'},
      };
      callback(null, res);
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
            res = {
              status: 200,
              message: 'User account successfully updated.',
              data: userAccount,
            };
            callback(null, res);
          })
          .catch(() => {
            res = {
              status: 404,
              title: 'Cannot update user account.',
              error: {message: 'User account not found.'},
            };
            callback(null, res);
          })
          .catch(() => {
            res = {
              status: 404,
              title: 'Cannot update user account.',
              error: {message: 'User not found.'},
            };
            callback(null, res);
          });
      });
  }

}

exports.handle_request = handle_request;
