var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Rat';

router.get('/:recipeId', function(req, res) {
   var vld = validator;

   async.waterfall([
   function(cb) {
      req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         res.status(200).json(response);
      }
   }],
   function(err) {
      // something?
   });
});

router.post('/:recipeId/Cmts', function (req, res) {
   var vld = validator;
   var newComment;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         newComment = {'dateAdded': new Date(), 
          'ownerId': req.session.id, 'comment': req.body.comment};
         req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
      }
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         req.cnn.RecipeRating.updateMany($push: {comments: newComment}, 
          {recipeId :req.params.recipeId});
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.post('/:recipeId/Lkes', function(req, res) {
   var vld = validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
      }
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         req.cnn.RecipeRating.updateMany($inc: {likes: 1},
          {recipeId :req.params.recipeId});
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.delete('/:recipeId/Lkes', function(req, res) {
   var vld = validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
      }
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         req.cnn.RecipeRating.updateMany($inc: {likes: -1},
          {recipeId :req.params.recipeId});
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.post('/:recipeId/Dlks', function(req, res) {
   var vld = validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
      }
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         req.cnn.RecipeRating.updateMany($inc: {dislikes: 1},
          {recipeId :req.params.recipeId});
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.delete('/:recipeId/Dlks', function(req, res) {
   var vld = validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.RecipeRating.find({recipeId: req.params.recipeId});
      }
   },
   function(response, cb) {
      if (vld.check(response.length, Tags.notFound, null, cb)) {
         req.cnn.RecipeRating.updateMany($inc: {dislikes: -1},
          {recipeId :req.params.recipeId});
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});
















