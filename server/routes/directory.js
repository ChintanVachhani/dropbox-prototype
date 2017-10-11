import serverConfig from '../config';

let path = require('path');
let express = require('express');
let router = express.Router();
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let Directory = require('../models/directory');
let SharedDirectory = require('../models/sharedDirectory');
let File = require('../models/file');
let SharedFile = require('../models/sharedFile');
let zipFolder = require('zip-folder');

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

// Download a directory
router.get('/download', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  zipFolder(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', function (error) {
    if (error) {
      console.log("Directory cannot be zipped. " + error);
    } else {
      console.log('Directory zipped successfully.');
      res.download(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', req.query.name + '.zip', function (err) {
        if (err) {
          console.log("Directory download failed.");
        } else {
          fs.remove(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip')
            .then(() => {
              console.log("Deleted zipped directory.");
            })
            .catch(() => {
              console.log("Cannot delete zipped directory.");
            });
          let activity = {
            email: decoded.user.email,
            log: "Downloaded " + req.query.name,
          };
          Activity.create(activity)
            .then((activity) => {
              console.log({
                message: 'Activity successfully logged.',
                log: activity.log,
              });
            })
            .catch(() => {
              console.log({
                title: 'Activity cannot be logged.',
                error: {message: 'Invalid Data.'},
              });
            });
          console.log("Directory downloaded successfully.");
        }
      });
    }
  });
});

// Get all directories
router.get('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Directory.findAll({where: {owner: decoded.user.email, path: req.query.path}})
    .then((directories) => {
      res.status(200).json({
        message: 'Directories retrieved successfully.',
        data: directories,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve directories.',
        error: {message: 'Internal server error.'},
      });
    });
});

// Get a directory from link
router.get('/link/:path/:directoryName', function (req, res, next) {
  zipFolder(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path), req.params.directoryName), path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path).split(path.sep)[0], 'tmp', req.params.directoryName) + '.zip', function (error) {
    if (error) {
      console.log("Directory cannot be zipped. " + error);
    } else {
      console.log('Directory zipped successfully.');
      res.download(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path).split(path.sep)[0], 'tmp', req.params.directoryName) + '.zip', req.params.directoryName + '.zip', function (err) {
        if (err) {
          console.log("Directory download failed.");
        } else {
          fs.remove(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path).split(path.sep)[0], 'tmp', req.params.directoryName) + '.zip')
            .then(() => {
              console.log("Deleted zipped directory.");
            })
            .catch(() => {
              console.log("Cannot delete zipped directory.");
            });
          console.log("Directory downloaded successfully.");
        }
      });
    }
  });
});

// Create a shareable link
router.patch('/link', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      directory.updateAttributes({
        link: path.join(serverConfig.server + ":" + serverConfig.port, "directory", "link", cryptr.encrypt(path.join(directory.owner, directory.path)), directory.name),
      });
      res.status(200).json({
        message: "Directory's shareable link successfully created.",
        link: directory.link,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot create shareable link.',
        error: {message: 'Directory not found.'},
      });
    });
});

// Create a directory
router.put('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.body.owner != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  let directoryExists = false;
  let directoryName = req.body.name;
  let index = 0;
  do {
    directoryExists = false;
    if (fs.pathExistsSync(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directoryName))) {
      ++index;
      directoryName = req.body.name + " (" + index + ")";
      directoryExists = true;
    }
  } while (directoryExists);
  let directory = {
    name: directoryName,
    path: req.body.path,
    owner: req.body.owner,
  };

  if (!directoryExists) {
    fs.ensureDir(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name))
      .then(() => {
        console.log("Created directory " + directory.name);
        Directory.create(directory)
          .then((directory) => {
            let activity = {
              email: decoded.user.email,
              log: "Created " + directory.name,
            };
            Activity.create(activity)
              .then((activity) => {
                console.log({
                  message: 'Activity successfully logged.',
                  log: activity.log,
                });
              })
              .catch(() => {
                console.log({
                  title: 'Activity cannot be logged.',
                  error: {message: 'Invalid Data.'},
                });
              });
            res.status(201).json({
              message: 'Directory successfully created.',
              name: directory.name,
            });
          })
          .catch((error) => {
            res.status(400).json({
              title: 'Cannot create directory.',
              error: {message: 'Invalid Data.'},
            });
          });
      })
      .catch((error) => {
        console.error("Cannot create directory " + req.body.name + ". Error: " + +error);
        res.status(400).json({
          title: 'Cannot create directory.',
          error: {message: 'Invalid Data.'},
        });
      });
  }
});

// Star a directory
router.patch('/star', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      directory.updateAttributes({
        starred: true,
      });
      let activity = {
        email: decoded.user.email,
        log: "Starred " + directory.name,
      };
      Activity.create(activity)
        .then((activity) => {
          console.log({
            message: 'Activity successfully logged.',
            log: activity.log,
          });
        })
        .catch(() => {
          console.log({
            title: 'Activity cannot be logged.',
            error: {message: 'Invalid Data.'},
          });
        });
      res.status(200).json({
        message: 'Directory successfully starred.',
        name: directory.name,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot star directory.',
        error: {message: 'Directory not found.'},
      });
    });
});

