// read and set any environment variables with the dotenv package:
require("dotenv").config();

var keys = require("./keys.js");
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];

switch (command) {
    case "concert-this":
        concert();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        // ftn();
        break;

    case "do-what-it-says":
        // ftn();
        break;
}

function concert() {

    console.log("Concert function running.")
    var artist = process.argv[3];
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var bodyObject = JSON.parse(body);

            if (bodyObject.length === 0) {
                console.log("No upcoming events for '" + artist + "'.");
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
}

function spotifySong() {

    console.log("Spotify function running.")
    var song = process.argv[3];

    spotify.search({ type: 'track', query: song }, function (err, data) {

        var songResult = data.tracks.items;

        if (err) {
            console.log('Error occurred: ' + err);
        }
        else {
            for (i = 0; i < songResult.length; i++) {

                console.log("-------Song Result #" + (i + 1) + "-------");

                var name = songResult[i].name;
                console.log("Song name: " + name);

                var artistArray = songResult[i].artists;
                console.log("Artist(s): ")
                for (j = 0; j < artistArray.length; j++) {
                    console.log(artistArray[j].name)
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
    //Artist(s)
    //The song's name
    //A preview link of the song from Spotify
    //The album that the song is from
    //If no song is provided then your program will default to "The Sign" by Ace of Base
}