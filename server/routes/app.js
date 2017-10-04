var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log("Ready");
});

module.exports = router;
