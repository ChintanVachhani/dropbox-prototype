let serverConfig = require('../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let Directory = require('../models/directory');
let SharedDirectory = require('../models/sharedDirectory');
let Activity = require('../models/activity');
let File = require('../models/file');
let SharedFile = require('../models/sharedFile');
let zipFolder = require('zip-folder');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getDirectoryByLink') {
    zipFolder(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path), req.params.directoryName), path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path).split(path.sep)[0], 'tmp', req.params.directoryName) + '.zip', function (error) {
      if (error) {
        console.log("Directory cannot be zipped. " + error);
      } else {
        console.log('Directory zipped successfully.');
        fs.readFile(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path).split(path.sep)[0], 'tmp', req.params.directoryName) + '.zip', 'base64', function (error, buffer) {
          if (error) {
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
            res = {
              fileName: req.params.directoryName + '.zip',
              buffer: buffer,
            };
            callback(null, res);
          }
        });
      }
    });
  }

  if (req.name === 'downloadDirectory') {

    let decoded = jwt.decode(req.query.token);

    zipFolder(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', function (error) {
      if (error) {
        console.log("Directory cannot be zipped. " + error);
      } else {
        console.log('Directory zipped successfully.');
        fs.readFile(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip', 'base64', function (error, buffer) {
          if (error) {
            console.log("Directory download failed.");
          } else {
            fs.remove(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.query.name) + '.zip')
              .then(() => {
                console.log("Deleted zipped directory.");
              })
              .catch(() => {
                console.log("Cannot delete zipped directory.");
              });
            let activity = Activity({
              email: decoded.user.email,
              log: "Downloaded " + req.query.name,
            });
            activity.save(function (error) {
              if (error) {
                console.log({
                  title: 'Activity cannot be logged.',
                  error: {message: 'Invalid Data.'},
                });
              }
              console.log({
                message: 'Activity successfully logged.',
                log: activity.log,
              });
            });
            console.log("Directory downloaded successfully.");
            res = {
              fileName: req.query.name + '.zip',
              buffer: buffer,
            };
            callback(null, res);
          }
        });
      }
    });
  }

  if (req.name === 'getAllDirectories') {
    let decoded = jwt.decode(req.query.token);
    Directory.find({owner: decoded.user.email, path: req.query.path})
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
    Directory.find({owner: decoded.user.email, starred: true})
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
    Directory.findById(req.body._id, function (error, directory) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot create shareable link.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      }
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
    let directory = Directory({
      name: directoryName,
      path: path.join('root', req.body.path),
      owner: req.body.owner,
    });

    if (!directoryExists) {
      fs.ensureDir(path.resolve(serverConfig.box.path, decoded.user.email, path.join('root', req.body.path), directory.name))
        .then(() => {
          console.log("Created directory " + directory.name);
          directory.save(function (error) {
            if (error) {
              res = {
                status: 400,
                title: 'Cannot create directory.',
                error: {message: 'Invalid Data.'},
              };
              callback(null, res);
            }
            let activity = Activity({
              email: decoded.user.email,
              log: "Created " + directory.name,
            });
            activity.save(function (error) {
              if (error) {
                console.log({
                  title: 'Activity cannot be logged.',
                  error: {message: 'Invalid Data.'},
                });
              }
              console.log({
                message: 'Activity successfully logged.',
                log: activity.log,
              });
            });
            res = {
              status: 201,
              message: 'Directory successfully created.',
              name: directory.name,
            };
            callback(null, res);
          });
        })
        .catch((error) => {
          console.error("Cannot create directory " + req.body.name + ". Error: " + +error);
          res = {
            status: 400,
            title: 'Cannot create directory.',
            error: {message: 'Invalid Data.'},
          };
          callback(null, res);
        });
    }
  }

  if (req.name === 'starDirectory') {
    let decoded = jwt.decode(req.query.token);
    console.log(req.body);
    Directory.findById(req.body._id, function (error, directory) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot star directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      }
      if (directory.owner != decoded.user.email) {
        res = {
          status: 401,
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        };
        callback(null, res);
      }
      directory.starred = req.body.starred;
      directory.save(function (error) {
        if (error) {
          console.error(error);
        }
        console.log("Directory updated!");
      });
      let activity = Activity({
        email: decoded.user.email,
        log: "Toggled Star for " + directory.name,
      });
      activity.save(function (error) {
        if (error) {
          console.log({
            title: 'Activity cannot be logged.',
            error: {message: 'Invalid Data.'},
          });
        }
        console.log({
          message: 'Activity successfully logged.',
          log: activity.log,
        });
      });
      res = {
        status: 200,
        message: 'Directory successfully starred.',
        name: directory.name,
      };
      callback(null, res);
    });
  }

  if (req.name === 'shareDirectory') {
    let decoded = jwt.decode(req.query.token);
    let successful = true;
    let markAllDirectoriesShared = function (directoryPath, directoryName, directoryId, toShow) {
      Directory.findById(directoryId, function (error, directory) {
        if (error) {
          successful = false;
          console.log({
            title: 'Cannot share directory.',
            error: {message: 'Directory not found.'},
          });
        }
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
          SharedDirectory.findOne({
            name: directoryName,
            path: directoryPath,
            owner: req.body.owner,
            sharer: sharer,
            show: toShow,
          }).then((sharedDirectory) => {
            if(sharedDirectory){
              console.log("Sharer exists!");
            } else{
              let sharedDirectory = SharedDirectory({
                name: directoryName,
                owner: req.body.owner,
                path: cryptr.encrypt(directoryPath),
                sharer: sharer,
                show: toShow,
              });
              sharedDirectory.save(function (error) {
                if (error) {
                  console.error(error);
                }
                console.log("Sharer added!");
              });
            }
          }).catch(() => {
            console.error(error);
          });
        }
        directory.shared = true;
        directory.show = toShow;
        directory.save(function (error) {
          if (error) {
            console.error(error);
          }
          console.log("Directory updated!");
        });
        console.log({
          message: 'Directory successfully shared.',
          name: directory.name,
        });
        //getSubFiles
        File.find({owner: decoded.user.email, path: path.join(directoryPath, directoryName)})
          .then((files) => {
            console.log({
              message: 'Files retrieved successfully.',
              data: files,
            });
            if (files != null && files.length > 0) {
              moreFiles = true;
              for (let i = 0, len = files.length; i < len; i++) {
                //shareFile
                File.findById(files[i]._id, function (error, file) {
                  if (error) {
                    console.log({
                      title: 'Cannot share file.',
                      error: {message: 'File not found.'},
                    });
                  }
                  if (file.owner != decoded.user.email) {
                    return res.status(401).json({
                      title: 'Not Authenticated.',
                      error: {message: 'Users do not match.'},
                    });
                  }
                  for (let i = 0, len = req.body.sharers.length; i < len; i++) {
                    let sharer = req.body.sharers[i];
                    SharedFile.findOne({
                      name: file.name,
                      path: file.path,
                      owner: req.body.owner,
                      sharer: sharer,
                    }).then((sharedFile) => {
                      if(sharedFile){
                        console.log("Sharer exists!");
                      } else{
                        let sharedFile = SharedFile({
                          name: file.name,
                          path: cryptr.encrypt(file.path,),
                          sharer: sharer,
                          owner: req.body.owner,
                        });
                        sharedFile.save(function (error) {
                          if (error) {
                            console.error(error);
                          }
                          console.log("Sharer added!");
                        });
                      }
                    }).catch((error) => {
                      console.error(error);
                    });
                  }
                  file.shared = true;
                  file.save(function (error) {
                    if (error) {
                      console.error(error);
                    }
                    console.log("File updated!");
                  });
                  console.log({
                    message: 'File successfully shared.',
                    name: file.name,
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
        Directory.find({owner: decoded.user.email, path: path.join(directoryPath, directoryName)})
          .then((directories) => {
            console.log({
              message: 'Directories retrieved successfully.',
              data: directories,
            });
            if (directories != null && directories.length > 0) {
              for (let i = 0, len = directories.length; i < len; i++) {
                //function recall
                markAllDirectoriesShared(directories[i].path, directories[i].name, directories[i]._id, false);
              }
            }
          })
          .catch(() => {
            console.log({
              title: 'Cannot retrieve directories.',
              error: {message: 'Internal server error.'},
            });

          });
      });
    };

    markAllDirectoriesShared(req.body.path, req.body.name, req.body._id, true);

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

    Directory.findById(req.body._id, function (error, directory) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot rename directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      }
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
                directory.name = req.body.name;
                directory.save(function (error) {
                  if (error) {
                    console.error(error);
                  }
                  console.log("Directory updated!");
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
    });
  }

  if (req.name === 'deleteDirectory') {
    let decoded = jwt.decode(req.query.token);
    Directory.findById(req.body._id, function (error, directory) {
      if (error) {
        res = {
          status: 404,
          title: 'Cannot delete directory.',
          error: {message: 'Directory not found.'},
        };
        callback(null, res);
      }
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
                directory.remove(function (error) {
                  if (error) {
                    console.error(error);
                  }
                  console.log("Deleted directory " + req.body.name);
                });
                let activity = Activity({
                  email: decoded.user.email,
                  log: "Deleted " + req.body.name,
                });
                activity.save(function (error) {
                  if (error) {
                    console.log({
                      title: 'Activity cannot be logged.',
                      error: {message: 'Invalid Data.'},
                    });
                  }
                  console.log({
                    message: 'Activity successfully logged.',
                    log: activity.log,
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
        });
    });
  }
}

exports.handle_request = handle_request;
