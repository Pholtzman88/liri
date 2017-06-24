var keys = require("./keys.js");
var auth = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");


function getTwitter(){
	console.log()
	var client = new auth({
		consumer_key: keys.twitterKeys["consumer_key"],
		consumer_secret: keys.twitterKeys["consumer_secret"],
		access_token_key: keys.twitterKeys["access_token_key"],
		access_token_secret: keys.twitterKeys["access_token_secret"]		
	}); 

	var newTweet = process.argv.splice(3).join(" ");

		function postTweet(){
			console.log("\nposting new tweet...")
			client.post('statuses/update', {status: newTweet},  function(error, tweet, response) {
			  if(error) throw error;
			  console.log(tweet.user.screen_name);
			  console.log(tweet.created_at);
			  console.log(tweet.text)
			});		
		};

		function getTweets(){
			client.get('statuses/user_timeline', function(error, tweets, response) {
			  if (!error) {

			    for(var i=0;i<tweets.length;i++){
			    	console.log("\n--------------------------------------------------------------------------------------------------");
			    	console.log("\nUser:"+tweets[i].user.screen_name);
			    	console.log("\nTime:"+tweets[i].created_at);
			    	console.log("\nUser:"+tweets[i].text);    	    	
			    };
			  };
			});
		};


	if (newTweet){
		postTweet();
	}else{
		getTweets();
	}
	
};

function getSpotify(data){
	var spotify = new Spotify({
	  id: keys.spotifyKeys["id"],
	  secret: keys.spotifyKeys["secret"]
	});
	//if not using random.txt file
	if( typeof data === "undefined"){
	var songName = process.argv.slice(3).join(" ");
	//if using random.txt file
	}else{
		songName = data;
	};
	
	//if user inputs a song
	if (songName){
		console.log("\nspotifying your song...");
	//else change songName to default song
	}else{
		console.log("\ndisplaying default results...");
		songName = "ace of base the sign";
	};

	 //call spotify
	spotify.search({ type: 'track', query: songName }, function(err, data) {
		//error handler
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  };

	var query = data.tracks.items[0]; 
	console.log("\n----------------------------------------------------------------------------------------------------------");
	console.log("\nArtist:"+query.artists[0].name);
	console.log("\nSong Name:"+query.name);
	console.log("\nPreview Link:"+query.external_urls.spotify);
	console.log("\nAlbum:"+query.album.name);
	});
};
function getMovie(){
	//get the movie search from the process arguments
	var movieName = process.argv.slice(3).join(" ");

	if(movieName){
		console.log("\nsearhing for your movie...");		
	}else{
		console.log("whoops! You didn't give me anything to search! No worries I'll show you this movie instead!");
		movieName = "Mr Nobody";
	};
	var queryUrl = 'http://www.omdbapi.com/?t=' + movieName +'&apikey=40e9cece&y=&plot=short&r=json&tomatoes=true';
	request(queryUrl, function(error,response,body){

		if(!error && response.statusCode == 200){
			console.log("\n--------------------------------------------------------------------------------------------");
			console.log("\nTitle: "+JSON.parse(body)["Title"]);
			console.log("\nYear: "+JSON.parse(body)["Year"]);
			console.log("\nIMDB Rating: "+JSON.parse(body)["imdbRating"]);
			console.log("\nCountry: "+JSON.parse(body)["Country"]);
			console.log("\nLanguage: "+JSON.parse(body)["Language"]);
			console.log("\nPlot: "+JSON.parse(body)["Plot"]);
			console.log("\nActors: "+JSON.parse(body)["Actors"]);
			console.log("\nRotten Tomatoes URL"+JSON.parse(body)["tomatoURL"]);

		}else{
			return console.log(error);
		};
	});
};
function doWhatItSays(){

	fs.readFile("random.txt", "utf8", function(err,data){
		if(err){
			return console.log(err);
		};
		var dataArr = data.split(" ");
		var requestName = dataArr.slice(1);
		getSpotify(requestName);

	});
};

var requestType = process.argv[2];

if(requestType === "spotify-this-song"){
	getSpotify();
}else if(requestType === "movie-this"){
	getMovie();
}else if(requestType === "do-what-it-says"){
	doWhatItSays();
}else if(requestType === "tweet-tweet"){
	getTwitter();
}else{
	console.log("come on give me something to do!")
}




