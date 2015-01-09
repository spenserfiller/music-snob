Playlists = new Mongo.Collection('playlists')

if (Meteor.isClient) {
  Template.playlistSelect.helpers({
    playlists: function () {
      play = Playlists.find({});
      console.log(play);
      return Playlists.find({});
    }
  });
  

  Template.search.events({
    "submit form.searches": function (event){
      var form = event.target
      console.log(form.query.value)
      Meteor.call('searchTrack', form.query.value, function(err, respJson) {
				if(err) {
					window.alert("Error: " + err.reason);
					console.log("error occured on receiving data on server. ", err );
				} else {
					console.log("respJson: ", respJson);
          Session.set("recentTracks",respJson);
				}
			});
      return false
    }  
  });
  
  Template.spotifysong.recentTracks = function() {
    console.log("getting tracks!")
    return Session.get("recentTracks") || [];
  }

  Router.map( function (){
  this.route('home', {
    path: '/'
  });
})

Router.map( function () {
  this.route('playlistRoute');
});
Router.map( function () {
  this.route('songsRoute');
})
Router.map( function () {
  this.route('pendingRoute');
})
Router.map( function () {
  this.route('bannedRoute');
})
   
    /*
"submit .new-song": function (event) {
  // This function is called when the new song form is submitted
    var playlistName = event.target.playlistName.value;
    var spotifyId =  
    
    Playlists.insert({
      name: playlistName,
      spotify_id: spotifyId,
      songs: {}, 
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.playlistName.value = "";

    // Prevent default form submit
    return false;
  }
});
*/
}




if (Meteor.isServer) {
	Meteor.methods({
		searchTrack: function(track) {
			var url = "https://api.spotify.com/v1/search?q=" + track + "&type=track&limit=10";
			console.log(url)
			//synchronous GET
			var result = Meteor.http.get(url, {timeout:30000});
			if(result.statusCode==200) {
				var respJson = JSON.parse(result.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", result.statusCode);
				var errorJson = JSON.parse(result.content);
				throw new Meteor.Error(result.statusCode, errorJson.error);
			}
		}
	});
}

