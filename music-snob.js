Playlists = new Mongo.Collection('playlists')

if (Meteor.isClient) {
  Template.playlistSelect.helpers({
    playlists: function () {
      play = Playlists.find({});
      return Playlists.find({});
    }
  });
  

  Template.search.events({
    "submit form.searches": function (event){
      var form = event.target
      console.log(form.query.value)
      return false
    }  
  });
  
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
  
/*
  Meteor.methods(
  getSongs = function (searchParams){
    
  }
*/
}

