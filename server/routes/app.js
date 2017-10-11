let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  console.log("Ready");
});

module.exports = router;
