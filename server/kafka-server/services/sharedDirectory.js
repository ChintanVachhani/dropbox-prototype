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
    SharedDirectory.findAll({where: {sharer: decoded.user.email, show: true}})
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
    SharedDirectory.findAll({where: {sharer: decoded.user.email, path: cryptr.encrypt(path.join(cryptr.decrypt(req.query.path),req.query.name))}})
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

  }

  if (req.name === 'starSharedDirectory') {
    let decoded = jwt.decode(req.query.token);
    SharedDirectory.find({where: {id: req.body.id}})
      .then((sharedDirectory) => {
        if (sharedDirectory.sharer != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        sharedDirectory.updateAttributes({
          starred: req.body.starred,
        });
        res = {
          status: 200,
          message: 'Shared directory successfully starred.',
          name: sharedDirectory.name,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot star shared directory.',
          error: {message: 'Shared directory not found.'},
        };
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;

