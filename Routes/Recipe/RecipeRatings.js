var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var ObjectId = require('mongodb').ObjectId;
var dateFormat = require('dateformat');

router.baseURL = '/Rat';

// Get a rating
router.get('/:recipeId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;
   var lkes;
   var dlks;

   async.waterfall([
   function(cb) { // getting the amount of likes
      cnn.collection("Likes").find({recipeId: rId}).count(cb);
   },
   function(count, cb) { // getting amount of dislikes
      lkes = count;
      cnn.collection("Dislikes").find({recipeId: rId}).count(cb);
   },
   function(count, cb) { // getting comments
      dlks = count;
      cnn.collection("Comments").find({recipeId: rId})
       .toArray(function(err, docs) {
         if (err) cb(err);
         cb(err, docs); // no errors
      });
   },
   function(cmts, cb) {
      res.status(200).json({likes: lkes, dislikes: dlks, comments: cmts })
   }],
   function(err) {
      if(err) res.status(500).end();
   });
});

// Create a new comment
router.post('/:recipeId/Cmts', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;
   var now = new Date();

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)
          && vld.hasFields(req.body, ["comment"]), cb) {
         cnn.collection("Comments").insertOne({recipeId: rId,
          ownerId: req.session.id, comment: req.body.comment,
          date: dateFormat(now, "dddd, mmmm dS, yyyy")}, cb);
      }
   }],
   function(err, result) {
      if (!err) res.location(router.baseURL + '/rId/Cmts/' + result.insertedId).end();
      else {
         console.log(err);
         res.status(500).end();
      }
   });
});

// Get likes
router.get('/:recipeId/Lkes', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         cnn.collection("Likes").find({recipeId: rId})
          .toArray(function(err, docs) {
            if (err) cb(err);
            cb(err, docs); // no errors
         });
      }
   },
   function(likes, cb) {
      res.status(200).json(likes);
   }],
   function(err) {
      if (err) res.status(500).end();
   });
});

// Get dislikes
router.get('/:recipeId/Dlks', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         cnn.collection("Dislikes").find({recipeId: rId})
          .toArray(function(err, docs) {
            if (err) cb(err);
            cb(err, docs); // no errors
         });
      }
   },
   function(likes, cb) {
      res.status(200).json(likes);
   }],
   function(err) {
      if (err) res.status(500).end();
   });
});

// Create a new like
router.post('/:recipeId/Lkes', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         cnn.collection("Likes").findOne({recipeId: rId,
          ownerId: req.session.id}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(!response, Tags.dupRating, null, cb)) {
         cnn.collection("Likes").insertOne({recipeId: rId,
          ownerId: req.session.id}, cb);
      }
   }],
   function(err, result) {
      if (!err) res.location(router.baseURL + '/rId/Lkes/' + result.insertedId).end();
      else {
         res.status(500).end();
      }
   });
});

// Create a new dislike
router.post('/:recipeId/Dlks', function (req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         cnn.collection("Dislikes").findOne({recipeId: rId,
          ownerId: req.session.id}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(!response, Tags.dupRating, null, cb)) {
         cnn.collection("Dislikes").insertOne({recipeId: rId,
          ownerId: req.session.id}, cb);
      }
   }],
   function(err, result) {
      if (!err) res.location(router.baseURL + '/rId/Dlks/' + result.insertedId).end();
      else {
         console.log(err);
         res.status(500).end();
      }
   });
});

// Delete a like
router.delete('/:recipeId/Lkes/:lkeId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;
   var lId = new ObjectId(req.params.lkeId);

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noPermission, null, cb)) {
         cnn.collection("Likes").findOne({_id: lId, recipeId: rId}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb)
       && vld.checkPrsOK(response.ownerId.toString())) {
         cnn.collection("Likes").deleteOne({_id: lId, recipeId: rId}, cb);
      }
   }],
   function(err) {
      if (!err) res.status(200).end();
      else {
         console.log(err);
         res.status(500).end();
      }
   });
});

// Delete a dislike
router.delete('/:recipeId/Dlks/:dlkId', function(req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var rId = req.params.recipeId;
   var dId = new ObjectId(req.params.dlkId);

   async.waterfall([
   function(cb) {
      if (vld.check(req.session.id, Tags.noPermission, null, cb)) {
         cnn.collection("Dislikes").findOne({_id: dId, recipeId: rId}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb)
       && vld.checkPrsOK(response.ownerId.toString())) {
         cnn.collection("Dislikes").deleteOne({_id: dId, recipeId: rId}, cb);
      }
   }],
   function(err) {
      if (!err) res.status(200).end();
      else {
         console.log(err);
         res.status(500).end();
      }
   });
});
module.exports = router;
