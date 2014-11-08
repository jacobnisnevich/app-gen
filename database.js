var mysql = require('mysql');
var request = require('request');
var sequelize = require('sequelize');

var mysql_user = process.env.MYSQL_USERNAME.toString();
var mysql_pwd = process.env.MYSQL_PASSWORD.toString();

var db = new sequelize('alex', mysql_user, mysql_pwd, {
	dialect: 'mysql',
	host: 'MySQLC6.webcontrolcenter.com',
	dialectOptions: {
		insecureAuth: true
	}
});

db.query("SELECT * FROM app_applist").success(function(myTableRows) {
	// 	console.log(myTableRows);
})

var connection = mysql.createConnection({
	host: 'MySQLC6.webcontrolcenter.com',
	user: mysql_user,
	password: mysql_pwd,
	database: 'alex',
	insecureAuth: true
});

function connectToDB() {
	connection.connect(function(err) {
		if (err) {
			console.error('Error connecting to MYSQL Server: ' + err.stack);
			return;
		}
		console.log('Connected to MYSQL Server');
	});
}

module.exports = {
	populateDB: function (payload) {
		connectToDB();

		request({
			json: true,
			method: 'POST',
			body: JSON.stringify(payload),
			url: 'https://42matters.com/api/1/apps/query.json?access_token=83c894e79e27013f47d283734d7c46207f0887a2'
		}, function(err, res, body) {
			if (err) {
				console.error('Error receiving API data: ' + err.stack);
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

				var query = connection.query('INSERT INTO app_applist SET ?', post, function(err, result) {
					if (err) {
						console.error('Error inserting into MYSQL table: ' + err.stack);
						return;
					}
				});
			});
		})
	}
};