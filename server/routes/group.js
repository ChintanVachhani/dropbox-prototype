import serverConfig from '../config';

let path = require('path');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let Group = require('../models/group');
let GroupMember = require('../models/groupMember');

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

// Create a group
router.put('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.body.creator != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  Group.findOrCreate({where: {name: req.body.name, creator: req.body.creator}})
    .spread((group, created) => {
      if (created) {
        fs.ensureDir(path.resolve(serverConfig.box.path, decoded.user.email, 'groups', group.name))
          .then(() => {
            console.log("Created group " + group.name);
            GroupMember.findOrCreate({where: {groupId: group.id, email: decoded.user.email}})
              .spread((groupMember, created) => {
                if (created) {
                  console.log({
                    message: 'Group member successfully added.',
                    name: groupMember.email,
                  });
                }
              })
          })
          .catch((error) => {
            console.error("Cannot create group " + group.name + ". Error: " + +error);
            return res.status(400).json({
              title: 'Cannot create group.',
              error: {message: 'Invalid Data.'},
            });
          });
        res.status(201).json({
          message: 'Group successfully created.',
          name: group.name,
        });
      } else {
        res.status(400).json({
          message: 'Cannot create group.',
          error: {message: 'Group already exists.'},
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        title: 'Cannot create group.',
        error: {message: 'Invalid Data.'},
      });
    });
});

// Delete a group
router.delete('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Group.find({where: {id: req.body.id}})
    .then((group) => {
      if (group.creator != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, decoded.user.email, 'groups', group.name))
        .then((exists) => {
          if (exists) {
            fs.remove(path.resolve(serverConfig.box.path, decoded.user.email, 'groups', group.name))
              .then(() => {
                Group.destroy({where: {id: req.body.id}});
                GroupMember.destroy({where: {groupId: req.body.id}});
                console.log("Deleted group " + group.name);
                res.status(200).json({
                  message: 'Group successfully deleted.',
                  name: group.name,
                });
              })
              .catch(() => {
                res.status(500).json({
                  title: 'Cannot delete group.',
                  error: {message: 'Internal server error.'},
                });
              })
          } else {
            res.status(404).json({
              title: 'Cannot delete group.',
              error: {message: 'Group not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot delete group.',
            error: {message: 'Internal server error.'},
          });
        })
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot delete group.',
        error: {message: 'Group not found.'},
      });
    });
});

// Get all group members
router.get('/member', function (req, res, next) {
  Group.find({where: {id: req.body.id}})
    .then((group) => {
      GroupMember.findAll({where: {groupId: group.id}})
        .then((members) => {
          res.status(200).json({
            message: 'Group members retrieved successfully.',
            data: members,
          });
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot retrieve group members.',
            error: {message: 'Internal server error.'},
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot get members from group.',
        error: {message: 'Group not found.'},
      });
    });
});

// Add member to a group
router.post('/member', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Group.find({where: {id: req.body.id}})
    .then((group) => {
      if (group.creator != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      for (let i = 0, len = req.body.members.length; i < len; i++) {
        let member = req.body.members[i];
        GroupMember.findOrCreate({where: {groupId: group.id, email: member}})
          .spread((groupMember, created) => {
            if (created) {
              res.status(200).json({
                message: 'Group member successfully added.',
                name: groupMember.email,
              });
            } else {
              console.log({
                message: 'Cannot add member to group.',
                error: {message: 'Member already in group.'},
              });
            }
          });
      }
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot add member to the group.',
        error: {message: 'Group not found.'},
      });
    });
});

// Delete member from a group
router.delete('/member', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Group.find({where: {id: req.body.id}})
    .then((group) => {
      if (group.creator != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      GroupMember.find({where: {groupId: group.id, email: req.body.email}})
        .then((groupMember) => {
          GroupMember.destroy({where: {groupId: group.id, email: req.body.email}});
          res.status(200).json({
            message: 'Group member successfully deleted.',
            name: groupMember.email,
          });
        })
        .catch(() => {
          res.status(404).json({
            title: 'Cannot delete member from the group.',
            error: {message: 'Group member not found.'},
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot delete member from the group.',
        error: {message: 'Group not found.'},
      });
    });
});

module.exports = router;
