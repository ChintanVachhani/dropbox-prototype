let jwt = require('jsonwebtoken');
let Activity = require('../models/activity');

/*let ConnectionManager = require('../mongo');
let connection = ConnectionManager.getConnection();*/

function handle_request(req, callback) {

  let res;

  console.log("In handle request:" + JSON.stringify(req));

  if (req.name === 'getActivities') {
    let decoded = jwt.decode(req.query.token);

    Activity.find({email: decoded.user.email}).sort({'createdAt': -1}).limit(Number(req.query.count))
      .then((activities) => {
        res = {
          status: 200,
          message: 'Activities retrieved successfully.',
          data: activities,
        };
        //ConnectionManager.releaseConnection(connection);
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve activities.',
          error: {message: 'Internal server error.'},
        };
        //ConnectionManager.releaseConnection(connection);
        callback(null, res);
      });
  }

  if (req.name === 'getAllActivities') {
    let decoded = jwt.decode(req.query.token);
    Activity.find({email: decoded.user.email})
      .then((activities) => {
        res = {
          status: 200,
          message: 'Activities retrieved successfully.',
          data: activities,
        };
        //ConnectionManager.releaseConnection(connection);
        callback(null, res);
      })
      .catch(() => {
        res = {
          status: 500,
          title: 'Cannot retrieve activities.',
          error: {message: 'Internal server error.'},
        };
        //ConnectionManager.releaseConnection(connection);
        callback(null, res);
      });
  }

}

exports.handle_request = handle_request;
