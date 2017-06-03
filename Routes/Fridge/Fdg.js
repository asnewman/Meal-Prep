var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Fdg';

router.get('/', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session)) {
         req.cnn.Fridge.find({ownerId: req.session.id});
      }
   },
   function(ingrs, cb) {
      res.status(200).json(ingrs);
   }],
   function(err) {
      // something?
   });
});