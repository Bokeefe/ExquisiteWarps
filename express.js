/* jshint esversion:6 */
var fs = require("fs");
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 8000;
var User = require('./UserSchema.js')(mongoose);
mongoose.connect("mongodb://localhost");
mongoose.Promise = global.Promise; 
// var uristring = 
//   process.env.MONGODB_URI || 
//   'mongodb://<dbuser>:<dbpassword>@ds127988.mlab.com:27988/heroku_1ttwgfff';

// mongoose.connect(uristring, function (err, res) {
//   if (err) { 
//     console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//     console.log ('Succeeded connected to: ' + uristring);
//   }
// });


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
	secret: 'hghvjkiouyutfghjhjgtyr6t78yiujknliuytre456rtfghiuhgftr5',
	resave: false,
	saveUninitialized: false
}));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/login.html'); 

});

app.get("/username",(req,res)=> {
	res.send(req.session.name);
});

app.post('/login', (req, res) => {//login page
	if (!req.body.name || !req.body.password) {//if no name or password provided send error
		// res.status(401);
		console.info('Invalid Login', req.body.name);
		res.send({status: 'error', message: 'user/pass not entered'});
		return;
	}
	User.find({name: req.body.name}, (err, user) => {//search for provided name and password in user database
		if (user.length === 0) {
			// res.status(401);
			res.send({status: 'invalid', message: 'invalid username/passord'});
		} else if (user[0].password !== req.body.password) {
			// res.status(401);
			res.send({status: 'invalid', message: 'invalid username/password'});
		} else {//if user is found set session name
			req.session.name = user[0].name;
			res.send({status:"success"});
		}
	});
});


app.post('/register', (req, res) => {//api to register a new user
	// find this email in the database and see if it already exists
	User.find({name: req.body.name}, (err, data) => {
		if (data.length === 0) {      // if the user doesn't exist
			var newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});

			newUser.save((err) => { // save the newUser object to the database
				if (err) {
					res.status(500);
					console.error(err);
					res.send({status: 'Error', message: 'unable to register user:' + err});
				}
				res.send({status: 'success', message: 'user added successfully'});
			});
		} else if (err) { // send back an error if there's a problem
			res.status(500);
			console.error(err);
			res.send({status: 'Error', message: 'server error: ' + err});
		} else {
			res.send({status: 'Error', message: 'user already exists'}); // otherwise the user already exists
		}
	});
});


app.post('/logout', (req, res) => {//logout api
	console.log(req.session.name);
	delete req.session.name;
	res.send({status: 'logout', message: 'succesfully logged out'});
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
	fs.writeFile('./public/tracks.json', req.body.addOne, (err) => {
  		if (err) throw err;
  			res.send(req.body.addOne);
	});
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
  			res.send("timestamp save");
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