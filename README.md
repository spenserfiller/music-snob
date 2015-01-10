# Spotify App

## Features - Main
- Front End
- Database
- API endpoints
- playlists
- add player(check on playlist outside of spotify)

### Front End
- for main page, if song is in DB, remove 'add' button
- for playlist page, have 4 tab sections that read from spotify playlist and from DB for banned songs and waiting to be approved.
- for all playlists, they are held in mongoDB


### Database - is noSQL, but general schema exists still.

####Playlists
- Has many songs
- Title

####Users
-Admin user
-Username
-Pass

####Songs
-Votes
-Has Many Playlists
- Song_ id from spotify API
- Pending

## Features for the future
-Voting system
-Publish playlist to spotify
-User logins (spotify login adoption) Admin rights Veto Power/ Play Pause in browser
-Vote to skip
-Weight based play order
-highlight songs already in playlist on search page
-move spotify player to the top and use click button, look in to linking just the overall URL