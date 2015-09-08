"use strict";

var mysql = require("mysql");
var request = require("request");

var mysql_user = process.env.MYSQL_USERNAME.toString();
var mysql_pwd = process.env.MYSQL_PASSWORD.toString();

var connectionObject = {
	host: "jacob-aws.cksaafhhhze5.us-west-1.rds.amazonaws.com",
	user: mysql_user,
	password: mysql_pwd,
	database: "jacob",
	insecureAuth: true
};

var connection = mysql.createConnection(connectionObject);

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
		connection.connect(function(err) {
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
						connection.query("DELETE FROM app_applist WHERE name='" + row.name + "'", function(err) {
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
	},
	getStatistics: function(type, callback) {
		var query = "";

		switch (type) {
			case "appCount":
				query = "SELECT category, COUNT(category) AS 'appCount' FROM app_applist GROUP BY category";
				break;
			case "averageRating":
				query = "SELECT category, AVG(rating) AS 'averageRating' FROM app_applist GROUP BY category";
				break;
			case "averageReviewsCount":
				query = "SELECT category, ROUND(AVG(reviews), 0) AS 'averageReviewsCount' FROM app_applist GROUP BY category";
				break;
			case "averagePrice":
				query = "SELECT category, ROUND(AVG(REPLACE(price, '$', '')), 2) AS 'averagePrice' FROM app_applist WHERE price <> '' GROUP BY category";
				break;
		}

		connection.query(query, function(err, result) {
			callback(result);
		});
	}
};