// Share a directory
router.patch('/share', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  let successful = true;
  let markAllDirectoriesShared = function (directoryPath, directoryName, directoryId, toShow) {
    Directory.find({where: {id: directoryId}})
      .then((directory) => {
        if (directory.owner != decoded.user.email) {
          return res.status(401).json({
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          });
        }
        for (let i = 0, len = req.body.sharers.length; i < len; i++) {
          let sharer = req.body.sharers[i];
          SharedDirectory.findOrCreate({
            where: {
              name: directoryName,
              path: directoryPath,
              owner: req.body.owner,
              sharer: sharer,
              show: toShow,
            },
            defaults: {
              path: cryptr.encrypt(directoryPath),
              sharer: sharer,
            },
          }).spread((sharedDirectory, created) => {
            if (created) {
              console.log("Shared directory created.");
            }
          });
        }
        directory.updateAttributes({
          shared: true,
          show: toShow,
        });
        console.log({
          message: 'Directory successfully shared.',
          name: directory.name,
        });
        //getSubFiles
        File.findAll({where: {owner: decoded.user.email, path: path.join(directoryPath, directoryName)}})
          .then((files) => {
            console.log({
              message: 'Files retrieved successfully.',
              data: files,
            });
            if (files != null && files.length > 0) {
              moreFiles = true;
              for (let i = 0, len = files.length; i < len; i++) {
                //shareFile
                File.find({where: {id: files[i].id}})
                  .then((file) => {
                    if (file.owner != decoded.user.email) {
                      return res.status(401).json({
                        title: 'Not Authenticated.',
                        error: {message: 'Users do not match.'},
                      });
                    }
                    for (let i = 0, len = req.body.sharers.length; i < len; i++) {
                      let sharer = req.body.sharers[i];
                      SharedFile.findOrCreate({
                        where: {
                          name: file.name,
                          path: file.path,
                          owner: req.body.owner,
                          sharer: sharer,
                        },
                        defaults: {
                          path: cryptr.encrypt(file.path),
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
                    console.log({
                      message: 'File successfully shared.',
                      name: file.name,
                    });
                  })
                  .catch(() => {
                    console.log({
                      title: 'Cannot share file.',
                      error: {message: 'File not found.'},
                    });
                  });
              }
            }
          })
          .catch(() => {
            console.log({
              title: 'Cannot retrieve files.',
              error: {message: 'Internal server error.'},
            });
          });
        //getSubDirectories
        console.log("Path: " + path.join(directoryPath, directoryName));
        Directory.findAll({where: {owner: decoded.user.email, path: path.join(directoryPath, directoryName)}})
          .then((directories) => {
            console.log({
              message: 'Directories retrieved successfully.',
              data: directories,
            });
            if (directories != null && directories.length > 0) {
              for (let i = 0, len = directories.length; i < len; i++) {
                //function recall
                markAllDirectoriesShared(directories[i].path, directories[i].name, directories[i].id, false);
              }
            }
          })
          .catch(() => {
            console.log({
              title: 'Cannot retrieve directories.',
              error: {message: 'Internal server error.'},
            });

          });
      })
      .catch(() => {
        successful = false;
        console.log({
          title: 'Cannot share directory.',
          error: {message: 'Directory not found.'},
        });
      });
  };

  markAllDirectoriesShared(req.body.path, req.body.name, req.body.id, true);

  if (successful) {
    return res.status(200).json({
      message: 'Directory successfully shared.',
      name: req.body.name,
    });
  } else {
    return res.status(500).json({
      title: 'Cannot share directory.',
      error: {message: 'Internal server error.'},
    });
  }
});

// Rename a directory
router.patch('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);

  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name))
        .then((exists) => {
          if (exists) {
            fs.rename(path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, directory.name), path.resolve(serverConfig.box.path, decoded.user.email, req.body.path, req.body.name))
              .then(() => {
                directory.updateAttributes({
                  name: req.body.name,
                });
                res.status(200).json({
                  message: 'Directory successfully renamed.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                console.log("here");
                res.status(500).json({
                  title: 'Cannot rename directory.',
                  error: {message: 'Internal server error.'},
                });
              })

          } else {
            res.status(404).json({
              title: 'Cannot rename directory.',
              error: {message: 'Directory not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot rename directory.',
            error: {message: 'Internal server error.'},
          });
        });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot rename directory.',
        error: {message: 'Directory not found.'},
      });
    });
});

// Delete a directory
router.delete('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  Directory.find({where: {id: req.body.id}})
    .then((directory) => {
      if (directory.owner != decoded.user.email) {
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
                Directory.destroy({where: {name: req.body.name, path: req.body.path, owner: req.body.owner}});
                console.log("Deleted directory " + req.body.name);
                let activity = {
                  email: decoded.user.email,
                  log: "Deleted " + req.body.name,
                };
                Activity.create(activity)
                  .then((activity) => {
                    console.log({
                      message: 'Activity successfully logged.',
                      log: activity.log,
                    });
                  })
                  .catch(() => {
                    console.log({
                      title: 'Activity cannot be logged.',
                      error: {message: 'Invalid Data.'},
                    });
                  });
                res.status(200).json({
                  message: 'Directory successfully deleted.',
                  name: req.body.name,
                });
              })
              .catch(() => {
                res.status(500).json({
                  title: 'Cannot delete directory.',
                  error: {message: 'Internal server error.'},
                });
              })
          } else {
            res.status(404).json({
              title: 'Cannot delete directory.',
              error: {message: 'Directory not found.'},
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            title: 'Cannot delete directory.',
            error: {message: 'Internal server error.'},
          });
        })
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot delete directory.',
        error: {message: 'Directory not found.'},
      });
    });
});

module.exports = router;
