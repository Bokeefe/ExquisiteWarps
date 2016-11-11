/* jshint esversion:6 */
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
	console.log("Did I get this far?");
	res.sendFile(__dirname + '/index.html'); 
});

app.get('/tracks', (req, res) => {
	 res.sendFile(__dirname + '/tracks.JSON');
	console.log(res);
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