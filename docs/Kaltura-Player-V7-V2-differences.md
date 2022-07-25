## Player V7 - V2 Differences

Kaltura V7 Player is the current version of the Kaltura Player, intended to replace the V2 Player functionality, while providing improvements in several areas.
The main differences between the two version will be described below.

### 1. Motivation
*	Shorter startup time
*	Modular player bundle, containing the minimum code required for playback
*	Performance improvements over V2
*	Allowing easy development of plugins for additional functionality
*	More options for UI customization
*	Exposing playback and license adapters
*	New plugins such as Ad Waterfalling, Smartswitch and Broadpeak

### 2. Embed types
There are several options to embed V2 and V7 players in an HTML page, all of which are available through the Kaltura Management Console (KMC). However, regardless of the selected embed type, the V2 player always runs inside an iframe, while the V7 player would be scoped in an iframe only when using the  iframe embed.

### 3. Player Configuration
The V7 player allows setting configuration options in KMC and overriding them through either the application or the local storage.

Unlike the V2 player, the V7 player uses a json object for configuration, with all of the configuration settings located under this object, unlike in V2. The player can be configured at startup using setup() method, or during runtime using the configure() method.

### 4. Player API
While the V2 player provided several classes exposing different API functions, the V7 player exposes all of its API using the KalturaPlayer class and the player instance created by invoking KalturaPlayer.setup.

### 5. Playback Engines
The V7 player supports most of the media formats supported by the V2 player, except for HDS, MSS, Multicast and P2P streaming. The V7 player also adds support for offline playback.

###6. Platform support
V7 Player supports playback on Smart TV devices, including support for native HTML5 video playback on supported platforms

### 9. UI
The V7 player supports most of the UI functionality of the V2 player, and includes multiple graphic enhancements, giving it an updated and user-friendly user experience.
The V7 player comes working out-of-the-box, and unlike the V2 player does not require enabling plugins for ui controls such as quality and volume selection.
Users can extend the ui by creating their own plugins, use css to style the player elements, or even disable the player’s default player ui controls if they want to.

### 10. Analytics
The V7 player supports most of the analytics platforms supported by the V2 player.

### 11.	Advertising
In addition to VAST and VPAID ads supported in V2, the V7 player also supports VMAP ads and IMA DAI ads.

### 12.	Plugins
Almost all of the plugin functionality of the V2 player is expected to be migrated into the V7 player. In addition, the V7 player supports additional plugins such as the ADs-ondemand, ADs-Waterfalling, IMADAI, Broadpeak, GoogleTagManager and more.

