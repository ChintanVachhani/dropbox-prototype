let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
let Activity = require('../models/activity');

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

// Get certain number of activities for a user
router.get('/', function (req, res, next) {

  kafka.make_request('activityTopic', {name: 'getActivities', query: req.query, body: req.body}, function (err, response) {
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
  Activity.findAll({where: {email: decoded.user.email}, limit: Number(req.query.count), order: [['createdAt', 'DESC']]})
    .then((activities) => {
      res.status(200).json({
        message: 'Activities retrieved successfully.',
        data: activities,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve activities.',
        error: {message: 'Internal server error.'},
      });
    });*/
});

// Get all activities for a user
router.get('/all', function (req, res, next) {

  kafka.make_request('activityTopic', {name: 'getAllActivities', query: req.query, body: req.body}, function (err, response) {
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
  Activity.findAll({where: {email: decoded.user.email}})
    .then((activities) => {
      res.status(200).json({
        message: 'Activities retrieved successfully.',
        data: activities,
      });
    })
    .catch(() => {
      res.status(500).json({
        title: 'Cannot retrieve activities.',
        error: {message: 'Internal server error.'},
      });
    });*/
});

module.exports = router;
