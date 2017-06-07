var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');

var async = require('async');

var app = express();

// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'public')));

// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// Check general login.  If OK, add Validator to |req| and continue processing,
// otherwise respond immediately with 401 and noLogin error tag.
app.use(function(req, res, next) {
   console.log(req.path);
   if (req.session || (req.method === 'POST' &&
    (req.path === '/Prss' || req.path === '/Ssns'))) {
      req.validator = new Validator(req, res);
      next();
   }

   else
      res.status(401).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);


app.use('/Prss', require('./Routes/Account/Prss.js'));
app.use('/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/Rcp', require('./Routes/Recipe/Recipe.js'));
app.use('/Rat', require('./Routes/Recipe/RecipeRatings.js'));
app.use('/Fridge', require('./Routes/Fridge/Fdg.js'));
app.use('/Proxy', require('./Routes/Proxy/Proxy.js'));

app.delete('/DB', function(req, res) {

   // Callbacks to clear tables
   if (req.validator.checkAdmin())
   var cbs = ["User", "Recipe", "RecipeRating", 'Fridge'].map(function(tblName) {
      return function(cb) {
         req.cnn.collection(tblName).remove({}, cb);
      };
   });
   var adminUser = {firstName: 'admin', lastName: 'adminL', password: 'password',
    whenRegistered: new Date(), role: 1,
    email: 'admin@mp.com', termsAccepted: true};

   // Callback to reinsert admin user
   if (req.validator.checkAdmin())
   cbs.push(function(cb) {
      req.cnn.collection('User').insertOne(adminUser, cb);
   });

   // Callback to clear sessions, release connection and return result
   if (req.validator.checkAdmin()) {
      cbs.push(function(callback){
         for(var session in Session.sessions)
            delete Session.sessions[session];
         callback();
      });
   }

   if (req.session && req.session.isAdmin()) {
      async.series(cbs, function(err) {
         if (err)
            res.status(400).json(err);
         else
            res.status(200).end();
      });
   }
   else {
      res.status(403).end();
   }
});

// Handler of last resort. Send a 500 response.
app.use(function(req, res, next) {
   res.status(404).end();
});

// Parse out command line arguments for a -p port flag
var port = 8080; // Default port
process.argv.forEach(function (val, index, array) {
   if (val === "-p")
      port = process.argv[index + 1];
});

app.listen(port, function () {
   console.log('App Listening on port ' + port);
});
