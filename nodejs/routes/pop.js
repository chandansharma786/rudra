/* Defines the implementation of MongoDB Restful API by adding 'get' and 'post' routes to the router */

var getIP = require("external-ip")();
var request = require("request");
var express = require("express");
var router = express.Router();


var config = require("../config.js");
var DB = require("../javascripts/db");

var publicIP;


getIP(function(err, ip) {
	if (err) {
		console.log("Failed to retrive IP Address: "  + err.message);
		throw err
	}
	console.log("MongoPop1 API running on IP " + ip + ":" + config.expressPort);
})

router.get('/', function(req,res,next) {
	console.log("not happy");
	var testObject = {
		"AppVersion" : "MongoPop",
		"version" : "1.0"
	} 

	res.json(testObject);
})

router.get('/run1', function(req,res,next) {
	console.log("ok Running");
	var testObject = {
		"status" : "Running"
	} 

	res.json(testObject);
})


module.exports = router;
