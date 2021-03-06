var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
var async = require('async');
var request = require('request');

router.get('/search', function(req, res) {
   var query = {'q': req.query.q, 'key': req.query.key};
   request({url: 'http://food2fork.com/api/search', qs: query},
   function (error, response, body) {
      if (!error && response.statusCode == 200) {
         var info = JSON.parse(body)
         res.json(info);
      }
      else {
         res.status(401).end();
      }
   });
});

router.get('/get', function(req, res) {
   console.log(req.query.rId);
   var query = {'rId': req.query.rId, 'key': req.query.key};
   request({url: 'http://food2fork.com/api/get', qs: query},
   function (error, response, body) {
      if (!error && response.statusCode == 200) {
         var info = JSON.parse(body)
         res.json(info);
      }
      else {
         res.status(401).end();
      }
   });
});

module.exports = router;
