# Video, Audio and Text Tracks

The player exposes full API to handle all kind of tracks - video (bitrate), audio and text (language) tracks.
<br>This document shows how to use this API to handle the player tracks. 

+ [Tracks Availability:](#tracks-availability)
+ [Getting the Tracks:](#getting-the-tracks)
    * [Getting All Types of Tracks:](#getting-all-types-of-tracks)
    * [Getting Certain Type of Tracks:](#getting-certain-type-of-tracks)
    * [Getting the Current Active Tracks:](#getting-the-current-active-tracks)
+ [Video Tracks:](#video-tracks)
    * [Adaptive Bitrate and Manual Selection:](#adaptive-bitrate-and-manual-selection)
    * [Getting the Current Mode:](#getting-the-current-mode)
    * [Video Track Selection:](#video-track-selection)
+ [Audio Tracks:](#audio-tracks)
    * [Audio Track Selection:](#audio-track-selection)
+ [Text Tracks:](#text-tracks)
    * [Text Track Selection:](#text-track-selection)
  * [Disable Text Track:](#disable-text-track) 

### Tracks Availability:
The tracks are available only when the video source has loaded.
<br>There are 2 ways to make sure the tracks are available:
<br>Using: `TRACKS_CHANGED` event: 
```javascript
player.addEventListener(player.Event.TRACKS_CHANGED, function (event) {
  var tracks = event.payload.tracks;
  console.log('This source has ' + tracks.length + ' tracks');
});
```
Using: `ready` promise:
```javascript
player.ready().then(function(){
  var tracks = player.getTracks();
  console.log('This source has ' + tracks.length + ' tracks');
});
```
### Getting the Tracks: 
##### Getting All Types of Tracks:
The code below shows how to get the all player tracks using `getTracks` method:
```javascript
var tracks = player.getTracks();
console.log('This source has ' + tracks.length + ' tracks');
```

##### Getting Certain Type of Tracks:
It is possible to get a certain kind of tracks.
<br>The code below shows how to get it by passing a parameter to `getTracks` method:
```javascript
var videoTracks = player.getTracks(player.Track.VIDEO);
var audioTracks = player.getTracks(player.Track.AUDIO);
var textTracks = player.getTracks(player.Track.TEXT);
console.log('This source has ' + videoTracks.length + ' video tracks');
console.log('This source has ' + audioTracks.length + ' audio tracks');
console.log('This source has ' + textTracks.length + ' text tracks');
```

##### Getting the Current Active Tracks:
The code below shows how to get the current active player tracks using `getActiveTracks` method:
```javascript
var activeTracks = player.getActiveTracks();
console.log('The active video track is: ' + activeTracks.video);
console.log('The active audio track is: ' + activeTracks.audio);
console.log('The active text track is: ' + activeTracks.text);
```

### Video Tracks:
##### Adaptive Bitrate and Manual Selection:
Video tracks (bitrate) can be handling in 2 modes: *Adaptive Bitrate* and *Manual Selection*.
<br>When *Adaptive Bitrate* is enable, the player controls the video track selection according to the network conditions. This is the default mode.
<br>When Selecting a certain video track manually, the player switches from *Adaptive Bitrate* mode to *Manual Selection*.
**Important:** In Safari browser only *Adaptive Bitrate* mode is available.

##### Getting the Current Mode:
The player exposes the current mode via `isAdaptiveBitrateEnabled` method:
```javascript
if (player.isAdaptiveBitrateEnabled()) {
  console.log('The current bitrate mode is Adaptive Bitrate');
} else {
  console.log('The current bitrate mode is Manual Selection');
}
```
And also via `ABR_MODE_CHANGED` event:
```javascript
player.addEventListener(player.Event.ABR_MODE_CHANGED, function (event) {
  if (event.payload.mode === "auto") {
    console.log('The player has switched to Adaptive Bitrate');
  } else { // manual
    console.log('The player has switched to Manual Selection');
  }
});
```
##### Video Track Selection:
To select a certain video track (bitrate), use `selectTrack` method.
<br>The code below shows how to enforce the player to play the top bitrate track:
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
By selecting a certain video track the player switches to *Manual Selection* mode.
<br>To return back to *Adaptive Bitrate* mode, use `enableAdaptiveBitrate` method:
```javascript
player.addEventListener(player.Event.ABR_MODE_CHANGED, function (event) {
  // event.payload.mode === "auto"
});
player.enableAdaptiveBitrate();
```
Once the video track has change, automatically or manually, the player triggers `VIDEO_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.VIDEO_TRACK_CHANGED, function (event) {
  console.log('The new bitrate is: ' + event.payload.selectedVideoTrack.bandwidth);
});
```
### Audio Tracks:
##### Audio Track Selection:
To select a certain audio track, use `selectTrack` method.
<br>The code below shows how to select the *spanish* audio track:
```javascript
var audioTracks = player.getTracks(player.Track.AUDIO);
for (var i = 0; i < audioTracks.length; i++) {
  if (audioTracks[i].language === 'es') {
    player.selectTrack(audioTracks[i]);
  }
}
```
Once the audio track has change, the player triggers `AUDIO_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, function (event) {
  console.log('The new audio track is: ' + event.payload.selectedAudioTrack.label);
});
```

### Text Tracks:
##### Text Track Selection:
To select a certain text track, use `selectTrack` method.
<br>The code below shows how to select the *spanish* text track:
```javascript
var textTracks = player.getTracks(player.Track.TEXT);
for (var i = 0; i < textTracks.length; i++) {
  if (textTracks[i].language === 'es') {
    player.selectTrack(textTracks[i]);
  }
}
```
Once the text track has change, the player triggers `TEXT_TRACK_CHANGED` event:
```javascript
player.addEventListener(player.Event.TEXT_TRACK_CHANGED, function (event) {
  console.log('The new text track is: ' + event.payload.selectedTextTrack.label);
});
```
##### Disable Text Track:
To disable the text track, use `hideTextTrack` method.
<br>In this case the player triggers `TEXT_TRACK_CHANGED` with 'off' track:
```javascript
player.addEventListener(player.Event.TEXT_TRACK_CHANGED, function (event) {
  // event.payload.selectedTextTrack.label === 'Off'
});
player.hideTextTrack();
```
