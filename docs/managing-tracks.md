# Managing Tracks on the Player

The Kaltura Player uses a comprehensive API to handle all kind of tracks, including video (bitrate), audio, and text (language) tracks.
<br>This document shows how to use the API to managing player tracks. 

+ [Tracks Availability](#tracks-availability)
+ [Getting the Tracks](#getting-the-tracks)
    * [Getting Types Track Types](#getting-all-track-types)
    * [Getting Specific Track Types](#getting-specific-track-types)
    * [Getting the Current Active Tracks](#getting-the-current-active-tracks)
+ [Using Video Tracks](#video-tracks)
    * [Adaptive, Bitrate and Manual Selection](#adaptive-bitrate-and-manual-selection)
    * [Getting the Current Mode](#getting-the-current-mode)
    * [Video Track Selection](#video-track-selection)
+ [Using Audio Tracks](#audio-tracks)
    * [Audio Track Selection](#audio-track-selection)
+ [Using Text Tracks](#text-tracks)
    * [Text Track Selection](#text-track-selection)
    * [Disabling Text Tracks](#disable-text-track) 

## Tracks Availability
Tracks are available only when the video source has loaded.
<br>There are two ways to verify that tracks are available:
<br>Using the `TRACKS_CHANGED` event: 
```javascript
player.addEventListener(player.Event.TRACKS_CHANGED, function (event) {
  var tracks = event.payload.tracks;
  console.log('This source has ' + tracks.length + ' tracks');
});
```
<br>Using the `ready` promise:
```javascript
player.ready().then(function(){
  var tracks = player.getTracks();
  console.log('This source has ' + tracks.length + ' tracks');
});
```
## Getting the Tracks 
#### Getting All Track Types
The code below shows how to get all of the player tracks using the `getTracks` method:
```javascript
var tracks = player.getTracks();
console.log('This source has ' + tracks.length + ' tracks');
```

#### Getting Specific Track Types
It's also possible to get a specific kind of track.
<br>The code below shows how to get a specific track by passing a parameter to the `getTracks` method:
```javascript
var videoTracks = player.getTracks(player.Track.VIDEO);
var audioTracks = player.getTracks(player.Track.AUDIO);
var textTracks = player.getTracks(player.Track.TEXT);
console.log('This source has ' + videoTracks.length + ' video tracks');
console.log('This source has ' + audioTracks.length + ' audio tracks');
console.log('This source has ' + textTracks.length + ' text tracks');
```

#### Getting the Current Active Tracks
The code below shows how to get the current active player tracks using the `getActiveTracks` method:
```javascript
var activeTracks = player.getActiveTracks();
console.log('The active video track is: ' + activeTracks.video);
console.log('The active audio track is: ' + activeTracks.audio);
console.log('The active text track is: ' + activeTracks.text);
```

## Video Tracks
This section shows you how to manage video tracks.

#### Adaptive Bitrate and Manual Selection
There are two ways to use video tracks (or bitrate): *Adaptive Bitrate* and *Manual Selection*.
<br>When *Adaptive Bitrate* is enabled, the player controls the video track selection according to the network conditions. This is the default mode.
<br>When selecting a specific video track manually, the player switches from *Adaptive Bitrate* mode to *Manual Selection*.

>**Important:** On Safari browsers, only the *Adaptive Bitrate* mode is available.

#### Getting the Current Mode
The player exposes the current mode using the `isAdaptiveBitrateEnabled` method:
```javascript
if (player.isAdaptiveBitrateEnabled()) {
  console.log('The current bitrate mode is Adaptive Bitrate');
} else {
  console.log('The current bitrate mode is Manual Selection');
}
```
You can also use the the `ABR_MODE_CHANGED` event to expose the current mode:
```javascript
player.addEventListener(player.Event.ABR_MODE_CHANGED, function (event) {
  if (event.payload.mode === "auto") {
    console.log('The player has switched to Adaptive Bitrate');
  } else { // manual
    console.log('The player has switched to Manual Selection');
  }
});
```
#### Video Track Selection
To select a specific video track (bitrate), use the `selectTrack` method.
<br>The code below shows how to force the player to play the top bitrate track:
```javascript
var videoTracks = player.getTracks(player.Track.VIDEO);
var topBandwidthTrack;
var topBandwidth = 0;
for (var i = 0; i < videoTracks.length; i++) {
  if (videoTracks[i].bandwidth > topBandwidth) {
    topBandwidthTrack = videoTracks[i];
    topBandwidth = topBandwidthTrack.bandwidth;
  }
}
player.selectTrack(topBandwidthTrack);
```
By selecting a specific video track, the player switches to *Manual Selection* mode.
<br>To go back to the *Adaptive Bitrate* mode, use the `enableAdaptiveBitrate` method:
```javascript
player.addEventListener(player.Event.ABR_MODE_CHANGED, function (event) {
  // event.payload.mode === "auto"
});
player.enableAdaptiveBitrate();
```
Once the video track has changed, either automatically or manually, the player triggers a `VIDEO_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, function (event) {
  console.log('The new bitrate is: ' + event.payload.selectedVideoTrack.bandwidth);
});
```
## Audio Tracks
This section shows you how to manage audio tracks.

#### Audio Track Selection
To select a specific audio track, use the `selectTrack` method.
<br>The code below shows how to select the *spanish* audio track:
```javascript
var audioTracks = player.getTracks(player.Track.AUDIO);
for (var i = 0; i < audioTracks.length; i++) {
  if (audioTracks[i].language === 'es') {
    player.selectTrack(audioTracks[i]);
  }
}
```
Once the audio track has changed, the player triggers an `AUDIO_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, function (event) {
  console.log('The new audio track is: ' + event.payload.selectedAudioTrack.label);
});
```

## Text Tracks
This section shows you how to manage text tracks.

#### Text Track Selection
To select a specific text track, use the `selectTrack` method.
<br>The code below shows how to select the *spanish* text track:
```javascript
var textTracks = player.getTracks(player.Track.TEXT);
for (var i = 0; i < textTracks.length; i++) {
  if (textTracks[i].language === 'es') {
    player.selectTrack(textTracks[i]);
  }
}
```
Once the text track has changed, the player triggers a `TEXT_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.TEXT_TRACK_CHANGED, function (event) {
  console.log('The new text track is: ' + event.payload.selectedTextTrack.label);
});
```
#### Disabling the Text Track
To disable the text track, use the `hideTextTrack` method.
<br>In this case the player triggers a `TEXT_TRACK_CHANGED` event with 'off' track:
```javascript
player.addEventListener(player.Event.TEXT_TRACK_CHANGED, function (event) {
  // event.payload.selectedTextTrack.label === 'Off'
});
player.hideTextTrack();
```
