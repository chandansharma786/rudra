var http = require("http");
var url = require('url');
var db = require('mongodb');
var body;
http.createServer (function(request, response) {
  // var query = url.parse(request.url,true).query;
  // var json = JSON.stringify(query);
  if(request.method == 'POST') {
      var qs = require('querystring');
      console.log('post request')
      request.on('data', function (data) {
            body = data;
            console.log(body)
            response.end("{'success':'true'}")
            request.connection.destroy();
        });

        request.on('end', function () {
          console.log("body content: " + body.toString());
          var obj = JSON.parse(body.toString());
          var name = obj.name;
          var password = obj.password;

          //creating connection with mongodb
          var MongoClient = db.MongoClient;
          MongoClient.connect("mongodb://localhost:27017/changdb", function(err, db) {
            if(!err) {
              console.log("We are connected");
              //MongoClient.
            }
          });

          console.log('response name check : ' + obj.name)
          var post = qs.parse(body);
        });
  } else {
    console.log('get request')
  }
}).listen(8081);
console.log("server running at port : " + 8081)
