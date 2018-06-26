var fs = require('fs');
var mkdirp = require('mkdirp');
var child_process = require('child_process');

var axios = require('axios');
axios.get('https://freemusicarchive.org/featured.json?genre_handle=Blues')
  .then(function (response) {
    let tracksToDownload = 10;
    console.log('Please execute the following to download the songs:\n');

    const tracksToSave = [];

    response.data.aTracks.forEach(function (track) {
      if (!tracksToDownload) {
        return
      }
      tracksToDownload--;

      const trackPathParts = track.track_file.split('/');
      const trackName = trackPathParts.splice(trackPathParts.length - 1, 1)[0];
      const trackPath = __dirname + '/' + trackPathParts.join('/');

      if (!fs.existsSync(trackPath)){
        mkdirp(trackPath);
      }
      console.log('wget ' + track.track_file_url + ' -O ' + trackPath + '/' + trackName + (tracksToDownload ? ' &&' : ''))

      // remove references to freemusicharchive
      delete track.track_file_url;
      delete track.track_url;
      delete track.track_image_file;

      track.originalResource = 'https://freemusicarchive.org/';
      tracksToSave.push(track)
    });

    console.log('json file: ', JSON.stringify(tracksToSave));

    fs.writeFile(__dirname + '/tracks.json', JSON.stringify(tracksToSave, null, '\t'), function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  });

// const songs = require('./songs.json');
//
// songs.forEach(song => {
//   const songName = song.track_file.split('\/').reverse()[0];
//   console.log(`wget ${song.track_file_url} -O ${songName} &&`)
// });
