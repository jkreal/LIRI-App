require("dotenv").config();

const sleep = require('system-sleep');
const fs = require('fs');
const moment = require("./moment.js");
const request = require("request");
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const keys = require("./keys.js");
const readline = require("readline");
const asc = require("ascii-art");

const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);

var command = process.argv[2];
var argument = process.argv[3];

if (process.argv.length < 3) {
	helpText();
	process.exit(1);
}

start();

function start() {

    logThis();

    switch (command) {
        case 'my-tweets':
            loadTweets();
            break;
        case 'tweets':
            loadTweets(argument);
            break;
        case 'spotify-this-song':
            arguments.length > 0 ? spotifySong(argument) : spotifySong();
            break;
        case 'movie-this':
            arguments.length > 0 ? movieThis(argument) : movieThis();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'help':
            helpText();
            break;
        case 'history':
            history();
            break;
        case 'weather':
            searchWeather();
            break;
        case 'ascii-text':
            asciiString();
            break;
        default:
            console.log("Command " + command + " not found. Available commands:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says");
            break;
    }

    sleep(500);

}

function asciiString(text) {
    if (process.argv.length > 0) {
        asc.font(text, 'Doom', function (rendered) {
            console.log(rendered);
        });
    }
    asc.font(argument, 'Doom', function (rendered) {
        console.log(rendered);
    });
}

function helpText() {
    console.log('\nWelcome to LIRI! We have the following commands available:');
    console.log("'my-tweets': displays your last 20 tweets from Twitter");
    console.log("'tweets' : Displays a user's tweet. Parameter: username")
    console.log("'spotify-this-song': Displays info of a searched song from Spotify. Parameter: song_name");
    console.log("'do-what-it-says': Runs the command(s) from random.txt");
    console.log("'movie-this' : Gives you info on a movie (surround with quotes if multiple words in title). Parameter: movie_name");
    console.log("'ascii-text', : Prints the argument text to the console in ascii format");
    console.log("'history' : Shows the last 20 commands that have been entered")
    console.log("'help': Display this help text again, in case you forgot");
}

function searchWeather(city) {
    city = process.argv[3];

    weather.getCurrent(city, function (current) {
        console.log(current);
    });

}

function loadTweets(username) {
	var params = {
		screen_name: 'mrbulldops22',
		count: 20
	}

	if (arguments.length > 0) {
		params.screen_name = argument;
	}

	twitter.get('statuses/user_timeline', params, function (error, data, response) {
		if (error) {
			console.log('twitter query error');
			process.exit(1);
		}

		console.log("\n");
		for (var i = 0; i < data.length; i++) {
			var date = new Date(data[i].created_at);
			console.log(moment(date).format("MM-DD-YYYY HH:mm") + " - " + data[i].text);
			sleep(50);
		}
		console.log("\n");
	});

}

function spotifySong(song) {
	var songSearch;

	if (process.argv.length < 4 && arguments.length === 0) {
		console.log('No argument given for query');
		process.exit(1);
	}

	if (arguments.length > 0) {
		songSearch = song;
	} else {
		songSearch = process.argv[3];
	}

	spotify.search({
		type: 'track',
		query: songSearch,
	}).then(function (response) {
		console.log(response.tracks.items[0].artists[0].name + " - " + response.tracks.items[0].name + " || " + response.tracks.items[0].album.name + " (" + response.tracks.items[0].external_urls.spotify + ")");
	}).catch(function (error) {
		console.log('spotify query error:');
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		error === true ? console.log('read file error') : '';

		saysTo = data.split(',');
		if (saysTo[saysTo.length - 1] === '') {
			saysTo.pop();
		}

		for (var i = 0; i < saysTo.length; i++) {
			command = saysTo[i].trim();
			console.log('command ', command);
			if (saysTo.length > (i + 1)) {
				argument = saysTo[i + 1].trim();
			}
			if (command === 'spotify-this-song' || command === 'movie-this' || command === 'tweets') {
				i++;
			} else {
				argument = '';
			}

			start(command);
		}
	});
}

function movieThis(arguments) {

	if (process.argv.length < 4 && arguments.length === 0) {
		console.log('No argument given for query');
		process.exit(1);
	}
	else {
		var movie = argument.trim().replace(/ /g, "+").replace(/\"/g, "");
	}

	var options = {
		url: 'http://www.omdbapi.com/?t=' + movie + '&apikey=893caa2c',
		method: 'GET',
		tomatoes: true,
		r: 'json'
	}

	console.log(options.url);

	request(options, function (error, response, body) {
		if (error) {
			console.log('ombd query error');
			process.exit(1);
		}

		data = JSON.parse(body);

		console.log("\n" + data.Title + " - " + data.Year);

		var lines = '';
		for (var i = 0; i < data.Title.length + 8; ++i) {
			lines += '-';
		}

		console.log(lines);
		console.log(data.Actors);
		console.log(data.Plot);
		console.log(lines);
		console.log("IMDB Rating: " + data.Ratings[0].Value + " || Rotten Tomatoes Rating: " + ((data.Ratings.length > 1) ? data.Ratings[1].Value : 'N/A'));

		console.log(data.Country + " - " + data.Language + "\n");

	});

}

function history() {

	const read = readline.createInterface({
		input: fs.ReadStream('log.txt')
	});

	var lines = [];
	read.on('line', function (line) {
		lines.push(line);
	});

	var lineArray = [];
	read.on('close', function (line) {
		for (var i = lines.length - 1; i > lines.length - 20; --i) {
				lineArray.push(lines[i]);
		}

        for (var i = lines.length - 1; i > 0; --i) {
            (typeof lineArray[i] === 'undefined') ? '' : console.log(lineArray[i]);
        }
    });

}

function logThis() {
    let timestamp = moment().format("MMM-D-YYYY @ HH:mm:ss")
    fs.appendFile("log.txt", timestamp + " >> " + command + " " + ((!argument) ? '' : "'" + argument + "'") + "\n", function (error) {
        if (error) {
            return console.log(error);
        }
    });
}