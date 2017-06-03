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

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var admin = req.session.isAdmin();
   var cnn = req.cnn;

   async.waterfall([
   function (cb) {
      if (vld.checkPrsOK(req.params.id, cb) &&
      vld.chain(!body.role || admin, Tags.badValue, ["role"])
      .chain(!(body.role < 0), Tags.badValue, ["role"])
      .chain(!body.hasOwnProperty("email"), Tags.forbiddenField, ["email"])
      .chain(!body.hasOwnProperty("whenRegistered"),
      Tags.forbiddenField, ["whenRegistered"])
      .chain(!body.hasOwnProperty("termsAccepted"),
      Tags.forbiddenField, ["termsAccepted"])
      .check(!body.hasOwnProperty("password") || body.oldPassword
       || admin, Tags.noOldPwd, null, cb))
         cnn.chkQry("db.User.find({id: ?});",
          [req.params.id], cb);
   },

   function (qRes, fields, cb) {
      if (vld.check(admin || !body.hasOwnProperty("password") ||
       qRes[0].password === body.oldPassword, Tags.oldPwdMismatch, null, cb)) {

         delete req.body.oldPassword;
         cnn.chkQry("db.User.updateMany({set:?}, {id: ?})",
          [req.body, req.params.id], cb);
      }
   },

   function (updRes, fields, cb) {
      res.status(200).end();
      cb();
   }],

   function (err) {
      if (err)
         res.status(500).end();
      cnn.release();
   });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkAdmin())
      req.cnn.query('db.User.deleteMany({id: ?})', [req.params.id],
      function (err, result) {
         if (vld.check(result.affectedRows, Tags.notFound) || !err)
            res.status(200).end();
         req.cnn.release();
      });

   else {
      req.cnn.release();
   }
});

module.exports = router;
