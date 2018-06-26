var fs = require('fs');
var mkdirp = require('mkdirp');
var child_process = require('child_process');
const wget = require('wget-improved');
var axios = require('axios');

axios.get('https://freemusicarchive.org/featured.json?genre_handle=Blues')
  .then(function (response) {
    let tracksToDownload = 5;

    const tracksToSave = [];
    const toDownload = [];

    response.data.aTracks.forEach(function (track) {
      if (!tracksToDownload) {
        return
      }
      tracksToDownload--;

      const trackPathParts = track.track_file.split('/');
      const trackName = trackPathParts.splice(trackPathParts.length - 1, 1)[0];
      const trackPath = __dirname + '/' + trackPathParts.join('/');

      if (!fs.existsSync(trackPath)) {
        mkdirp(trackPath);
      }

      const dest = trackPath + '/' + trackName;

      toDownload.push({
        src: track.track_file_url,
        output: dest,
      });

      // remove references to freemusicharchive
      delete track.track_file_url;
      delete track.track_url;
      delete track.track_image_file;

      track.originalResource = 'https://freemusicarchive.org/';
      tracksToSave.push(track)
    });

    fs.writeFile(__dirname + '/tracks.json', JSON.stringify(tracksToSave, null, '\t'), function (err) {
      if (err) {
        return console.log(err);
      }

    });
    return toDownload
  }).then(wgetConfigs => {
    return Promise.all(wgetConfigs.map(wgetConfig => {
      return new Promise((resolve, reject) => {
        const download = wget.download(wgetConfig.src, wgetConfig.output);
        download.on('error', function(err) {
          console.log(err);
          reject(err);
        });
        download.on('start', function(fileSize) {
          console.log('Started downloading', wgetConfig.output, fileSize);
        });
        download.on('end', function(output) {
          console.info('Finished downloading', wgetConfig.output);
          resolve();
        });

      })
    }))
});

// const songs = require('./songs.json');
//
// songs.forEach(song => {
//   const songName = song.track_file.split('\/').reverse()[0];
//   console.log(`wget ${song.track_file_url} -O ${songName} &&`)
// });
