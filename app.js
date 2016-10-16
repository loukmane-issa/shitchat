var express = require('express');
var app = express();
var tropowebapi = require('tropo-webapi');
	
app.post('/', function(req, res){
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("Test webServer");
});

app.listen(3000);
console.log("listening");
