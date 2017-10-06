import serverConfig from '../config';

var path = require('path');
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fs = require('fs-extra');
var Directory = require('../models/directory');
var zipFolder = require('zip-folder');

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

// Download a directory
router.get('/download', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  console.log(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name));
  zipFolder(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', function (error) {
    if (error) {
      console.log("Directory cannot be zipped. " + error);
    } else {
      console.log('Directory zipped successfully.');
      res.download(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', req.query.name + '.zip', function (err) {
        if (err) {
          console.log("Directory download failed.");
        } else {
          fs.remove(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip')
            .then(() => {
              console.log("Deleted zipped directory.");
            })
            .catch(() => {
              console.log("Cannot delete zipped directory.");
            });
          console.log("Directory downloaded successfully.");
        }
      });
    }
  });
});

// Get all directories
router.get('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  Directory.findAll({where: {owner: decoded.user.email, path: req.query.path}})
    .then((directories) => {
      res.status(200).json({
        message: 'Directories retrieved successfully.',
        data: directories,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve directories.',
        error: {message: 'Internal server error.'},
      });
    });
});

// Create a directory
router.put('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  if (req.body.owner != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  var directoryExists = false;
  var directoryName = req.body.name;
  var index = 0;
  do {
    directoryExists = false;
    if (fs.pathExistsSync(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directoryName))) {
      ++index;
      directoryName = req.body.name + " (" + index + ")";
      directoryExists = true;
    }
  } while (directoryExists);
  var directory = {
    name: directoryName,
    path: req.body.path,
    owner: req.body.owner,
  };

  if (!directoryExists) {
    fs.ensureDir(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name))
      .then(() => {
        console.log("Created directory " + directory.name);
        Directory.create(directory)
          .then((directory) => {
            res.status(201).json({
              message: 'Directory successfully created.',
              name: directory.name,
            });
          })
          .catch((error) => {
            res.status(400).json({
              title: 'Cannot create directory.',
              error: {message: 'Invalid Data.'},
            });
          });
      })
      .catch((error) => {
        console.error("Cannot create directory " + req.body.name + ". Error: " + +error);
        res.status(400).json({
          title: 'Cannot create directory.',
          error: {message: 'Invalid Data.'},
        });
      });
  }
});

// Rename a directory
router.patch('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name))
        .then((exists) => {
          if (exists) {
            fs.rename(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name), path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.body.name))
              .then(() => {
                directory.updateAttributes({
                  name: req.body.name,
                });
                res.status(200).json({
                  message: 'Directory successfully renamed.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                console.log("here");
                res.status(500).json({
                  title: 'Cannot rename directory.',
                  error: {message: 'Internal server error.'},
                });
              })

          } else {
            res.status(404).json({
              title: 'Cannot rename directory.',
              error: {message: 'Directory not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot rename directory.',
            error: {message: 'Internal server error.'},
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot rename directory.',
        error: {message: 'Directory not found.'},
      });
    });
});

// Delete a directory
router.delete('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.body.name))
        .then((exists) => {
          if (exists) {
            fs.remove(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.body.name))
              .then(() => {
                Directory.destroy({where: {name: req.body.name, path: req.body.path, owner: req.body.owner}});
                console.log("Deleted directory " + req.body.name);
                res.status(200).json({
                  message: 'Directory successfully deleted.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                res.status(500).json({
                  title: 'Cannot delete directory.',
                  error: {message: 'Internal server error.'},
                });
              })
          } else {
            res.status(404).json({
              title: 'Cannot delete directory.',
              error: {message: 'Directory not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot delete directory.',
            error: {message: 'Internal server error.'},
          });
        })
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot delete directory.',
        error: {message: 'Directory not found.'},
      });
    });
});

module.exports = router;
