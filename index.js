"use strict";

var express = require("express");
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

app.get("/", function(req, res) {
	res.render("index.html");
});

app.get("/getAppName", function(req, res) {
	database.getNames(20, function(result) {
		res.send(generator.getAppName(result, 5));
	});
});

app.get("/getAppDescription", function(req, res) {
	database.getDescriptions(20, function(result) {
		res.send(generator.getAppDescription(result, 20));
	});
});

app.get("/getAppCategory", function(req, res) {
	database.getCategoryCounts(function(result) {
		res.send(generator.getAppCategory(result));
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