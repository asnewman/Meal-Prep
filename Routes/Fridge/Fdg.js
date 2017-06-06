var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Fdg';

router.get('/', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Fridge').find({ownerId: req.session.id}, 
          {ingredient: 1}).toArray(function(err, docs) {
            if (err) cd(err);
            cb(err, docs); // no errors
         })
      }
   },
   function(ingrs, cb) {
      if (vld.checkPrsOK(ingrs.ownerId)) { // makes sure owner
         res.status(200).json(ingrs);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
   });
});

router.post('/', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Fridge').findOne({ingredient: req.query.name}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(!response, Tags.dupIngredient, null, cb)) {
         req.cnn.collection('Fridge').insertOne({ingredient: req.query.name, 
          ownerId: req.session.id}, cb);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
      else res.status(200).end();
   });
})

router.delete('/', function(req, res) {
   vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session)) {
         req.cnn.collection("Fridge").findOne({ingredient: req.query.name, 
          ownerId: req.session.id}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb)) {
         req.cnn.collection("Fridge").deleteOne({ingredient: req.query.name,
          ownerId: req.session.id}, cb);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
      else res.status(200).end();
   });
});

module.exports = router;
