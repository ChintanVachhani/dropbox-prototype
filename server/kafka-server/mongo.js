'use strict';
let ArrayList = require('arraylist');
let mongoose = require('mongoose');

let availableConnections = new ArrayList;
let maxPoolSize;

class ConnectionManager {

  constructor(maxPoolSizeValue) {
    maxPoolSize = maxPoolSizeValue;
    for (let i = 0; i < maxPoolSize; ++i) {
      availableConnections.add(mongoose.connect('mongodb://localhost:27017/dropbox-prototype'));
    }
  }

  static getConnection() {
    if (!availableConnections.isEmpty()) {
      console.error('Get connection from pool.');
      let connectionObject = availableConnections.first();
      availableConnections.remove(0);
      return connectionObject;
    } else {
      console.error('Wait for connection from pool.');
      let connectionCheck = setInterval(function () {
        if (!availableConnections.isEmpty()) {
          clearInterval(connectionCheck);
          let connectionObject = availableConnections.first();
          availableConnections.remove(0);
          return connectionObject;
        }
      }, 100);
      /*console.error('New connection.');
      return mongoose.connect('mongodb://localhost:27017/dropbox-prototype');*/
    }
  }

  static releaseConnection(connection) {
    console.error('Release connection to pool.');
    //connection.disconnect();
    if (availableConnections.size() < maxPoolSize)
      availableConnections.add(connection);
  }

}

module.exports = ConnectionManager;
