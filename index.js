var request = require('request');
var express = require('express')
var app = express();

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

var apiKey = '54f83928fbeec5b60aa70187744ca1ed';
var category = 'game';
var url = 'http://api.playstoreapi.com/v1.1/top/apps/' + category + '?key=' + apiKey;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use("/styles", express.static(__dirname + '/styles'));

var payload = {
	"query": {
		"name": "Most Popular Apps",
		"platform": "android",
		"query_params": {
			"sort": "number_ratings",
			"from": 0,
			"num": 100,
			"sort_order": "desc",
			"content_rating": [],
			"cat_int": [],
			"downloads_lte": "",
			"downloads_gte": ""
		}
	}
}

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'MySQLC6.webcontrolcenter.com',
	user: 'alex',
	password: 'dbREh1FKeO0Iea',
	database: 'alex',
	insecureAuth: true
});

connection.connect(function(err) {
	if (err) {
		console.error('Error connecting to MYSQL Server: ' + err.stack);
		return;
	}
	console.log('Connected to MYSQL Server');
});

request({
	json: true,
	method: 'POST',
	body: JSON.stringify(payload),
	url: 'https://42matters.com/api/1/apps/query.json?access_token=83c894e79e27013f47d283734d7c46207f0887a2'
}, function(err, res, body) {
	for (var i = 0; i < body.results.length; i++) {
		var post = {
			name: body.results[i].title,
			package: body.results[i].package_name,
			category: body.results[i].category,
			rating: body.results[i].rating,
			reviews: body.results[i].number_ratings,
			description: body.results[i].description
		};

		var query = connection.query('INSERT INTO app_applist SET ?', post, function(err, result) {
			if (err) {
				console.error('Error inserting into MYSQL table: ' + err.stack);
				return;
			}
		});
	}
})

app.get('/', function(req, res) {
  res.render('index.html')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})