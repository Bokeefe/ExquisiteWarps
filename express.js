/* jshint esversion:6 */
var fs = require("fs");
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.port || 8080;

mongoose.Promise = global.Promise; 
mongoose.connect("mongodb://localhost");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	secret: 'hghvjkiouyutfghjhjgtyr6t78yiujknliuytre456rtfghiuhgftr5',
	resave: false,
	saveUninitialized: false
}));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html'); 

});

app.get('/png',(req,res) => {
		res.sendFile(__dirname + '/public/ex.png');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/login.html'); 
});

app.get('/tracks', (req, res) => {
	res.sendFile(__dirname + '/public/tracks.json');
});

app.post('/punch', (req, res) => { 
	// fs.writeFile('./public/tracks.json', req.body.trackData, (err) => {
 //  		if (err) throw err;
 //  			res.send("success");
	// });
});

app.post('/public/corpseKeeper', (req, res) => { 
	fs.readFile('./public/corpseKeeper.json', req.body, (err) => {
  		if (err) throw err;
  			res.send(res);
	});
});



app.post('/delete', (req, res) => { 
	fs.writeFile('./public/tracks.json', req.body.trackDel, (err) => {
  		if (err) throw err;
  			console.log("track deleted");
  			res.send("success");
	});
});



app.post('/timeStamp', (req, res) => { 
	fs.writeFile('./public/corpseKeeper.json', req.body.update, (err) => {
  		if (err) throw err;
  			res.send("success");
	});
});



////////
app.use(express.static('public'));

// 404 error handling
app.use((req, res, next) => {
	res.status(404);
	console.error('404 - ' + req.url);
	res.send({status: 'Error', message: '404 - File not found'});
});

// 500 error handling
app.use((err, req, res, next) => {
	res.status(500);
	console.error('Server error: ' + err);
	res.send({status: 'Error', message: '500 - Server Error'});
});

// start the server
app.listen(PORT, () => {
	console.info('Server started on http://localhost:' + PORT);
});