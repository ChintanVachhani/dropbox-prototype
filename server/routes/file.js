let serverConfig = require('../config');

let path = require('path');
let express = require('express');
let router = express.Router();
let Cryptr = require('cryptr'), cryptr = new Cryptr('secret');
let jwt = require('jsonwebtoken');
let fs = require('fs-extra');
let multer = require('multer');
let File = require('../models/file');
let SharedFile = require('../models/sharedFile');
let Activity = require('../models/activity');
let kafka = require('./kafka/client');

// Get a file from link
router.get('/link/:path/:fileName', function (req, res, next) {
  res.download(path.resolve(serverConfig.box.path, cryptr.decrypt(req.params.path), req.params.fileName), req.params.fileName, function (err) {
    if (err) {
      console.log("File download failed.");
    } else {
      console.log("File downloaded successfully.");
    }
  });
});

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

  kafka.make_request('fileTopic', {name: 'getAllFiles', query: req.query, body: req.body}, function (err, response) {
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
  File.findAll({where: {owner: decoded.user.email, path: path.join(req.query.path)}})
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
    });*/
});

// Get all starred files
router.get('/starred', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'getAllStaredFiles', query: req.query, body: req.body}, function (err, response) {
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
  File.findAll({where: {owner: decoded.user.email, starred: true}})
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
    });*/
});

// Create a shareable link
router.patch('/link', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'createShareableLink', query: req.query, body: req.body}, function (err, response) {
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
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      file.updateAttributes({
        link: path.join(serverConfig.server + ":" + serverConfig.port, "file", "link", cryptr.encrypt(path.join(file.owner, file.path)), file.name),
      });
      res.status(200).json({
        message: "File's shareable link successfully created.",
        link: file.link,
      });
    })
    .catch(() => {
      res.status(404).json({
        title: 'Cannot create shareable link.',
        error: {message: 'File not found.'},
      });
    });*/
});

// Download a file
router.get('/download', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
  if (req.query.userId != decoded.user.email) {
    return res.status(401).json({
      title: 'Not Authenticated.',
      error: {message: 'Users do not match.'},
    });
  }
  console.log(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name));
  res.download(path.resolve(serverConfig.box.path, decoded.user.email, req.query.path, req.query.name), req.query.name, function (err) {
    if (err) {
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
    }
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
    fs.move(path.resolve(serverConfig.box.path, decoded.user.email, 'tmp', req.file.originalname), path.resolve(serverConfig.box.path, decoded.user.email, path.join('root', req.body.path), req.file.originalname), {overwrite: true})
      .then(() => {
        console.log("Saved file " + req.file.originalname);
      })
      .catch((error) => {
        console.error("Could not save file " + req.file.originalname + ". Error: " + error);
      });
    console.log("Uploaded file " + req.file.originalname);
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
    res.status(201).json({
      message: 'File successfully uploaded.',
      name: req.file.originalname,
    });
  });
});

// Star a file
router.patch('/star', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'starFile', query: req.query, body: req.body}, function (err, response) {
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
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
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
    });*/
});

// Share a file
router.patch('/share', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'shareFile', query: req.query, body: req.body}, function (err, response) {
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
  File.find({where: {id: req.body.id}})
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
    });*/
});

// Rename a file
router.patch('/', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'renameFile', query: req.query, body: req.body}, function (err, response) {
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
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
      }
      fs.pathExists(path.resolve(serverConfig.box.path, file.owner, req.body.path, file.name))
        .then((exists) => {
          if (exists) {
            fs.rename(path.resolve(serverConfig.box.path, file.owner, req.body.path, file.name), path.resolve(serverConfig.box.path, file.owner, req.body.path, req.body.name))
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
    });*/
});

// Delete a file
router.delete('/', function (req, res, next) {

  kafka.make_request('fileTopic', {name: 'deleteFile', query: req.query, body: req.body}, function (err, response) {
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
  File.find({where: {id: req.body.id}})
    .then((file) => {
      if (file.owner != decoded.user.email) {
        return res.status(401).json({
          title: 'Not Authenticated.',
          error: {message: 'Users do not match.'},
        });
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
    });*/
});

module.exports = router;
