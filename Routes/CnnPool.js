var MongoClient = require('mongodb').MongoClient;
var mongoURI = 'mongodb://localhost:27017/MealPrep';

var CnnPool = function() {
   var poolCfg = require('./connection.json');

   poolCfg.connectionLimit = CnnPool.PoolSize;
   MongoClient.connect(mongoURI, {
     poolSize: CnnPool.PoolSize

   },function(err, db) {
      if (!err) {
         this.mongodb = db;
      }
      else {
         console.log(JSON.stringify(err));
      }
   }
   );
};

CnnPool.PoolSize = 4;


// Router function for use in auto-creating CnnPool for a request
CnnPool.router = function(req, res, next) {
   console.log("Getting connection");
   req.cnn = this.mongodb;
   console.log("Connection Acquired");
   next();
};

// The one (and probably only) CnnPool object needed for the app
CnnPool.singleton = new CnnPool();
module.exports = CnnPool;
