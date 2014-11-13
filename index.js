var request = require('request');
var express = require('express');
var database = require('./database');
var gram = require('./gram');
var app = express();

var constant = 1;

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

var apiKey = '54f83928fbeec5b60aa70187744ca1ed';
var category = 'game';
var url = 'http://api.playstoreapi.com/v1.1/top/apps/' + category + '?key=' + apiKey;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));

desc = "The numbers! In the, table specify the first! Browser version that fully. supports the method. This is, another sentence?";
map = {};
console.log(desc + '\n');
console.log(gram.twoGramMapper(desc, map));

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

	database.populateDB(payload);

	if (i < limit) {
		setTimeout(function() {
			populateWithNthPage(i + 1, limit);
		}, 1000);
	}
}

app.get('/', function(req, res) {
  res.render('index.html')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})