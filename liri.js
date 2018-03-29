require("dotenv").config();
//Still working on do that thing thing
var fs = require('fs');
var moment = require("./moment.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var command = process.argv[2];
var argument = process.argv[3];

if (process.argv.length < 3) {
    console.log('Error: No command given!');
    process.exit(1);
}

start();

function start() {
    switch (command) {
        case 'my-tweets':
            loadTweets();
            break;
        case 'spotify-this-song':
            arguments.length > 0 ? spotifySong(argument) : spotifySong();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'help':
            helpText();
            break;
        default:
            console.log("Command not found. Available commands:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says");
            break;
    }
}


function helpText() {
    console.log('\nWelcome to LIRI! We have the following commands available:');
    console.log("'my-tweets': displays your last 20 tweets from Twitter");
    console.log("'spotify-this-song': Displays info of a searched song from Spotify");
    console.log("'do-what-it-says': Runs command(s) from random.txt");
    console.log("'help': Display this help text again, in case you forgot");
}

function loadTweets() {
    var params = {
        screen_name: 'mrbulldops22',
        count: 20
    }

    twitter.get('statuses/user_timeline', params, function (error, data, response) {
        if (error) {
            console.log('twitter query error');
            process.exit(1);
        }

        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].created_at);
            console.log(moment(date).format("MM-DD-YYYY HH:mm") + " - " + data[i].text);
        }
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
        console.log(error);
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

            if (saysTo.length > (i + 1)) {
                argument = saysTo[i + 1].trim();
            }
            if (command === 'spotify-this-song' || command === 'movie-this') {
                i++;
            }

            start(command);
        }
    });
}

function parseCommand() {

}

function movieThis() {

}

function logThis() {

}