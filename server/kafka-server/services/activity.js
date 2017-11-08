let jwt = require('jsonwebtoken');
let Activity = require('../../models/activity');

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getActivities') {
    let decoded = jwt.decode(req.query.token);
    Activity.findAll({where: {email: decoded.user.email}, limit: Number(req.query.count), order: [['createdAt', 'DESC']]})
      .then((activities) => {
        res = {
          status: 200,
          message: 'Activities retrieved successfully.',
          data: activities,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve activities.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

  if (req.name === 'getAllActivities') {
    let decoded = jwt.decode(req.query.token);
    Activity.findAll({where: {email: decoded.user.email}})
      .then((activities) => {
        res = {
          status: 200,
          message: 'Activities retrieved successfully.',
          data: activities,
        };
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve activities.',
          error: {message: 'Internal server error.'},
        };
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;
