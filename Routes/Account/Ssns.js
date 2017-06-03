var Express = require('express');
var CnnPool = require('../CnnPool.js');
var Tags = require('../Validator.js').Tags;
var ssnUtil = require('../Session.js');
var router = Express.Router({caseSensitive: true});

router.baseURL = '/Ssns';

router.get('/', function(req, res) {
   var body = [], ssn;

   if (req.validator.checkAdmin()) {
      for (var cookie in ssnUtil.sessions) {
         ssn = ssnUtil.sessions[cookie];
         body.push({cookie: cookie, prsId: ssn.id, loginTime: ssn.loginTime});
      }
      res.status(200).json(body);
   }
});

router.post('/', function(req, res) {
   var cookie;
   var cnn = req.cnn;
   cnn.collection('User').findOne({email: req.body.email},
   function(err, result) {
      // result.toArray(function(err, doc) {
      //       console.log(doc);
      // });
      if (req.validator.check(result && result.password ===
       req.body.password, Tags.badLogin)) {
         cookie = ssnUtil.makeSession(result, res);
         res.location(router.baseURL + '/' + cookie).status(200).end();
      }

      if (err)
         res.status(500).end();
   });
});

router.delete('/:cookie', function(req, res, next) {

   if (req.validator.check(req.session.isAdmin() ||
    req.params.cookie === req.cookies[ssnUtil.cookieName],
    Tags.noPermission)) {
      ssnUtil.deleteSession(req.params.cookie);
      res.status(200).end();
   }
});

router.get('/:cookie', function(req, res, next) {
   var cookie = req.params.cookie;
   var vld = req.validator;

   if (vld.check(ssnUtil.sessions[cookie], Tags.notFound) &&
    vld.checkPrsOK(ssnUtil.sessions[cookie].id)) {
      res.json({cookie: cookie,
               prsId: ssnUtil.sessions[cookie].id,
               loginTime: ssnUtil.sessions[cookie].loginTime});
   }
});

module.exports = router;
