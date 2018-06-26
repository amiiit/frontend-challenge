# Frontend challenge:

Create a simple web based music player.

## Technical Resources:
1. Endpoint for getting a track list: https://freemusicarchive.org/featured.json
2. In each track object (under response property aTracks) there are several metadata that you are free to use to present on the UI.
3. The actual music file is name track_file_url and is a property of each track object.
4. In order to use the API from you local client you would need to enable a CORS proxy. See under section [Caveats](README.md##Caveats).

## Good to know:
1. Only firefox supports the complete API of HTMLAudioElement events. So if you want to use events you should prefer working on firefox. Otherwise you are free to use any browser. Working with events is not absolutely necessary, we just wanted to save you some time by telling you this. 

## Functional Requirements

Below is a list of functional requirements for the music player. The time frame for this task is just 2 hours so it's really okay if you don't do all of them. We are mostly interested in the way you work, think and communicate. Yes we said, communicate so it's okay to ask for help. Today we'll be working just like team-mates so we will help you without judgment. We hope that you'll be able to complete the basic requirements and have some fun. Bonus requirements can be done later if you have time, but you can already consider them in your design from the start.

### Basic Requirements:

1. Player loads automatically the track list from API endpoint above
2. Player shows a list of all available tracks. Each track shows at least a name and author, a play/pause button and a progress bar
3. It should be possible to change the current time position of the track by having buttons for jumping the time 1s/10s forwards and backwards
4. At least one component to be built with TDD

### Bonus:

5. By the end of each track, the next track should start automatically
6. Automatic start of the next track can be turned off via checkbox
7. Jump the track time by clicking on progress bar

## Draft

The following draft can help you get a general idea of how the app should look and feel. The draft isn't complete and you will probably need to add or change some elements to fit your implementation and ideas. We hope that you'll enjoy the task, good luck!

![UI draft](ui-draft.png)

# Caveats

The free music API doesn't allow CORS requests. Since this is just an experimental project we just work around it by using a local CORS proxy. An example for using a CORS proxy would be:

```
$ npm install -g cors-server
$ cors-server
Starting server on port 3015...
```

Then instead of calling: ```https://freemusicarchive.org/featured.json``` from the application, you will need to call:
```http://localhost:3015/https://freemusicarchive.org/featured.json```



