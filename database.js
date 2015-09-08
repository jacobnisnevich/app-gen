"use strict";

var mysql = require("mysql");
var request = require("request");

var mysql_user = process.env.MYSQL_USERNAME.toString();
var mysql_pwd = process.env.MYSQL_PASSWORD.toString();

var connection = mysql.createConnection({
	host: "ec2-52-8-176-145.us-west-1.compute.amazonaws.com",
	user: mysql_user,
	password: mysql_pwd,
	database: "alex",
	insecureAuth: true
});

function isForeignString(string, percent) {
	var qCounter = 0;

	for (var i = 0; i < string.length; i++) {
		if (string[i] == "?") {
			qCounter++;
		}

		if (qCounter / string.length > percent) {
			return true;
		}
	}

	return false;
}

function populateWithNthPage(i, limit) {
	var payload = {
		"query": {
			"name": "Most Popular Apps",
			"platform": "android",
			"query_params": {
				"sort": "number_ratings",
				"from": i * 100,
				"num": 100,
				"sort_order": "desc",
				"content_rating": [],
				"cat_int": [],
				"downloads_lte": "",
				"downloads_gte": ""
			}
		}
	};	

	module.exports.appendPageToDB(payload);

	if (i < limit) {
		setTimeout(function() {
			populateWithNthPage(i + 1, limit);
		}, 1000);
	}
}


module.exports = {
	openConnection: function(success) {
		connection.connect(function(err, result) {
			if (err) {
				console.error("Error connecting to MYSQL Server: " + err.stack);
				return;
			} else {
				console.log("Connected to MYSQL Server");
				success();
			}
		});
	},
	closeConnection: function() {
		connection.end();
	},
	populateDB: function(pages) {
		populateWithNthPage(0, pages);
	},
	appendPageToDB: function(payload) {
		request({
			json: true,
			method: "POST",
			body: JSON.stringify(payload),
			url: "https://42matters.com/api/1/apps/query.json?access_token=83c894e79e27013f47d283734d7c46207f0887a2"
		}, function(err, res, body) {
			if (err) {
				console.error("Error receiving API data: " + err.stack);
				return;
			}

			body.results.forEach(function(app) {
				var post = {
					name: app.title,
					downloads: app.downloads,
					package: app.package_name,
					category: app.category,
					rating: app.rating,
					reviews: app.number_ratings,
					description: app.description,
					price: app.price
				};

				console.log(app.title);

				connection.query("INSERT INTO app_applist SET ?", post, function(err) {
					if (err) {
						console.error("Error inserting into MYSQL table: " + err.stack);
						return;
					}
				});
			});
		});
	},
	emptyDB: function(callback) {
		connection.query("DELETE FROM app_applist", function(err) {
			if (err) {
				console.error("Error deleting from MYSQL table: " + err.stack);
			}
			callback();
		});
	},
	clearForeignLanguageEntries: function(callback) {
		var success = true;

		connection.query("SELECT * FROM app_applist", function(err, result) {
			if (result) {		
				result.forEach( function(row) {
					if (isForeignString(row.description, 0.10) && success) {
						console.log(row.name);
						connection.query("DELETE FROM app_applist WHERE name='" + row.name + "'", function(err, result) {
							if (err) {
								success = false;
								return;
							}
							console.log(row.name + "was deleted successfully");
						});
					}
				});
			} else if (err) {
				success = false;
			}
			callback(success);
		});
	},
	getNames: function(category, limit, callback) {
		connection.query("SELECT name FROM app_applist WHERE category='" + category.toString() + "' LIMIT 0, " + limit.toString(), function(err, result) {
			callback(result);
		});
	},
	getDescriptions: function(category, limit, callback) {
		connection.query("SELECT description FROM app_applist WHERE category='" + category.toString() + "' LIMIT 0, " + limit.toString(), function(err, result) {
			callback(result);
		});
	},
	getCategoryCounts: function(callback) {
		connection.query("SELECT category, COUNT(NAME) AS `count` FROM app_applist GROUP BY category", function(err, result) {
			callback(result);
		});
	}
};