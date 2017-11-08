let serverConfig = require('../../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let multer = require('multer');
let File = require('../../models/file');
let SharedFile = require('../../models/sharedFile');
let Activity = require('../../models/activity');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getFileByLink') {
  }

  if (req.name === 'getAllFiles') {
    let decoded = jwt.decode(req.query.token);
    File.findAll({where: {owner: decoded.user.email, path: path.join(req.query.path)}})
      .then((files) => {
        res = {
          status: 200,
          message: 'Files retrieved successfully.',
          data: files,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve files.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getAllStaredFiles') {
  }

  if (req.name === 'createShareableLink') {
  }

  if (req.name === 'downloadFile') {
  }

  if (req.name === 'uploadAndSaveFile') {
  }

  if (req.name === 'starFile') {
  }

  if (req.name === 'shareFile') {
  }

  if (req.name === 'renameFile') {
  }

  if (req.name === 'deleteFile') {
  }

}

exports.handle_request = handle_request;
