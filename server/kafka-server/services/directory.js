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

  if (req.name === 'downloadDirectory') {
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
    let decoded = jwt.decode(req.query.token);
    Directory.findAll({where: {owner: decoded.user.email, starred: true}})
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

  if (req.name === 'createShareableLink') {
    let decoded = jwt.decode(req.query.token);
    Directory.find({where: {id: req.body.id}})
      .then((directory) => {
        if (directory.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        directory.updateAttributes({
          link: path.join(serverConfig.server + ":" + serverConfig.port, "directory", "link", cryptr.encrypt(path.join(directory.owner, directory.path)), directory.name),
        });
        res = {
          status: 200,
          message: "Directory's shareable link successfully created.",
          link: directory.link,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot create shareable link.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'createDirectory') {
    let decoded = jwt.decode(req.query.token);
    if (req.body.owner != decoded.user.email) {
      res = {
        status: 401,
        title: 'Not Authenticated.',
        error: {message: 'Users do not match.'},
      };
      callback(null, res);
    }
    let directoryExists = false;
    let directoryName = req.body.name;
    let index = 0;
    do {
      directoryExists = false;
      if (fs.pathExistsSync(path.resolve(serverConfig.box.path, decoded.user.email, path.join('root', req.body.path), directoryName))) {
        ++index;
        directoryName = req.body.name + " (" + index + ")";
        directoryExists = true;
      }
    } while (directoryExists);
    let directory = {
      name: directoryName,
      path: path.join('root', req.body.path),
      owner: req.body.owner,
    };

    if (!directoryExists) {
      fs.ensureDir(path.resolve(serverConfig.box.path, decoded.user.email, path.join('root', req.body.path), directory.name))
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
  }

  if (req.name === 'starDirectory') {
    let decoded = jwt.decode(req.query.token);
    console.log(req.body);
    Directory.find({where: {id: req.body.id}})
      .then((directory) => {
        if (directory.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        directory.updateAttributes({
          starred: req.body.starred,
        });
        let activity = {
          email: decoded.user.email,
          log: "Toggled Star for " + directory.name,
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
        res = {
          status: 200,
          message: 'Directory successfully starred.',
          name: directory.name,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot star directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'shareDirectory') {
    let decoded = jwt.decode(req.query.token);
    let successful = true;
    let markAllDirectoriesShared = function (directoryPath, directoryName, directoryId, toShow) {
      Directory.find({where: {id: directoryId}})
        .then((directory) => {
          if (directory.owner != decoded.user.email) {
            res = {
              status: 401,
              title: 'Not Authenticated.',
              error: {message: 'Users do not match.'},
            };
            callback(null, res);
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
      res = {
        status: 200,
        message: 'Directory successfully shared.',
        name: req.body.name,
      };
      callback(null, res);
    } else {
      res = {
        status: 500,
        title: 'Cannot share directory.',
        error: {message: 'Internal server error.'},
      };
      callback(null, res);
    }
  }

  if (req.name === 'renameDirectory') {
    let decoded = jwt.decode(req.query.token);

    Directory.find({where: {id: req.body.id}})
      .then((directory) => {
        if (directory.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        fs.pathExists(path.resolve(serverConfig.box.path, directory.owner, req.body.path, directory.name))
          .then((exists) => {
            if (exists) {
              fs.rename(path.resolve(serverConfig.box.path, directory.owner, req.body.path, directory.name), path.resolve(serverConfig.box.path, directory.owner, req.body.path, req.body.name))
                .then(() => {
                  directory.updateAttributes({
                    name: req.body.name,
                  });
                  res = {
                    status: 200,
                    message: 'Directory successfully renamed.',
                    name: req.body.name,
                  };
                  callback(null, res);
                })
                .catch(() => {
                  console.log("here");
                  res = {
                    status: 500,
                    title: 'Cannot rename directory.',
                    error: {message: 'Internal server error.'},
                  };
                  callback(null, res);
                })

            } else {
              res = {
                status: 404,
                title: 'Cannot rename directory.',
                error: {message: 'Directory not found.'},
              };
              callback(null, res);
            }
          })
          .catch(() => {
            res = {
              status: 500,
              title: 'Cannot rename directory.',
              error: {message: 'Internal server error.'},
            };
            callback(null, res);
          });
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot rename directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'deleteDirectory') {
    let decoded = jwt.decode(req.query.token);
    Directory.find({where: {id: req.body.id}})
      .then((directory) => {
        if (directory.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        fs.pathExists(path.resolve(serverConfig.box.path, directory.owner, req.body.path, req.body.name))
          .then((exists) => {
            if (exists) {
              fs.remove(path.resolve(serverConfig.box.path, directory.owner, req.body.path, req.body.name))
                .then(() => {
                  Directory.destroy({where: {name: req.body.name, path: req.body.path, owner: directory.owner}});
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
                  res = {
                    status: 200,
                    message: 'Directory successfully deleted.',
                    name: req.body.name,
                  };
                  callback(null, res);
                })
                .catch(() => {
                  res = {
                    status: 500,
                    title: 'Cannot delete directory.',
                    error: {message: 'Internal server error.'},
                  };
                  callback(null, res);
                })
            } else {
              res = {
                status: 404,
                title: 'Cannot delete directory.',
                error: {message: 'Directory not found.'},
              };
              callback(null, res);
            }
          })
          .catch(() => {
            res = {
              status: 500,
              title: 'Cannot delete directory.',
              error: {message: 'Internal server error.'},
            };
            callback(null, res);
          })
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot delete directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;
