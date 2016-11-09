
// Hey! Don't edit this file. Feel free to read it, though :)

// Run this file by executing `node import.js` (without backticks)

// Read instructions.txt for details on how to solve these problems.


var fs = require("fs");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost", function(err) {
	if (err && err.message.indexOf("ECONNREFUSED") !== -1) {
		console.log("Unable to connect to mongodb!");
		console.log("Make sure you're running mongod.");
	} else if (err) {
		console.log(err);
	}
});

var DATA_DIR = './.import';

// var CheckoutSchema = require('./Checkout.schema.js');
// var Checkout = mongoose.model("Checkout", CheckoutSchema);

// var MovieSchema = require('./Movie.schema.js');
// var Movie = mongoose.model("Movie", MovieSchema);

// console.log("Beginning Import...");

// var doneWithMovies = false;
// var doneWithCheckouts = false;
function updateDone(name, i, total) {
	if (i % 100 === 0) {
		console.log(name + ": Completed " + i + "/" + total);
	}
	if (i == total) {
		if (name == "Movies") {
			doneWithMovies = true;
		} else if (name == "Checkouts") {
			doneWithCheckouts = true;
		}
	}
	if (doneWithMovies && doneWithCheckouts) {
		console.log("All done! Press control + c to exit!");
	}
}

var checkoutData = fs.readFile(DATA_DIR + "/checkouts.txt", function(err, data) {
	var i, checkout, checkouts;
	if (err) {
		console.log("Hey, make sure the hidden folder '.import' made it into the project folder.");
		return;
	}

	checkouts = data.toString().split("\n");
	i = 0;

	checkouts = checkouts.map(function(line) {
		return line.split(" ");
	}).filter(function(line) {
		return line[0].length;
	});

	checkouts.forEach(function(line) {
		checkout = new Checkout({
			userId: line[0].substr(4),
			month: line[1],
			movieId: line[2]
		});
		checkout.save(function() {
			i++;
			updateDone("Checkouts", i, checkouts.length);
		});
	});
});

var movieData = fs.readFile(DATA_DIR + '/movies.txt', function(err, data) {
	var i, movies, movie;
	if (err) {
		console.log("Hey, make sure the hidden folder '.import' made it into the project folder.");
		return;
	}

	movies = data.toString().split("\n");
	i = 0;

	movies = movies.map(function(line) {
		return line.split(" ");
	}).filter(function(line) {
		return (line[0].length && line[0][0] !== "#");
	});

	movies.forEach(function(line) {
		movie = new Movie({
			_id: parseInt(line[0]),
			title: line.slice(1, -1).join(" "),
			year: parseInt(line[line.length - 1].slice(1,-1))
		});
		movie.save(function() {
			i++;
			updateDone("Movies", i, movies.length);
		});
	});
});
