let serverConfig = require('../config');

let path = require('path');
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let multer = require('multer');
let File = require('../../node-server/models/file');
let SharedFile = require('../../node-server/models/sharedFile');
let Activity = require('../../node-server/models/activity');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getFileByLink') {
    fs.readFile(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path), req.params.fileName), 'base64', function (error, buffer) {
      if (error) {
        console.log("File download failed.");
      } else {
        console.log("File downloaded successfully.");
        res = {
          fileName: req.params.fileName,
          buffer: buffer,
        };
        callback(null, res);
      }
    });
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
    let decoded = jwt.decode(req.query.token);
    File.findAll({where: {owner: decoded.user.email, starred: true}})
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

  if (req.name === 'createShareableLink') {
    let decoded = jwt.decode(req.query.token);
    File.find({where: {id: req.body.id}})
      .then((file) => {
        if (file.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        file.updateAttributes({
          link: path.join(serverConfig.server + ":" + serverConfig.port, "file", "link", cryptr.encrypt(path.join(file.owner, file.path)), file.name),
        });
        res = {
          status: 200,
          message: "File's shareable link successfully created.",
          link: file.link,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot create shareable link.',
          error: {message: 'File not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'downloadFile') {

    let decoded = jwt.decode(req.query.token);

    console.log(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name));

    fs.readFile(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), 'base64', function (error, buffer) {
      if (error) {
        console.log("File download failed.");
      } else {
        console.log("File downloaded successfully.");
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
        res = {
          fileName: req.query.name,
          buffer: buffer,
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'uploadAndSaveFile') {

    let decoded = jwt.decode(req.query.token);

    File.findOrCreate({
      where: {
        name: req.file.originalname,
        path: path.join('root', req.body.path),
        owner: req.body.owner,
      },
    })
      .then((file) => {
        console.log('File successfully created.');
      })
      .catch((error) => {
        console.error("Cannot create file. Error: " + error);
      });

    fs.writeFile(path.resolve(serverConfig.box.path, decoded.user.email, path.join('root', req.body.path), req.file.originalname), req.buffer, 'base64', function (err) {
      if (err) return console.log(err);
      console.log("Uploaded file " + req.file.originalname);
    });

    let activity = {
      email: decoded.user.email,
      log: "Uploaded " + req.file.originalname,
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
      status: 201,
      message: 'File successfully uploaded.',
      name: req.file.originalname,
    };
    callback(null, res);
  }

  if (req.name === 'starFile') {
    let decoded = jwt.decode(req.query.token);
    File.find({where: {id: req.body.id}})
      .then((file) => {
        if (file.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        file.updateAttributes({
          starred: req.body.starred,
        });
        let activity = {
          email: decoded.user.email,
          log: "Toggled Star for " + file.name,
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
          message: 'File successfully starred.',
          name: file.name,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot star file.',
          error: {message: 'File not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'shareFile') {
    let decoded = jwt.decode(req.query.token);
    File.find({where: {id: req.body.id}})
      .then((file) => {
        if (file.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        for (let i = 0, len = req.body.sharers.length; i < len; i++) {
          let sharer = req.body.sharers[i];
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
              show: true,
            },
          }).spread((sharedFile, created) => {
            if (created) {
              console.log("Shared file created.");
            }
          });
        }
        file.updateAttributes({
          shared: true,
          show: true,
        });
        res = {
          status: 200,
          message: 'File successfully shared.',
          name: file.name,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot share file.',
          error: {message: 'File not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'renameFile') {
    let decoded = jwt.decode(req.query.token);
    File.find({where: {id: req.body.id}})
      .then((file) => {
        if (file.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        fs.pathExists(path.resolve(serverConfig.box.path, file.owner, req.body.path, file.name))
          .then((exists) => {
            if (exists) {
              fs.rename(path.resolve(serverConfig.box.path, file.owner, req.body.path, file.name), path.resolve(serverConfig.box.path, file.owner, req.body.path, req.body.name))
                .then(() => {
                  file.updateAttributes({
                    name: req.body.name,
                  });
                  res = {
                    status: 200,
                    message: 'File successfully renamed.',
                    name: req.body.name,
                  };
                  callback(null, res);
                })
                .catch(() => {
                  res = {
                    status: 500,
                    title: 'Cannot rename file.',
                    error: {message: 'Internal server error.'},
                  };
                  callback(null, res);
                })

            } else {
              res = {
                status: 404,
                title: 'Cannot rename file.',
                error: {message: 'File not found.'},
              };
              callback(null, res);
            }
          })
          .catch(() => {
            res = {
              status: 500,
              title: 'Cannot rename file.',
              error: {message: 'Internal server error.'},
            };
            callback(null, res);
          });
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot rename file.',
          error: {message: 'File not found.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'deleteFile') {
    let decoded = jwt.decode(req.query.token);
    File.find({where: {id: req.body.id}})
      .then((file) => {
        if (file.owner != decoded.user.email) {
          res = {
            status: 401,
            title: 'Not Authenticated.',
            error: {message: 'Users do not match.'},
          };
          callback(null, res);
        }
        console.log(path.resolve(serverConfig.box.path, file.owner, req.body.path, req.body.name));
        fs.pathExists(path.resolve(serverConfig.box.path, file.owner, req.body.path, req.body.name))
          .then((exists) => {
            if (exists) {
              fs.remove(path.resolve(serverConfig.box.path, file.owner, req.body.path, req.body.name))
                .then(() => {
                  File.destroy({where: {name: req.body.name, path: req.body.path, owner: file.owner}});
                  console.log("Deleted file " + req.body.name);
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
                    message: 'File successfully deleted.',
                    name: req.body.name,
                  };
                  callback(null, res);
                })
                .catch(() => {
                  res = {
                    status: 500,
                    title: 'Cannot delete file.',
                    error: {message: 'Internal server error.'},
                  };
                  callback(null, res);
                })
            } else {
              res = {
                status: 404,
                title: 'Cannot delete file.',
                error: {message: 'File not found.'},
              };
              callback(null, res);
            }
          })
          .catch(() => {
            res = {
              status: 500,
              title: 'Cannot delete file.',
              error: {message: 'Internal server error.'},
            };
            callback(null, res);
          })
      })
      .catch(() => {
        res = {
          status: 404,
          title: 'Cannot delete file.',
          error: {message: 'File not found.'},
        };
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;
