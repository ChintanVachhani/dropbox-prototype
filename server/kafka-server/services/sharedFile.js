let serverConfig = require('../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let SharedFile = require('../../node-server/models/sharedFile');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'listAllSharedFiles') {
    let decoded = jwt.decode(req.query.token);
    SharedFile.findAll({where: {sharer: decoded.user.email, show: true}})
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
    SharedFile.findAll({where: {sharer: decoded.user.email, path: cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name))}})
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
  }

  if (req.name === 'starSharedFile') {
    let decoded = jwt.decode(req.query.token);
    SharedFile.find({where: {id: req.body.id}})
      .then((sharedFile) => {
        if (sharedFile.sharer != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        sharedFile.updateAttributes({
          starred: req.body.starred,
        });
        res = {
          status: 200,
          message: 'Shared file successfully starred.',
          name: sharedFile.name,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot star shared file.',
          error: {message: 'Shared file not found.'},
        };
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;
