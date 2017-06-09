var Express = require('express');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

router.baseURL = '/Prss';


/* Much nicer versions */
router.get('/:id', function(req, res) {

   var handler = function(err, prsArr) {
      if (err) {
         res.status(500).end();
      }
      else {
         res.json(prsArr);
      }
   };

   if (req.params.id !== req.session.id.toString()) {
      res.status(403).end();
   }
   // Empty email but is not an admin. Should only return self email
   else {
      req.cnn.collection('User').findOne({_id: req.session.id},
       {id: 1, email: 1, firstName: 1, lastName: 1}, handler);
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var cnn = req.cnn;

   body.whenRegistered = new Date();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates

      if (vld.hasFields(body, ["email", "lastName", "password"], cb) &&
       vld.chain(!body.role, Tags.noPermission)
       .chain(body.email, Tags.missingField, ["email"])
       .chain(body.lastName, Tags.missingField, ["lastName"])
       .chain(body.termsAccepted, Tags.noTerms)
       .check(body.password, Tags.missingField, ["password"], cb)) {
         cnn.collection('User').findOne({email: body.email}, cb);
      }
   },

   function(existingPrss, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss, Tags.dupEmail, null, cb)) {
         body.termsAccepted = body.termsAccepted && new Date();
         body.role = 0;
         cnn.collection('User').insertOne(body, cb);
       }
   },

   function(result, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertedId).end();
      cb();
   }],

   function(err) {
      if (err)
         res.status(500).end();
   });
});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function (cb) {
      if (vld.chain(
       req.params.id === req.session.id.toString(), Tags.noPermission)
       .chain(!body.role, Tags.badValue, ['role'])
       .chain(!body.hasOwnProperty("email"),
       Tags.forbiddenField, ["email"])
       .chain(!body.hasOwnProperty("whenRegistered"),
       Tags.forbiddenField, ["whenRegistered"])
       .chain(!body.hasOwnProperty("termsAccepted"),
       Tags.forbiddenField, ["termsAccepted"])
       .check(!body.hasOwnProperty("password") || body.oldPassword
       , Tags.noOldPwd, null, cb))
         cnn.collection('User').findOne({_id: req.session.id}, cb);
   },

   function (qRes, cb) {
      if (vld.check(!body.hasOwnProperty("password") ||
       qRes.password === body.oldPassword, Tags.oldPwdMismatch, null, cb)) {
         delete req.body.oldPassword;
         cnn.collection('User').updateOne({_id: req.session.id}, {$set:body},
          cb);
      }
   },

   function (updRes, cb) {
      res.status(200).end();
      cb();
   }],

   function (err) {
      if (err)
         res.status(500).end();
   });
});

/* Only allow deleting of currently logged in user */
router.delete('/:id', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.params.id === req.session.id.toString(), 
       Tags.noPermission, null, cb)) {
         req.cnn.collection('User').deleteOne({_id: req.session.id}, cb);
      }
   },
   function (result, cb) {
      if (vld.check(result.deletedCount, Tags.notFound, null, cb)) {
         req.cnn.collection('Recipe').deleteMany(
          {ownerId: req.session.id}, cb);
      }
   },
   function (result, cb) {
      ssnUtil.deleteSession(req.cookies[ssnUtil.cookieName]);
      cb()
   }],
   function(err) {
      if (!err)
         res.status(200).end();
   });
});

// Ingredients resource

router.get('/:id/Ingr', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Fridge').find({ownerId: req.params.id}, 
          {ingredient: 1}).toArray(function(err, docs) {
            if (err) cd(err);
            cb(err, docs); // no errors
         })
      }
   },
   function(ingrs, cb) {
      if (vld.checkPrsOK(req.params.id)) { // makes sure owner
         res.status(200).json(ingrs);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
   });
});

router.post('/:id/Ingr', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Fridge').findOne({ingredient: req.query.name, 
          ownerId: req.params.id}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(!response, Tags.dupIngredient, null, cb)) {
         req.cnn.collection('Fridge').insertOne({ingredient: req.query.name, 
          ownerId: req.params.id}, cb);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
      else res.status(200).end();
   });
})

router.delete('/:id/Ingr/:itemId', function(req, res) {
   vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)
       && vld.checkPrsOK()) {
         req.cnn.collection("Fridge").findOne(
          {_id: new ObjectId(req.params.itemId), 
          ownerId: req.params.id}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb)) {
         req.cnn.collection("Fridge").deleteOne(
          {_id: new ObjectId(req.params.itemId),
          ownerId: req.params.id}, cb);
      }
   }],
   function(err) {
      if (err) res.status(500).end();
      else res.status(200).end();
   });
});

// Recipe resources 

router.get('/:id/Mels', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if(vld.check(req.session, Tags.noPermission, null, cb)
       && vld.checkPrsOK(req.params.id)) {
         req.cnn.collection('Recipe').find(
          {ownerId: req.params.id}).toArray(function(err, docs) {
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

router.post('/:id/Mels', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if(vld.check(req.session, Tags.noPermission, null, cb) &&
       vld.hasFields(req.body, ["recipeId", "date"], cb) &&
       vld.checkPrsOK(req.params.id)) {
         req.cnn.collection('Recipe').insertOne({recipeId: req.body.recipeId,
          date: req.body.date, ownerId: req.params.id}, cb);
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

router.delete('/:id/Mels/:mealId', function(req, res) {
   var vld = req.validator;

   async.waterfall([
   function(cb) {
      if (vld.check(req.session, Tags.noPermission, null, cb)) {
         req.cnn.collection('Recipe').findOne(
          {_id: new ObjectId(req.params.mealId)}, cb);
      }
   },
   function(response, cb) {
      if (vld.check(response, Tags.badValue, null, cb) && 
       vld.check(response.ownerId == req.params.id, 
       Tags.noPermission, null, cb) &&
       vld.checkPrsOK(req.params.id)) {
         req.cnn.collection('Recipe').deleteOne(
          {_id: new ObjectId(req.params.mealId)}, cb);
      }
   }],
   function(err) {
      if (!err) {
         res.status(200).end();
      }
   });
});

module.exports = router;






























