var express = require('express');
var router = express.Router();
var request = require('request');

var Startup = require('../modules/models');
var s1 = require('../scrapeS1Filing');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {});
});

// get angelist result
router.get('/angellist', function(req, res, next) {
  Startup.find(function(err, results) {
    if(err) {
      res.send(500, err);
      console.log("error");
    }
    else {
      res.send(200, results);
    }
  });
});

// get s1 filing search result
router.get('/s1', function(req, res, next) {
  var date = req.query.searchDate;
  s1.scrapeS1(date, function(results) {
    res.send(200, results);
  });
});

module.exports = router;
