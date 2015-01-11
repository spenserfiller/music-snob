Playlists = new Mongo.Collection('playlists');
// client side logic
if (Meteor.isClient) {
  Template.playlistSelect.helpers({
    playlists: function () {
      console.log(Playlists.find({}));
      return Playlists.find({});
    },
    isSelected: function() {
      if(this.name === Session.get('selected_playlist')){
        console.log('returning selected');
        return 'selected';
      } else {
        console.log('returning empty');
        return "";
      }
    }
  });
  
 //select playlist
  Template.playlistSelect.events({
    'change select.select-option':function (event, template){
      Session.set('selected_playlist', template.find('.select-option').value);
      console.log("value changed");
    }
  });

//search bar
  Template.search.events({
    "submit form.searches": function (event){
      var form = event.target;
      console.log(form.query.value);
      Meteor.call('searchTrack', form.query.value, function(err, respJson) {
				if(err) {
					window.alert("Error: " + err.reason);
					console.log("error occured on receiving data on server. ", err );
				} else {
					console.log("respJson: ", respJson);
          Session.set("recentTracks",respJson);
				}
			});
      return false;
    },
  });
  //play button function

//spotifysong template handler
  Template.spotifysong.events({
    "click .add-button": function (event) {
      var spotifyId = this.id;
      console.log(spotifyId);
      Meteor.call("addToPlaylist", this, 'placehold');
      return false;
    }

  });
//recent tracks
  Template.spotifysong.recentTracks = function() {
    console.log("getting tracks!");
    return Session.get("recentTracks") || [];
  };
  
  // playlist tracks
  Template.playlistRoute.playlistTracks = function () {
    console.log('getting playlist tracks!');
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: "MakerSquare sick beats"});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  //pending tracks
 Template.pendingRoute.playlistTracks = function () {
    console.log('getting playlist tracks!');
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: "MakerSquare sick beats"});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  //banned tracks
  Template.bannedRoute.playlistTracks = function () {
    console.log('getting playlist tracks!');
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: "MakerSquare sick beats"});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
//router maps
  Router.map( function (){
  this.route('home', {
      path: '/'
    });
  });
  Router.map( function () {
    this.route('playlistRoute', {
      path: 'playlist'
    });
  });
  Router.map( function () {
    this.route('songsRoute', {
      path: 'yoursongs'
    });
  });
  Router.map( function () {
    this.route('pendingRoute', {
      path: 'pending'
    });
  });
  Router.map( function () {
    this.route('bannedRoute', {
      path: 'banned'
    });
  });
}



// server functions
if (Meteor.isServer) {
	Meteor.methods({
		searchTrack: function(track) {
			var url = "https://api.spotify.com/v1/search?q=" + track + "&type=track&limit=10";
			console.log(url);
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
		},
    //add to playlist DB function
    addToPlaylist: function(spotifySong, playlist){
      Playlists.update(
        { name: "MakerSquare sick beats"},
        { $push: { songs:
                  {
                    artists: spotifySong.artists,
                    name: spotifySong.name,
                    album: spotifySong.album.name,
                    id: spotifySong.id,
                    pending: true,
                    banned: false
         } } }
      );
    }
	});
}

