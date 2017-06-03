var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');
var mysql = require('mysql');

router.baseURL = '/Prss';


/* Much nicer versions */
router.get('/', function(req, res) {
   var email = req.session.isAdmin() && req.query.email ||
    !req.session.isAdmin() && req.query.email;

   var handler = function(err, prsArr) {
      if (err)
         res.status(500).end();

      // if student is trying to access another accounts information
      if (!req.session.isAdmin() && prsArr.length &&
      prsArr[0].id !== req.session.id) {
         res.json([]);
      }
      else
         res.json(prsArr);

      req.cnn.release();
   };

   if (email && req.session.isAdmin()) {
      req.cnn.chkQry('db.User.find({"email": /?/}, {"id": 1,"email": 1});',
       [email], handler);
   }

   else if (email) {
      req.cnn.chkQry('db.User.find({"email": /?/}, {"id": 1,"email": 1});' +
      'and id = ?', [email, req.session.id],
       handler);
   }

   // Empty email but is admin. Should return all emails
   else if (req.session.isAdmin()) {
      req.cnn.chkQry('db.User.find({}, {"id": 1,"email": 1});', null, handler);
   }

   // Empty email but is not an admin. Should only return self email
   else {
      req.cnn.chkQry('db.User.find({"id": ?}, {"id": 1,"email": 1});',
       [req.session.id], handler);
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*"; // Blocking password
   body.whenRegistered = new Date();

   async.waterfall([
   function(cb) { // Check properties and search for Email duplicates

      if (vld.hasFields(body, ["email", "lastName", "password", "role"], cb) &&
       vld.chain(body.role === 0 || admin, Tags.noPermission)
       .chain(body.email, Tags.missingField, ["email"])
       .chain(body.lastName, Tags.missingField, ["lastName"])
       .chain(body.termsAccepted || admin, Tags.noTerms)
       .chain(body.password, Tags.missingField, ["password"])
       .check(body.role >= 0, Tags.badValue, ["role"], cb)) {
         cnn.chkQry('db.User.find({"email": ?});', body.email, cb);
      }
   },

   function(existingPrss, fields, cb) {  // If no duplicates, insert new Person
      if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
         body.termsAccepted = body.termsAccepted && new Date();
         if (!body.termsAccepted)
            body.termsAccepted = null;
         cnn.chkQry('db.User.insertOne(?)', body, cb);
       }
   },

   function(result, fields, cb) { // Return location of inserted Person
      res.location(router.baseURL + '/' + result.insertId).end();
      cb();
   }],

   function(err) {
      if (err)
         res.status(500).end();
      cnn.release();
   });
});

router.get('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      req.cnn.query('db.User.find({"id": ?})', [req.params.id],
      function(err, prsArr) {
         if (vld.check(prsArr.length, Tags.notFound)) {
            res.json([{
               id: prsArr[0].id,
               email: prsArr[0].email,
               firstName: prsArr[0].firstName,
               lastName: prsArr[0].lastName,
               role: prsArr[0].role,
               termsAccepted: prsArr[0].termsAccepted,
               whenRegistered: prsArr[0].whenRegistered
            }]);
         }
         req.cnn.release();
      });
   }

   else {
      req.cnn.release();
   }
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
