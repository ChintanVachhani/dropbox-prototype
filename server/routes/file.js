import serverConfig from '../config';

var path = require('path');
var express = require('express');
var router = express.Router();
var Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
var jwt = require('jsonwebtoken');
var fs = require('fs-extra');
var multer = require('multer');
var File = require('../models/file');
var SharedFile = require('../models/sharedFile');

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

// Get all files
router.get('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  File.findAll({where: {owner: decoded.user.email, path: req.query.path}})
    .then((files) => {
      res.status(200).json({
        message: 'Files retrieved successfully.',
        data: files,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve files.',
        error: {message: 'Internal server error.'},
      });
    });
});

// Download a file
router.get('/download', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  res.download(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), req.query.name, function (err) {
    if (err) {
      console.log("File download failed.");
    } else {
      console.log("File downloaded successfully.");
    }
  });
});

// Upload and save file
router.post('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(serverConfig.box.path, decoded.user.email, 'tmp'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  });
  var upload = multer({storage: storage, limits: {fileSize: 1000000, files: 1}}).single('file');
  upload(req, res, function (error) {
    console.log(req.body.owner + " " + decoded.user.email);
    if (req.body.owner != decoded.user.email) {
      return res.status(401).json({
        title: 'Not Authenticated.',
        error: {message: 'Users do not match.'},
      });
    }
    if (error) {
      console.error("Cannot upload file " + req.file.originalname + ". Error: " + error);
      return res.status(400).json({
        title: 'Cannot upload file.',
        error: error,
      });
    }

    File.findOrCreate({
      where: {
        name: req.file.originalname,
        path: req.body.path,
        owner: req.body.owner,
      },
    })
      .then((file) => {
        console.log('File successfully created.');
      })
      .catch((error) => {
        console.error("Cannot create file. Error: " + error);
      });
    fs.move(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.file.originalname), path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.file.originalname), {overwrite: true})
      .then(() => {
        console.log("Saved file " + req.file.originalname);
      })
      .catch((error) => {
        console.error("Could not save file " + req.file.originalname + ". Error: " + error);
      });
    console.log("Uploaded file " + req.file.originalname);
    res.status(201).json({
      message: 'File successfully uploaded.',
      name: req.file.originalname,
    });
  });
});

// Star a file
router.patch('/star', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      file.updateAttributes({
        starred: true,
      });
      res.status(200).json({
        message: 'File successfully starred.',
        name: file.name,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot star file.',
        error: {message: 'File not found.'},
      });
    });
});

// Share a file
router.patch('/share', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      for (var i = 0, len = req.body.sharers.length; i < len; i++) {
        var sharer = req.body.sharers[i];
        SharedFile.findOrCreate({
          where: {
            name: req.body.name,
            path: req.body.path,
            owner: req.body.owner,
            sharer: sharer,
          },
          defaults: {
            path: cryptr.encrypt(req.body.path),
            sharer: sharer,
          },
        }).spread((sharedFile, created) => {
          if (created) {
            console.log("Shared file created.");
          }
        });
      }
      file.updateAttributes({
        shared: true,
      });
      res.status(200).json({
        message: 'File successfully shared.',
        name: file.name,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot share file.',
        error: {message: 'File not found.'},
      });
    });
})
;

// Rename a file
router.patch('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, file.name))
        .then((exists) => {
          if (exists) {
            fs.rename(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, file.name), path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.body.name))
              .then(() => {
                file.updateAttributes({
                  name: req.body.name,
                });
                res.status(200).json({
                  message: 'File successfully renamed.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                console.log("here");
                res.status(500).json({
                  title: 'Cannot rename file.',
                  error: {message: 'Internal server error.'},
                });
              })

          } else {
            res.status(404).json({
              title: 'Cannot rename file.',
              error: {message: 'File not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot rename file.',
            error: {message: 'Internal server error.'},
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot rename file.',
        error: {message: 'File not found.'},
      });
    });
});

// Delete a file
router.delete('/', function (req, res, next) {
  var decoded = jwt.decode(req.query.token);
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
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
                File.destroy({where: {name: req.body.name, path: req.body.path, owner: req.body.owner}});
                console.log("Deleted file " + req.body.name);
                res.status(200).json({
                  message: 'File successfully deleted.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                res.status(500).json({
                  title: 'Cannot delete file.',
                  error: {message: 'Internal server error.'},
                });
              })
          } else {
            res.status(404).json({
              title: 'Cannot delete file.',
              error: {message: 'File not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot delete file.',
            error: {message: 'Internal server error.'},
          });
        })
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot delete file.',
        error: {message: 'File not found.'},
      });
    });
});

module.exports = router;
