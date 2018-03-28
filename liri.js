require("dotenv").config();

var moment = require("./moment.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var command = process.argv[2];

if (process.argv.length < 3) {
    console.log('Error: No command given!');
    process.exit(1);
}

switch (command) {
    case 'my-tweets':
        loadTweets();
        break;
    case 'spotify-this-song':
        spotifySong();
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

function helpText() {
    console.log('\nWelcome to LIRI! We have the following commands available:');
    console.log("'my-tweets': displays your last 20 tweets from Twitter");
    console.log("'spotify-this-song': Displays info of a searched song from Spotify") ;
    console.log("'do-what-it-says': Runs command(s) from random.txt");
    console.log("'help': Display this help text again, in case you forgot");
}

function loadTweets() {
    var params = {
        screen_name: 'mrbulldops22',
        count: 4,
    }

    twitter.get('statuses/user_timeline', params, function(error, data, response) {
        if(error) {
            console.log('there was an error');
            process.exit(1);
        }

        for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].created_at);
            console.log(moment(date).format("MM-DD-YYYY HH:mm") + " - " + data[i].text);
        }
    });
    
}

function spotifySong() {

}

function doWhatItSays() {

}

function movieThis() {

}