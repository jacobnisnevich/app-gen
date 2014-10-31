var express = require('express')
var app = express();
var request     = require('request');

var apiKey      = '54f83928fbeec5b60aa70187744ca1ed';
var category = 'game';

var url = 'http://api.playstoreapi.com/v1.1/top/apps/' + category + '?key=' + apiKey;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

request({ url: url, json: true }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      	//var parsedResponse = JSON.parse(body.toString());
      	for (var i = 0; i < body["topselling_paid"].length; i++) {
	  		console.log((body["topselling_paid"][i]).toString());
	  	}
    }
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})