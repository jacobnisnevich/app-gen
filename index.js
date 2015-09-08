"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var database = require("./database");
var generator = require("./generator");
var app = express();

app.set("view engine", "html");
app.enable("view cache");
app.engine("html", require("hogan-express"));

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/public"));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/js", express.static(__dirname + "/js"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get("/", function(req, res) {
	res.render("index.html");
});

app.post("/getGeneratedAppDetails", function(req, res) {
	var appDetails = {
		"category": "",
		"name": "",
		"description": ""
	};

	var appNameLength = req.body.appNameLength || 5;
	var appDescriptionLength = req.body.appDescriptionLength || 10;

	var category = req.body.appCategory;
	appDetails.category = category;	
	database.getNames(category, 20, function(result) {
		generator.getAppName(result, appNameLength, function(name) {
			appDetails.name = name;
			database.getDescriptions(category, 20, function(result) {
				generator.getAppDescription(result, appDescriptionLength, function(description) {
					appDetails.description = description;
					res.send(appDetails);
				});
			});
		});
	});

});

app.post("/getStatistics", function(req, res) {
	database.getStatistics(req.body.stat, function(result) {
		res.send(result);
	});
});

app.get("/updateDatabase", function(req, res) {
	database.emptyDB(function() {
		database.populateDB(10);
		database.clearForeignLanguageEntries(function(success) {
			res.send({
				"success": success
			});
		});
	});
});

app.listen(app.get("port"), function() {
	console.log("Node app is running at localhost:" + app.get("port"));
});