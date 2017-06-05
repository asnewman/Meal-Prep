var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mongodb = require('mongodb');

router.baseURL = '/Prss';


/* Much nicer versions */
router.get('/', function(req, res) {

   var handler = function(err, prsArr) {
      if (err)
         res.status(500).end();

      res.json(prsArr);
   };
   // Empty email but is not an admin. Should only return self email
   req.cnn.collection('User').findOne({_id: req.session.id},
    {id: 1, email: 1, firstName: 1, lastName: 1}, handler);
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var cnn = req.cnn;

   body.whenRegistered = new Date();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates

      if (vld.hasFields(body, ["email", "lastName", "password"], cb) &&
       vld.chain(body.email, Tags.missingField, ["email"])
       .chain(body.lastName, Tags.missingField, ["lastName"])
       .chain(body.termsAccepted, Tags.noTerms)
       .chain(body.password, Tags.missingField, ["password"])) {
         cnn.collection('User').findOne({email: body.email}, cb);
      }
   },

   function(existingPrss, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss, Tags.dupEmail, null, cb)) {
         body.termsAccepted = body.termsAccepted && new Date();
         if (!body.termsAccepted)
            body.termsAccepted = null;
         cnn.collection('User').insertOne(body, cb);
       }
   },

   function(result, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result._id).end();
      cb();
   }],

   function(err) {
      if (err)
         res.status(500).end();
   });
});

router.put('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
   function (cb) {
      console.log(req.session.id);
      if (vld.chain(!body.hasOwnProperty("email"),
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
router.delete('/', function(req, res) {
   var vld = req.validator;

   req.cnn.collection('User').deleteOne({_id: req.session.id},
   function (err, result) {
      if (vld.check(result.deletedCount, Tags.notFound) || !err)
         res.status(200).end();
   });
});

module.exports = router;
