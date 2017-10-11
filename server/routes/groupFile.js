import serverConfig from '../config';

let path = require('path');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let multer = require('multer');
let Group = require('../models/group');
let GroupMember = require('../models/groupMember');
let GroupFile = require('../models/groupFile');

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
  let decoded = jwt.decode(req.query.token);
  GroupMember.find({where: {groupId: group.id, email: decoded.user.email}})
    .then((groupMember) => {
      if (groupMember.email != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      GroupFile.findAll({where: {groupId: req.query.groupId}})
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
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot retrieve files from the group.',
        error: {message: 'Group member not found.'},
      });
    });
});

// Upload and save file
router.post('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);

  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(serverConfig.box.path, decoded.user.email, 'tmp'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
  });
  let upload = multer({storage: storage, limits: {fileSize: 1000000, files: 1}}).single('file');
  upload(req, res, function (error) {
    if (error) {
      console.error("Cannot upload file " + req.file.originalname + ". Error: " + error);
      return res.status(400).json({
        title: 'Cannot upload file.',
        error: error,
      });
    }
    Group.find({where: {id: req.body.groupId}})
      .then((group) => {
        GroupMember.find({where: {groupId: group.id, email: decoded.user.email}})
          .then((groupMember) => {
            if (groupMember.email != decoded.user.email) {
              return res.status(401).json({
                title: 'Not Authenticated.',
                error: {message: 'Users do not match.'},
              });
            }
            GroupFile.create({
              name: req.file.originalname,
              groupId: group.id,
              uploader: decoded.user.email,
            })
              .then((groupFile) => {
                fs.move(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.file.originalname), path.resolve(serverConfig.box.path, group.creator, 'groups', req.file.originalname))
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
              })
              .catch((error) => {
                console.error("Cannot create file. Error: " + error);
              });
          })
          .catch(() => {
            res.status(404).json({
              title: 'Cannot upload file to the group.',
              error: {message: 'Group member not found.'},
            });
          });
      })
      .catch(() => {
        res.status(404).json({
          title: 'Cannot upload file to the group.',
          error: {message: 'Group not found.'},
        });
      });

  });
});

// Download a file
router.get('/download', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  GroupMember.find({where: {groupId: group.id, email: decoded.user.email}})
    .then((groupMember) => {
      if (groupMember.email != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      Group.find({where: {id: req.body.groupId}})
        .then((group) => {
          res.download(path.resolve(serverConfig.box.path, group.creator, 'groups', req.query.name), req.query.name, function (err) {
            if (err) {
              console.log("File download failed.");
            } else {
              console.log("File downloaded successfully.");
            }
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot retrieve files from the group.',
        error: {message: 'Group member not found.'},
      });
    });
});

module.exports = router;
