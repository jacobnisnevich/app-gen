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

request({ url: url, json: true }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      	for (var i = 0; i < body["topselling_paid"].length; i++) {
	  		console.log((body["topselling_paid"][i]).toString());
	  	}
    }
});

app.get('/', function(req, res) {
  res.render('index.html')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})