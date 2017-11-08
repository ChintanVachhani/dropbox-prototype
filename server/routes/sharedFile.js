let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let SharedFile = require('../models/sharedFile');
let kafka = require('./kafka/client');

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

// List all shared files
router.get('/list', function (req, res, next) {

  kafka.make_request('sharedFileTopic', {name: 'listAllSharedFiles', query: req.query, body: req.body}, function (err, response) {
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
  SharedFile.findAll({where: {sharer: decoded.user.email, show: true}})
    .then((sharedFiles) => {
      res.status(200).json({
        message: 'Shared files list retrieved successfully.',
        data: sharedFiles,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve shared files list.',
        error: {message: 'Internal server error.'},
      });
    });*/
});

// Get all shared files
router.get('/', function (req, res, next) {

  kafka.make_request('sharedFileTopic', {name: 'getAllSharedFiles', query: req.query, body: req.body}, function (err, response) {
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
  console.log(cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name)));
  SharedFile.findAll({where: {sharer: decoded.user.email, path: cryptr.encrypt(path.join(cryptr.decrypt(req.query.path), req.query.name))}})
    .then((sharedFiles) => {
      res.status(200).json({
        message: 'Shared files retrieved successfully.',
        data: sharedFiles,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve shared files.',
        error: {message: 'Internal server error.'},
      });
    });*/
});

// Download a shared file
router.post('/download', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  SharedFile.find({where: {sharer: decoded.user.email, owner: req.body.owner, path: req.body.path, name: req.body.name}})
    .then(() => {
      res.download(path.resolve(serverConfig.box.path, decoded.user.email, cryptr.decrypt(req.body.path), req.body.name), req.body.name, function (err) {
        if (err) {
          console.log("File download failed.");
        } else {
          console.log("File downloaded successfully.");
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

// Star a shared file
router.patch('/star', function (req, res, next) {

  kafka.make_request('sharedFileTopic', {name: 'starSharedFile', query: req.query, body: req.body}, function (err, response) {
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
  SharedFile.find({where: {id: req.body.id}})
    .then((sharedFile) => {
      if (sharedFile.sharer != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      sharedFile.updateAttributes({
        starred: req.body.starred,
      });
      res.status(200).json({
        message: 'Shared file successfully starred.',
        name: sharedFile.name,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot star shared file.',
        error: {message: 'Shared file not found.'},
      });
    });*/
});

module.exports = router;
