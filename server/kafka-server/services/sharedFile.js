let serverConfig = require('../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let SharedFile = require('../models/sharedFile');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'listAllSharedFiles') {
    let decoded = jwt.decode(req.query.token);
    SharedFile.find({sharer: decoded.user.email, show: true})
      .then((sharedFiles) => {
        res = {
          status: 200,
          message: 'Shared files list retrieved successfully.',
          data: sharedFiles,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve shared files list.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getAllSharedFiles') {
    let decoded = jwt.decode(req.query.token);
    console.log(cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name)));
    SharedFile.find({sharer: decoded.user.email, path: cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name))})
      .then((sharedFiles) => {
        res = {
          status: 200,
          message: 'Shared files retrieved successfully.',
          data: sharedFiles,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve shared files.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'downloadSharedFile') {
    let decoded = jwt.decode(req.query.token);
    SharedFile.findOne({sharer: decoded.user.email, owner: req.body.owner, path: req.body.path, name: req.body.name})
      .then(() => {
        fs.readFile(path.resolve(serverConfig.box.path, decoded.user.email, cryptr.decrypt(req.body.path), req.body.name), 'base64', function (error, buffer) {
          if (error) {
            console.log("File download failed.");
          } else {
            console.log("File downloaded successfully.");
            res = {
              status: 200,
              fileName: req.body.name,
              buffer: buffer,
            };
            callback(null, res);
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

  if (req.name === 'starSharedFile') {
    let decoded = jwt.decode(req.query.token);
    SharedFile.findById(req.body._id, function (error, sharedFile) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot star shared file.',
          error: {message: 'Shared file not found.'},
        };
        callback(null, res);
      }
      if (sharedFile.sharer != decoded.user.email) {
        res = {
          status: 401,
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        };
        callback(null, res);
      }
      sharedFile.starred = req.body.starred;
      sharedFile.save(function (error) {
        if (error) {
          console.error(error);
        }
        console.log("SharedFile updated!");
      });
      res = {
        status: 200,
        message: 'Shared file successfully starred.',
        name: sharedFile.name,
      };
      callback(null, res);
    });
  }

}

exports.handle_request = handle_request;
