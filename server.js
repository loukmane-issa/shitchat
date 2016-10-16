var tropowebapi = require('tropo-webapi');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shitchat"
});


con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


app.use(bodyParser.json());


app.post('/', function(req, res){
	var tropo = new tropowebapi.TropoWebAPI();
	tropo.say("       ");
	tropo.say("Welcome to shit chat!");
	
	var say = new Say("Do you wanna chat with a random person who is in the toilet?");
	var choices = new Choices("yes, no");
	tropo.ask(choices, 3, false, null, "foo", null, true, say, 5, null);
	tropo.on("continue", null, "/answer", true);
	res.send(tropowebapi.TropoJSON(tropo));
});

app.post('/answer', function(req, res){
	var tropo = new tropowebapi.TropoWebAPI();
	if(req.body['result']['actions']['interpretation']=="yes"){
		con.query('SELECT * from states WHERE id = (SELECT MIN(id) FROM states WHERE nbParticipants<2)', function(err, rows){
			if(err) throw err; 
			else {
				var chatroomId = 0;
				console.log(rows);
				if(rows.length>0)
					chatroomId = rows[0].id.toString();
				
				con.query('UPDATE states SET nbParticipants = nbParticipants+1 WHERE id='+chatroomId);
				if(rows[0].nbParticipants < 1)
					tropo.say("You will now be in the room: "+chatroomId+" waiting for another person to enter the toilets.");
				else
					tropo.say("You are now in the room: " + chatroomId + " with another user in the toilet!");
				tropo.conference(chatroomId, false, "conference", null, null, "#"); 
				tropo.say("We hope you had fun, call back soon!");
				res.end(tropowebapi.TropoJSON(tropo));
				
			}
		});
	}
	else{
		tropo.say("I get it, you wanna be alone, Enjoy!");
	//tropo.say("You just said:" + req.body['result']['actions']['interpretation']);
	res.end(tropowebapi.TropoJSON(tropo));
	}
});

app.listen(3000);
console.log('Server running on http://0.0.0.0:8000/');
