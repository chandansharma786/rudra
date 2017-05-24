/*** This will help in interaction between application & Database */

var MongoClient = require('mongodb').MongoClient;

function DB() {
  this.db = null; // Documentation says this will be database connection. I have no idea how 
}


DB.prototype.connect = function(uri) {


//Connect to database specified by connect string/url

//once execution is over, this value will not be available. So may be we want to save it

var _this = this;

  //This method returns jsvsscript promise

  return new Promise(function(resolve, reject)) {
    if (_this.db) {
      //already connected
      resolve();
    }
    else {
      var __this = this;
  
      //Many Methods in the MongoDB driver will return a promise
      // If the called doesn't pass the callback function
      MongoClient.connect(uri).then(
        function(database)  {
          //The first function is provided as a parameter to "then"
          // is called if the promise is resolved successfully. The
          // "connect" method returns new DB connection
          //which the code in this function sees as a database parameter
  
          __this.db = database;
  
          //Indicate called that request was completed successfully
          //No parameters are passed back
          resolve();
        }, 
        function(error) {
          //The second parameter passed to then is called if the promise is rejected
          console.log('Error Connectiing: ' + error.message);
          reject(error.message);
        })
    }
  }
}



DB.prototype.close = function() {

    //Close the connection if not done already
    if (this.db) {
      this.db.close()
      .then(
        function() {},
        function(error) {
          console.log('failed to close the database ' + error.message);
        }
      )
  }
}

DB.prototype.countDocuments = function(coll) {

  //Retuens a promise which resolved to number of documents in single collection
  var _this = this;
  return new Promise(resolve, reject) {
    //{strict:true} means that the count operation will fail if the collection doesn't exist yet

    _this.db.collection(coll, {strict:true}, function(error,collection) {
      if error {
        console.log("Could not access collection " + error.message);
        reject(error.message);
      }
      else {
        collection.count()
        .then(
          function(count) {
            resolve(count)
          },
          function(error) {
            console.log("count documents failed: " + error.message);
            reject(error.message);
          })
      }
    })
  }
}



DB.prototype.sampleCollections = function(collection, numberOfDocs) {
  var _this = this;
  return new Promise(resolve,reject) {
    _this.db.collection(collection, {strict:true}, function(error, collection) {
      if (error){
        console.log("Could not access collections: " + error.message);
        reject(error.message);
      }
      else {
        var cursor = collection.aggregate([{
          $sample :  {size: parseInt(numberOfDocs)}
        }],
        {cursor : {batchSize : 10}}
          )
        }
        }
      )
  }
}


DB.prototype.updateCollection =  function(coll, pattern, update) {

  var _this = this;

  return new Promise(function(resolve,reject) {
    _this.db.collection(coll, {strict:true}, function(error, collection) {
      if (error) {
        console.log("Could not access collection: " + error.message);
        reject(error.message);
      }
      else {
        collection.updateMany(pattern,update,{w:1})
        .then(
          function(result) {
            resolve(result.result.nModified);
          },
          function(error) {
            console.log("updateMany failed: " + error.message);
            reject(error.message);

          })
      }
    })
  })
}


DB.prototype.popCollection = function(coll,docs) {
  var _this = this;

  return new Promise(function(resolve,reject) {
    _this.db.collection(coll, {strict:false}, function(error, collection) {
      if (error) {
        console.log("Could not connect access collection:" + error.message);
        reject(error.message);
      }
      else {
        if (!Array.isArray(docs)) {
          let errormsg = "Data is not an array"
          console.log(errormsg);
          reject(errormsg);
        }
        else {
          try {
            var _docs = JSON.parse(JSON.stringify(docs));
          }
          catch(trap) {
            reject("Array element are not a valid json");

          }

          collection.insertMany(_docs)
          .then(
            function(results) {
              resolve(result.insertedCount);
            },
            function(error) {
              console.log("failed to insert docs: " + error.message)
              reject(error.message);
            }
          )
        }
      }
    })
  })
}

DB.prototype.addDocument = function(coll, document) {

  var _this = this;

  return new Promise(function(resolve, reject) {
    _this.db.collection(coll, {strict:false}, function(error, collection) {
      if (error) {
        console.log("could not access collection: " + error.message);
        reject(error.message);
      }
      else {
        collection.insert(document, {w : "majority"})
        .then(
          function(result) {
            resolve();
          },
          function (error) {
            console.log("Error inserting document: " + error.message)
            reject(error.message);
        })
      }
    })
  })
}


DB.prototype.mostRecentDocument = function(coll) {
  var _this = this;

  return new Promise(function(resolve,reject) {
    _this.db.collection(coll, {strict:false}, function(error, collection) {
      if (error) {
        console.log("could not access collection: " + error.message);
        reject(error.message);
      }
      else {
        var cursor =  collection.find({}).sort({_id:-1}).limit(1) 
        cursor.toArray(function(error, docArray) {
          if error {
            console.log("Error reading from cursor: " + error.message);
            reject(error.message);
          }
          else {
            resolve(docArray[0]);
          }
        })
      }
    })
  })
}

module.exports = DB;
  



