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
 
   
  Template.search.helpers({
     isAdmin: function() {
      var john = "mLoeB6zmEWYm8K8Dz";
      var melissa = "j5sjcSbKx4iT8SBkM";
      var spenser = "NtJCDTsG5oawxCYDi";
      var admin = Meteor.userId();
      if(admin === john || admin === melissa || admin === spenser){
          return true;
      }
    }
  });

  Template.songsRoute.helpers({
    isUser: function () {
      if(this.userId === Meteor.userId()){
        return true;
      } else {
        return false;
      }
    }
  });

  Template.pendingRoute.helpers({
    isAdmin: function() {
      var john = "mLoeB6zmEWYm8K8Dz";
      var melissa = 'j5sjcSbKx4iT8SBkM';
      var spenser = "NtJCDTsG5oawxCYDi";
      var admin = Meteor.userId();
      if(admin === john || admin === melissa || admin === spenser){
          return true;
      } else {
        return false;
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
  
  //admin add song
  Template.pendingRoute.events({
    'click .add-this': function (event){
      var currentPlaylist = Session.get('selected_playlist');
      console.log(this.id);
      Meteor.call('approveSong', currentPlaylist, this.id);
    },
    'click .ban-this': function (event){
      console.log('click',this);
      var currentPlaylist = Session.get('selected_playlist');
      Meteor.call('banSong', currentPlaylist, this.id);
    }
  }),
  //pass ID to player
  Template.playlistRoute.events({
    'click .playButton': function (event){
      console.log(this.id);
      var songId = "https://embed.spotify.com/?uri=spotify:track:" + this.id;
      $('.player-refresh').attr("src", songId);
      return false;
    }
  }),
  Template.songsRoute.events({
    'click .playButton': function (event){
      console.log(this.id);
      var songId = "https://embed.spotify.com/?uri=spotify:track:" + this.id;
      $('.player-refresh').attr("src", songId);
      return false;
    }
  }),
  Template.bannedRoute.events({
    'click .playButton': function (event){
      console.log(this.id);
      var songId = "https://embed.spotify.com/?uri=spotify:track:" + this.id;
      $('.player-refresh').attr("src", songId);
      return false;
    }
  }),
  Template.pendingRoute.events({
    'click .playButton': function (event){
      console.log(this.id);
      var songId = "https://embed.spotify.com/?uri=spotify:track:" + this.id;
      $('.player-refresh').attr("src", songId);
      return false;
    }
  }),

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
			Router.go('home');
      return false;
    },
    // "submit button.pushIt": function (event){
    // }
  });
  //play button function

//spotifysong template handler
  Template.spotifysong.events({
    "click .add-button": function (event) {
      if (! Meteor.userId()) {
        alert(" You must be signed in to add to a playlist");
        throw new Meteor.Error("not-authorized!");
      }
        var spotifyId = this.id;
        console.log(spotifyId);
        Meteor.call("addToPlaylist", this, Session.get('selected_playlist'));
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
    var songs = Playlists.findOne({name: playlist});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  
  Template.playlistRoute.events({
    'click .ban-this': function (event){
      console.log('ya banned',this);
      var currentPlaylist = Session.get('selected_playlist');
      Meteor.call('banSong', currentPlaylist, this.id);
    }
  });
  
  // your songs
   Template.songsRoute.playlistTracks = function () {
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: playlist});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  //pending tracks
 Template.pendingRoute.playlistTracks = function () {
    console.log('getting playlist tracks!');
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: playlist});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  //banned tracks
  Template.bannedRoute.playlistTracks = function () {
    console.log('getting playlist tracks!');
    var playlist = Session.get('selected_playlist');
    var songs = Playlists.findOne({name: playlist});
    console.log('songs: ' + songs.songs);
    return songs.songs;
  };
  Template.pushToSpotify.events({
    "click .pushIt": function (event){
      var currentPlaylist = Session.get('selected_playlist')
      var playlistTracks = Playlists.findOne({name: currentPlaylist})
      var uriPlaylist = Meteor.call('playlistToUri', playlistTracks, function(error, result){
        if(error) {
          window.alert("Error: " + error.reason);
          console.log("error occured on receiving data on server. ", error );
        } else {
          console.log("result: ", { "uris": result});
          Meteor.call('addToSpotify', result);
        }
      })
      return false
      
    }
  });

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
  Router.map( function () {
    this.route('spotifyPlayer', {
      path: ''
    });
  });
}



// server functions
if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
      // Here is the data this package gives you
      var mks = user.services.makerpass;
      // OPTIONAL: Restrict this app to "official" members of MakerSquare
      if (mks.memberships.length === 0) {
        throw new Meteor.Error(401, "Sorry, you are not a member of any MakerPass groups.");
      }
      // WARNING: user.profile is writable by user.
      // Don't put something in user.profile if you don't want the user to change it.
      user.profile = options.profile || {};
      user.profile.name       = mks.name;
      user.profile.avatarUrl  = mks.avatarUrl;
      return user;
  });
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
        { name: playlist},
        { $push: { songs:
                  {
                    artists: spotifySong.artists,
                    name: spotifySong.name,
                    album: spotifySong.album.name,
                    id: spotifySong.id,
                    pending: true,
                    banned: false,
                    userId: Meteor.userId()
         } } }
      );
    },
    addToSpotify: function(trackUris){
      var url = "https://api.spotify.com/v1/users/mksadmin/playlists/0bHrARQz4dzb2JFy7FUNzg/tracks";
      Meteor.http.put(url,
        {data:
          {
            "uris": trackUris
          },
          headers:
          {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer BQAC4CNcEN7pBSb_yvbEdwAWk3_VvA1lqQ098kSdgARN6I4uu_IMcfXKx1tYz-kz5UPSeFh4ghqDWjpZI6yLZMGIG3TMN8x9aRXteZVEYyoJQ803VLb5sxCJcem5ScmVA3u8Mg4oDY6Vxeb6fvNxSiiUUZhVH8P3YtPbk6XqRytK2eCWJOx1nux9dDloakfcL03cn85vhE3X43Jy-HtEPBEj"
          }
          });
        },
    //change pending status
    approveSong: function(currentPlaylist, songId){
      Playlists.update(
        {name: currentPlaylist, "songs.id": songId},
        {$set: {"songs.$.pending" : false}}

      
      );
    },
    
    //ban a song
    banSong: function(currentPlaylist, songId){
      Playlists.update(
        {name: currentPlaylist, "songs.id": songId},
        {$set: {
          "songs.$.banned" : true,
          "songs.$.pending" : false}}
      );

    },
    //Converts playlist to a list of URIs
    playlistToUri: function(playlist) {
      var playlistUris = [];
      playlist.songs.forEach(function(song) {
        playlistUris.push("spotify:track:"+song.id);
      });
      return playlistUris
    }
    // inPlaylist: function(spotifySongId, playlist){
    //   Playlists.findOne(
    //       {
    //         name: {$ne: playlist},
    //         score: {$ne: {id: spotifySongId} })
    // }
	});
}

