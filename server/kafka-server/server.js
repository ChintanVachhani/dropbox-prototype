let connection = new require('./kafka/Connection');
let user = require('./services/user');
let file = require('./services/file');
let directory = require('./services/directory');
let activity = require('./services/activity');
let sharedFile = require('./services/sharedFile');
let sharedDirectory = require('./services/sharedDirectory');

let userConsumer = connection.getConsumer('userTopic');
let fileConsumer = connection.getConsumer('fileTopic');
let directoryConsumer = connection.getConsumer('directoryTopic');
let activityConsumer = connection.getConsumer('activityTopic');
let sharedFileConsumer = connection.getConsumer('sharedFileTopic');
let sharedDirectoryConsumer = connection.getConsumer('sharedDirectoryTopic');
let producer = connection.getProducer();

// MongoDB
let ConnectionManager = require('./mongo');
const mongoDBConnection = new ConnectionManager(250);

/*let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dropbox-prototype', {poolSize: 250});*/

console.log('server is running');
userConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  user.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});

fileConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  file.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});

directoryConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  directory.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});

activityConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  activity.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});

sharedFileConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  sharedFile.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});

sharedDirectoryConsumer.on('message', function (message) {
  let connection = ConnectionManager.getConnection();
  console.log('message received');
  console.log(JSON.stringify(message.value));
  let data = JSON.parse(message.value);
  sharedDirectory.handle_request(data.data, function (err, res) {
    ConnectionManager.releaseConnection(connection);
    console.log('after handle', res);
    let payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res,
        }),
        partition: 0,
      },
    ];
    producer.send(payloads, function (err, data) {
      console.log(data);
    });
    return;
  });
});
