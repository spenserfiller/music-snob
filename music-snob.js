Playlists = new Mongo.Collection('playlists')

if (Meteor.isClient) {
  Template.playlist.helpers({
    playlists: function () {
      return Playlists.find({});
    }
  });
  Meteor.subscribe("playlists");
/*
  Template.body.events({
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
  
}

