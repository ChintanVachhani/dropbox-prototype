let serverConfig = require('../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let SharedDirectory = require('../../node-server/models/sharedDirectory');
let zipFolder = require('zip-folder');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'listAllSharedDirectories') {
    let decoded = jwt.decode(req.query.token);
    SharedDirectory.find({sharer: decoded.user.email, show: true})
      .then((sharedDirectories) => {
        res = {
          status: 200,
          message: 'Shared directories list retrieved successfully.',
          data: sharedDirectories,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve shared directories list.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getAllSharedDirectories') {
    let decoded = jwt.decode(req.query.token);
    SharedDirectory.find({sharer: decoded.user.email, path: cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name))})
      .then((sharedDirectories) => {
        res = {
          status: 200,
          message: 'Shared directories retrieved successfully.',
          data: sharedDirectories,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve shared directories.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'downloadSharedDirectory') {
    let decoded = jwt.decode(req.query.token);
    SharedDirectory.findOne({sharer: decoded.user.email, owner: req.body.owner, path: req.body.path, name: req.body.name})
      .then(() => {
        console.log(cryptr.decrypt(req.body.path));
        zipFolder(path.resolve(serverConfig.box.path, req.body.owner, cryptr.decrypt(req.body.path), req.body.name), path.resolve(serverConfig.box.path, req.body.owner, 'tmp', req.body.name) + '.zip', function (error) {
          if (error) {
            console.log("Directory cannot be zipped. " + error);
          } else {
            console.log('Directory zipped successfully.');
            fs.readFile(path.resolve(serverConfig.box.path, req.body.owner, 'tmp', req.body.name) + '.zip', 'base64', function (error, buffer) {
              if (error) {
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
                res = {
                  status: 200,
                  fileName: req.body.name,
                  buffer: buffer,
                };
                callback(null, res);
              }
            });
          }
        });
      })
      .catch(() => {
        res = {
          status: 401,
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'starSharedDirectory') {
    let decoded = jwt.decode(req.query.token);
    SharedDirectory.findById(req.body._id, function (error, sharedDirectory) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot star shared directory.',
          error: {message: 'Shared directory not found.'},
        };
        callback(null, res);
      }
      if (sharedDirectory.sharer != decoded.user.email) {
        res = {
          status: 401,
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        };
        callback(null, res);
      }
      sharedDirectory.starred = req.body.starred;
      sharedDirectory.save(function (error) {
        if (error) {
          console.error(error);
        }
        console.log("SharedDirectory updated!");
      });
      res = {
        status: 200,
        message: 'Shared directory successfully starred.',
        name: sharedDirectory.name,
      };
      callback(null, res);
    });
  }

}

exports.handle_request = handle_request;

