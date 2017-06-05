var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var ObjectId = require('mongodb').ObjectId; 

router.baseURL = '/Rcp';

router.get('/', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if(vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Recipe').find({ownerId: req.session.id}).toArray(function(err, docs) {
            if (err) cb(err);
            cb(err, docs); // no errors
         });
      }
   },
   function(rcps, cb) {
      res.status(200).json(rcps);
      cb();
   }],
   function(err) {
      if (err) res.status(500).end();
   });
});

router.post('/', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if(vld.check(req.session, Tags.noPermission, null, cb) &&
       vld.hasFields(req.body, ["recipeId", "date"], cb)) {
         req.cnn.collection('Recipe').insertOne({recipeId: req.body.recipeId,
          date: req.body.date, ownerId: req.session.id}, cb);
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Recipe').findOne(
          {_id: new ObjectId(req.params.id)}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb) && 
       vld.checkPrsOK(response.ownerId)) {
         req.cnn.collection('Recipe').deleteOne(
          {_id: new ObjectId(req.params.id)}, cb);
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});
module.exports = router;
