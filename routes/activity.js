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

router.get('/', function (req, res, next) {
  let decoded = jwt.decode(req.query.token);
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
    });
});

module.exports = router;
