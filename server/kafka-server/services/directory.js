let serverConfig = require('../../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let Directory = require('../../models/directory');
let SharedDirectory = require('../../models/sharedDirectory');
let Activity = require('../../models/activity');
let File = require('../../models/file');
let SharedFile = require('../../models/sharedFile');
let zipFolder = require('zip-folder');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getDirectoryByLink') {
  }

  if (req.name === 'getAllDirectories') {
    let decoded = jwt.decode(req.query.token);
    Directory.findAll({where: {owner: decoded.user.email, path: req.query.path}})
      .then((directories) => {
        res = {
          status: 200,
          message: 'Directories retrieved successfully.',
          data: directories,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve directories.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getAllStaredDirectories') {
  }

  if (req.name === 'createShareableLink') {
  }

  if (req.name === 'downloadDirectory') {
  }

  if (req.name === 'createDirectory') {
  }

  if (req.name === 'starDirectory') {
  }

  if (req.name === 'shareDirectory') {
  }

  if (req.name === 'renameDirectory') {
  }

  if (req.name === 'deleteDirectory') {
  }

}

exports.handle_request = handle_request;
