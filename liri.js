// read and set any environment variables with the dotenv package:
require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var search = process.argv.slice(3).join("+");

switch (command) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        song();
        break;

    case "movie-this":
        movie();
        break;

    case "do-what-it-says":
        doIt();
        break;
};

function concert() {

    console.log("Concert function running.")
    request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var bodyObject = JSON.parse(body);

            if (bodyObject.length === 0) {
                console.log("No upcoming events for '" + search + "'.");
            }
            else {
                for (i = 0; i < bodyObject.length; i++) {
                    var name = bodyObject[i].venue.name;
                    var country = bodyObject[i].venue.country;
                    var region = bodyObject[i].venue.region;
                    var city = bodyObject[i].venue.city;
                    var dateTime = bodyObject[i].datetime.split("T");
                    var date = moment(dateTime[0]).format("MM/DD/YYYY");
                    console.log("-------Event #" + (i + 1) + "-------");
                    console.log("Venue: " + name);
                    console.log("Location: " + city + ", " + region + " " + country);
                    console.log("Date: " + date);
                }
            }
        }
    });
};

function song() {

    console.log("Spotify function running.")
    spotify.search({ type: 'track', query: search }, function (err, data) {

        var songResult = data.tracks.items;

        if (err) {
            console.log('Error occurred: ' + err);
        }
        else if (songResult.length === 0) {
            console.log("No song found.")
        }
        else {
            for (i = 0; i < songResult.length; i++) {

                console.log("-------Song #" + (i + 1) + "-------");
                var name = songResult[i].name;
                console.log("Song name: " + name);

                var artistArray = songResult[i].artists;
                console.log("Artist(s): ")
                for (j = 0; j < artistArray.length; j++) {
                    console.log(artistArray[j].name);
                }

                var preview = songResult[i].preview_url;
                if (preview === null) {
                    console.log("Preview URL: n/a");
                }
                else {
                    console.log("Preview URL: " + preview);
                }

                var album = songResult[i].album.name;
                console.log("Album: " + album);
            }
        }
    });
};

function movie() {

    console.log("Movie function running.");
    request("http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        if (search === undefined) {
            console.log("Please input a movie title.");
        }
        else if (!error && response.statusCode === 200) {

            var movieObject = JSON.parse(body);
            var tomatoRating = movieObject.Ratings[1].Value;

            if (movieObject.length === 0) {
                console.log("No search results for '" + search + "'.");
            }
            else {
                console.log("-------OMDB Search Result-------")
                console.log("Title: " + movieObject.Title);
                console.log("Released: " + movieObject.Year);
                console.log("IMDB Rating: " + movieObject.imdbRating);
                if (tomatoRating === undefined) {
                    console.log("Rotten Tomatoes Rating: n/a");
                }
                else {
                    console.log("Rotten Tomatoes Rating: " + tomatoRating);
                }
                console.log("Country: " + movieObject.Country);
                console.log("Language: " + movieObject.Language);
                console.log("Plot: " + movieObject.Plot);
                console.log("Actors: " + movieObject.Actors);
            }
        }
    });
};

function doIt() {

    console.log("Fs function running.")
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            console.log("Error.")
        }
        
        var textFile = data.split(",");
        var textCommand = textFile[0];
        var textSearch = textFile[1];

        if (textCommand === "concert-this") {
            concert(textSearch);
        }
        if (textCommand === "spotify-this-song") {
            song(textSearch);
        }
        if (textCommand === "movie-this") {
            movie(textSearch);
        }
    });
};