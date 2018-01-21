require("dotenv").config();
var keys = require("./keys.js");
var fs = require('fs'); //file system
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');

var writeToLog = function(data) {
   // We then append the contents "Hello Kitty" into the file
  // If the file didn't exist then it gets created on the fly.
  fs.appendFile("log.txt",(JSON.stringify(data, null, 2)), function(err) {
    // If an error was experienced we say it.
    if (err) {
      console.log(err);
    }
  });
}

//Creates a function for finding artist name from spotify
var getArtistNames = function(artist) {
    return artist.name;
};

//Function for finding songs on Spotify
var getMeSpotify = function(songName) {
    //If it doesn't find a song, find Ace of Base "The Sign"
    // if (songName === undefined) {
    //     songName = 'The Sign';
    // };
    var spotify = new Spotify(keys.spotify);


    // spotify.search({type: 'track',query: songName}, function(err, data) {
    //     if (err) {
    //         console.log('Error occurred: ' + err);
    //         return;
    //     }

    spotify.search({type: 'track',query: songName},function(err, data,response) {
      if (err) {
        console.log(err)
      } else if (songName !== undefined) {
            var songs = data.tracks.items;
            var data = []; //empty array to hold data

            for (var i = 0; i < songs.length; i++) {
                data.push({
                    'artist(s)': songs[i].artists.map(getArtistNames),
                    'song name: ': songs[i].name,
                    'preview song: ': songs[i].preview_url,
                    'album: ': songs[i].album.name,
                });
            }
            console.log(data);
            writeToLog(data);
      } else if (songName === undefined) {
      console.log('If no song is provided then your program will default to "The Sign" by Ace of Base ')
        spotify.search({type: 'track',query: 'The Sign'},function(err, data,response) {
      if (err) {
        console.log(err)
      } 
  });
  }
});
};


var getTweets = function() {
    // var client = new twitter(dataKeys.twitterKeys);
    var client = new twitter(keys.twitter);
    client.get("statuses/user_timeline/",({screen_name: 'MGM43358313', count: 10}), function(error, data, response) {
        if (!error) {
            for (var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults =
                    "@" + data[i].user.screen_name + ": " +
                    data[i].text + " " +
                    data[i].created_at +
                    "------------------------------ " + i + " ------------------------------" + "\n";
                console.log(twitterResults);
                writeToLog(twitterResults); // calling log function
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });

};

var getMeMovie = function(movieName) {

    if (movieName === undefined) {
        movieName = 'Mr Nobody';
    }

    var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json&apikey=trilogy";

    request(urlHit, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = [];
            var jsonData = JSON.parse(body);

            data.push({
                'Title: ': jsonData.Title,
                'Year: ': jsonData.Year,
                'Rated: ': jsonData.Rated,
                'IMDB Rating: ': jsonData.imdbRating,
                'Country: ': jsonData.Country,
                'Language: ': jsonData.Language,
                'Plot: ': jsonData.Plot,
                'Actors: ': jsonData.Actors,
                'Rotten Tomatoes Rating: ': jsonData.tomatoRating,
                'Rotten Tomatoes URL: ': jsonData.tomatoURL,
            });
            console.log(data);
            writeToLog(data);
        }
    });

}

var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        console.log(data);
        writeToLog(data);
        var dataArr = data.split(',')

        if (dataArr.length == 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length == 1) {
            pick(dataArr[0]);
        }

    });
}

var pick = function(caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getTweets();
            break;
        case 'spotify-this-song':
            getMeSpotify(functionData);
            break;
        case 'movie-this':
            getMeMovie(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('LIRI doesn\'t know that');
    }
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);