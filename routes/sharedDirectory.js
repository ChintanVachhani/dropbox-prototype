let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let SharedDirectory = require('../models/sharedDirectory');

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

// List all shared directories
router.get('/list', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  SharedDirectory.findAll({where: {sharer: decoded.user.email}})
    .then((sharedDirectories) => {
      res.status(200).json({
        message: 'Shared directories list retrieved successfully.',
        data: sharedDirectories,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve shared directories list.',
        error: {message: 'Internal server error.'},
      });
    });
});

// Get all shared directories
router.get('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  SharedDirectory.findAll({where: {sharer: decoded.user.email, path: req.query.path}})
    .then((sharedDirectories) => {
      res.status(200).json({
        message: 'Shared directories retrieved successfully.',
        data: sharedDirectories,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve shared directories.',
        error: {message: 'Internal server error.'},
      });
    });
});

// Download a shared directory
router.post('/download', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  SharedDirectory.find({where: {sharer: decoded.user.email, owner: req.body.owner, path: req.body.path, name: req.body.name}})
    .then(() => {
      zipFolder(path.resolve(serverConfig.box.path, req.body.owner, cryptr.decrypt(req.body.path), req.body.name), path.resolve(serverConfig.box.path, req.body.owner, 'tmp', req.body.name) + '.zip', function (error) {
        if (error) {
          console.log("Directory cannot be zipped. " + error);
        } else {
          console.log('Directory zipped successfully.');
          res.download(path.resolve(serverConfig.box.path, req.body.owner, 'tmp', req.body.name) + '.zip', req.body.name + '.zip', function (err) {
            if (err) {
              console.log("Directory download failed.");
            } else {
              fs.remove(path.resolve(serverConfig.box.path, req.body.owner, 'tmp', req.body.name) + '.zip')
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
    })
    .catch(() => {
      return res.status(401).json({
        title: 'Not Authenticated.',
        error: {message: 'Users do not match.'},
      });
    });
});

// Star a shared directory
router.patch('/star', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  SharedDirectory.find({where: {id: req.body.id}})
    .then((sharedDirectory) => {
      if (sharedDirectory.sharer != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      sharedDirectory.updateAttributes({
        starred: true,
      });
      res.status(200).json({
        message: 'Shared directory successfully starred.',
        name: sharedDirectory.name,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot star shared directory.',
        error: {message: 'Shared directory not found.'},
      });
    });
});

module.exports = router;
