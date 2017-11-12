let request = require('request'), express = require('express'), assert = require("assert"), http = require("http");

let serverURL = 'http://localhost:8000';
let token;
let userId;

describe('dropbox-prototype tests', function () {

  it('should signup', function (done) {
    request({
      url: serverURL + '/user/signup',
      method: 'POST',
      json: {
        firstName: 'Mocha',
        lastName: 'Test',
        email: 'mocha@test.com',
        password: 'mocha',
      },
    }, function (err, res, body) {
      assert.equal(201, res.statusCode);
      done();
    })
  });

  it('should signin', function (done) {
    request({
      url: serverURL + '/user/signin',
      method: 'POST',
      json: {
        email: 'mocha@test.com',
        password: 'mocha',
      },
    }, function (err, res, body) {
      assert.equal(200, res.statusCode);
      token = body.token;
      userId = body.userId;
      done();
    })
  });

  it('should return user information', function (done) {
    http.get(serverURL + '/user?userId=' + userId + '&token=' + token, function (res) {
      assert.equal(200, res.statusCode);
      done();
    })
  });

  it('should return error because user already exists', function (done) {
    request({
      url: serverURL + '/user/signup',
      method: 'POST',
      json: {
        firstName: 'Mocha',
        lastName: 'Test',
        email: 'mocha@test.com',
        password: 'mocha',
      },
    }, function (err, res, body) {
      assert.equal(400, res.statusCode);
      done();
    })
  });

  it('should return error because invalid user credentials', function (done) {
    request({
      url: serverURL + '/user/signin',
      method: 'POST',
      json: {
        email: 'mocha@test.com',
        password: 'test',
      },
    }, function (err, res, body) {
      assert.equal(401, res.statusCode);
      done();
    })
  });

  it('should return error for user information because invalid token', function (done) {
    http.get(serverURL + '/user?userId=' + userId + '&token=asdasdasdasdasd', function (res) {
      assert.equal(401, res.statusCode);
      done();
    })
  });

  it('should return user account information', function (done) {
    http.get(serverURL + '/user/account?userId=' + userId + '&token=' + token, function (res) {
      assert.equal(200, res.statusCode);
      done();
    })
  });

  it('should return all user activity information', function (done) {
    http.get(serverURL + '/activity/all?token=' + token, function (res) {
      assert.equal(200, res.statusCode);
      done();
    })
  });

  it('should return all files for the user on the given path', function (done) {
    http.get(serverURL + '/file?path=root&token=' + token, function (res) {
      assert.equal(200, res.statusCode);
      done();
    })
  });

  it('should return all directories for the user on the given path', function (done) {
    http.get(serverURL + '/directory?path=root&token=' + token, function (res) {
      assert.equal(200, res.statusCode);
      done();
    })
  });

});
