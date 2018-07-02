var fs = require('fs');
var mkdirp = require('mkdirp');
var child_process = require('child_process');
const wget = require('wget-improved');
var axios = require('axios');
var Multiprogress = require('multi-progress');

var multi = new Multiprogress(process.stderr);

const toDownloadParam = parseInt(process.argv[2]);
let tracksToDownload = Number.isFinite(toDownloadParam) ? toDownloadParam : 5;

const metaUrl = 'https://freemusicarchive.org/featured.json?genre_handle=Blues';
console.log(`Downloading metadata from ${metaUrl}...`);
axios.get(metaUrl)
  .then(function (response) {

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
        filename: trackName,
      });

      // remove references to freemusicharchive
      delete track.track_file_url;
      delete track.track_url;
      delete track.track_image_file;

      track.originalResource = 'https://freemusicarchive.org/';
      tracksToSave.push(track)
    });

    const tracksFilePath = __dirname + '/tracks.json';
    fs.writeFile(tracksFilePath, JSON.stringify(tracksToSave, null, '\t'), function (err) {
      if (err) {
        return console.log(err);
      } else {
        console.log('Created metadata file on ', tracksFilePath)
      }

    });
    return toDownload
  }).then(wgetConfigs => {
  let fileBarInstances = {};

  console.log('Will download now', wgetConfigs.length, 'files to the following destinations:.');
  wgetConfigs.forEach(wgetConfig => {
    console.log(wgetConfig.output);
    fileBarInstances[wgetConfig.src] = multi.newBar(`Downloading ${wgetConfig.filename} [:bar] :percent :etas`, {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: 100
    });
  });
  console.log('Depending on the connection, this might take some time.');

  return Promise.all(wgetConfigs.map(wgetConfig => {
    const currentSrc = wgetConfig.src;
    return new Promise((resolve, reject) => {
      const download = wget.download(currentSrc, wgetConfig.output);
      download.on('error', function (err) {
        console.log(err);
        reject(err);
      });
      download.on('start', function (fileSize) {
      });
      download.on('end', function (output) {
        resolve();
      });
      download.on('progress', function (progress) {
        fileBarInstances[currentSrc].tick(progress)
      });
    }).catch(e => {
      console.error('Error downloading', e)
    })
  }))
});

// const songs = require('./songs.json');
//
// songs.forEach(song => {
//   const songName = song.track_file.split('\/').reverse()[0];
//   console.log(`wget ${song.track_file_url} -O ${songName} &&`)
// });
