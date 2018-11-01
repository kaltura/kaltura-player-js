# API

### Table of Contents

- [BaseRemotePlayer][1]
  - [Parameters][2]
  - [loadMedia][3]
    - [Parameters][4]
  - [setMedia][5]
    - [Parameters][6]
  - [getMediaInfo][7]
  - [configure][8]
    - [Parameters][9]
  - [ready][10]
  - [load][11]
  - [play][12]
  - [pause][13]
  - [reset][14]
  - [destroy][15]
  - [isLive][16]
    - [Examples][17]
  - [isDvr][18]
    - [Examples][19]
  - [seekToLiveEdge][20]
  - [getStartTimeOfDvrWindow][21]
    - [Examples][22]
  - [getTracks][23]
    - [Parameters][24]
    - [Examples][25]
  - [getActiveTracks][26]
    - [Examples][27]
  - [selectTrack][28]
    - [Parameters][29]
  - [hideTextTrack][30]
  - [enableAdaptiveBitrate][31]
  - [isAdaptiveBitrateEnabled][32]
    - [Examples][33]
  - [setTextDisplaySettings][34]
    - [Parameters][35]
  - [startCasting][36]
  - [stopCasting][37]
  - [isCasting][38]
    - [Examples][39]
  - [isCastAvailable][40]
    - [Examples][41]
  - [getCastSession][42]
    - [Examples][43]
  - [isVr][44]
    - [Examples][45]
  - [toggleVrStereoMode][46]
  - [isInVrStereoMode][47]
    - [Examples][48]
  - [ads][49]
    - [Examples][50]
  - [textStyle][51]
    - [Parameters][52]
  - [textStyle][53]
    - [Examples][54]
  - [buffered][55]
    - [Examples][56]
  - [currentTime][57]
    - [Parameters][58]
  - [currentTime][59]
    - [Examples][60]
  - [duration][61]
    - [Examples][62]
  - [volume][63]
    - [Parameters][64]
  - [volume][65]
    - [Examples][66]
  - [paused][67]
    - [Examples][68]
  - [ended][69]
    - [Examples][70]
  - [seeking][71]
    - [Examples][72]
  - [muted][73]
    - [Parameters][74]
  - [muted][75]
    - [Examples][76]
  - [src][77]
    - [Examples][78]
  - [poster][79]
    - [Examples][80]
  - [playbackRate][81]
    - [Parameters][82]
  - [playbackRate][83]
    - [Examples][84]
  - [engineType][85]
    - [Examples][86]
  - [streamType][87]
    - [Examples][88]
  - [config][89]
  - [type][90]
    - [Examples][91]
  - [defaultConfig][92]
    - [Examples][93]
  - [Type][94]
    - [Examples][95]
  - [isSupported][96]
    - [Examples][97]
- [CastEventType][98]
  - [Examples][99]
- [PlayerSnapshot][100]
  - [Parameters][101]
  - [startTime][102]
  - [autoplay][103]
  - [audioLanguage][104]
  - [textLanguage][105]
  - [mediaInfo][106]
  - [textStyle][107]
  - [advertising][108]
- [RemoteControl][109]
  - [Parameters][110]
  - [getPlayerSnapshot][111]
  - [getUIWrapper][112]
  - [onRemoteDeviceDisconnected][113]
    - [Parameters][114]
  - [onRemoteDeviceConnected][115]
    - [Parameters][116]
  - [onRemoteDeviceAvailable][117]
    - [Parameters][118]
  - [onRemoteDeviceConnecting][119]
  - [onRemoteDeviceDisconnecting][120]
  - [onRemoteDeviceConnectFailed][121]
- [RemotePayload][122]
  - [Parameters][123]
  - [player][124]
- [RemoteConnectedPayload][125]
  - [Parameters][126]
  - [ui][127]
  - [session][128]
- [RemoteDisconnectedPayload][129]
  - [Parameters][130]
  - [snapshot][131]
- [RemoteAvailablePayload][132]
  - [Parameters][133]
  - [available][134]
- [RemotePlayerUI][135]
  - [playbackUI][136]
    - [Parameters][137]
  - [idleUI][138]
    - [Parameters][139]
  - [adsUI][140]
    - [Parameters][141]
  - [liveUI][142]
    - [Parameters][143]
  - [errorUI][144]
    - [Parameters][145]
  - [uis][146]
- [IRemotePlayer][147]
  - [textStyle][148]
  - [muted][149]
  - [playbackRate][150]
  - [volume][151]
  - [currentTime][152]
  - [buffered][153]
  - [duration][154]
  - [paused][155]
  - [ended][156]
  - [seeking][157]
  - [src][158]
  - [poster][159]
  - [config][160]
  - [engineType][161]
  - [streamType][162]
  - [type][163]
  - [ads][164]
  - [addEventListener][165]
    - [Parameters][166]
  - [removeEventListener][167]
    - [Parameters][168]
  - [dispatchEvent][169]
    - [Parameters][170]
  - [loadMedia][171]
    - [Parameters][172]
  - [setMedia][173]
    - [Parameters][174]
  - [getMediaInfo][175]
  - [configure][176]
    - [Parameters][177]
  - [ready][178]
  - [load][179]
  - [play][180]
  - [pause][181]
  - [reset][182]
  - [destroy][183]
  - [isLive][184]
  - [isDvr][185]
  - [seekToLiveEdge][186]
  - [getStartTimeOfDvrWindow][187]
  - [getTracks][188]
    - [Parameters][189]
  - [getActiveTracks][190]
  - [selectTrack][191]
    - [Parameters][192]
  - [hideTextTrack][193]
  - [enableAdaptiveBitrate][194]
  - [isAdaptiveBitrateEnabled][195]
  - [setTextDisplaySettings][196]
    - [Parameters][197]
  - [startCasting][198]
  - [stopCasting][199]
  - [isCasting][200]
  - [isCastAvailable][201]
  - [getCastSession][202]
  - [isVr][203]
  - [toggleVrStereoMode][204]
  - [isInVrStereoMode][205]
  - [Type][206]
  - [isSupported][207]
- [RemoteSession][208]
  - [Parameters][209]
  - [deviceFriendlyName][210]
  - [id][211]
  - [resuming][212]

## BaseRemotePlayer

**Extends FakeEventTarget**

### Parameters

- `name` **[string][213]** Remote player name.
- `config` **[Object][214]** Cast configuration.
- `remoteControl` **[RemoteControl][215]** Remote control.

### loadMedia

Loads a media to the receiver application.

#### Parameters

- `mediaInfo` **[Object][214]** The entry media info.

Returns **[Promise][216]&lt;void>** Promise to indicate load succeed or failed.

### setMedia

Sets a media to the remote player..

#### Parameters

- `mediaConfig` **[Object][214]** Media configuration to set.

Returns **void**

### getMediaInfo

Gets the media Info.

Returns **[Object][214]?** The media info.

### configure

Configure the remote player

#### Parameters

- `config` **[Object][214]** Configuration to set. (optional, default `{}`)

Returns **void**

### ready

The remote player readiness.

Returns **[Promise][216]&lt;any>** Promise which resolved when the remote player is ready.

### load

Load the remote player.

Returns **void**

### play

Play/resume the remote player.

Returns **void**

### pause

Pause the remote player.

Returns **void**

### reset

Reset the remote player.

Returns **void**

### destroy

Destroy the remote player.

Returns **void**

### isLive

#### Examples

```javascript
BaseRemotePlayer.prototype.isLive(); // false
```

Returns **[boolean][217]** Whether the current playback is a live playback.

### isDvr

#### Examples

```javascript
BaseRemotePlayer.prototype.isDvr(); // false
```

Returns **[boolean][217]** Whether the current live playback has DVR window. In case of non-live playback will return false.

### seekToLiveEdge

Seeks to the live edge.

Returns **void**

### getStartTimeOfDvrWindow

#### Examples

```javascript
BaseRemotePlayer.prototype.getStartTimeOfDvrWindow(); // 0
```

Returns **[number][218]** The start time of the DVR window.

### getTracks

#### Parameters

- `type` **[string][213]?** Track type.

#### Examples

```javascript
BaseRemotePlayer.prototype.getTracks(); // []
```

Returns **[Array][219]&lt;Track>** The remote player tracks.

### getActiveTracks

#### Examples

```javascript
BaseRemotePlayer.prototype.getTracks(); // {audio: undefined, video: undefined, text: undefined}
```

Returns **[Object][214]** The remote player active tracks.

### selectTrack

Select a certain track to be active.

#### Parameters

- `track` **Track** The track to activate.

Returns **void**

### hideTextTrack

Hides the active text track.

Returns **void**

### enableAdaptiveBitrate

Enables automatic adaptive bitrate switching.

Returns **void**

### isAdaptiveBitrateEnabled

#### Examples

```javascript
BaseRemotePlayer.prototype.isAdaptiveBitrateEnabled(); // true
```

Returns **[boolean][217]** Whether adaptive bitrate is enabled.

### setTextDisplaySettings

Sets the text display settings.

#### Parameters

- `settings` **[Object][214]** Text settings.

Returns **void**

### startCasting

Start casting.

Returns **[Promise][216]&lt;any>** A promise to indicate session is starting, or failed

### stopCasting

Stops the current cast session.

Returns **void**

### isCasting

#### Examples

```javascript
BaseRemotePlayer.prototype.isCasting(); // true
```

Returns **[boolean][217]** Whether casting is currently active.

### isCastAvailable

#### Examples

```javascript
BaseRemotePlayer.prototype.isCastAvailable(); // true
```

Returns **[boolean][217]** Whether casting is available.

### getCastSession

Gets the current remote session.

#### Examples

```javascript
BaseRemotePlayer.prototype.getCastSession(); // new RemoteSession('', '')
```

Returns **[RemoteSession][220]** The remote session.

### isVr

#### Examples

```javascript
BaseRemotePlayer.prototype.isVr(); // false
```

Returns **[boolean][217]** Whether the current media is of VR type (360 content).

### toggleVrStereoMode

Toggles VR mode on the current content.

Returns **void**

### isInVrStereoMode

#### Examples

```javascript
BaseRemotePlayer.prototype.isInVrStereoMode(); // false
```

Returns **[boolean][217]** Whether the current content displayed in VR mode.

### ads

The remote player ads controller.

Type: [Object][214]?

#### Examples

```javascript
BaseRemotePlayer.prototype.ads; // null
```

Returns **[Object][214]?**

### textStyle

Setter.

#### Parameters

- `style` **TextStyle** The text style to set.

Returns **void**

### textStyle

Getter.

#### Examples

```javascript
BaseRemotePlayer.prototype.textStyle; // new TextStyle()
```

Returns **TextStyle** The current text style.

### buffered

Gets the first buffered range of the remote player.

#### Examples

```javascript
BaseRemotePlayer.prototype.buffered; // []
```

Returns **[Array][219]&lt;any>** First buffered range in seconds.

### currentTime

Setter.

#### Parameters

- `to` **[number][218]** The number to set in seconds.

Returns **void**

### currentTime

Getter.

#### Examples

```javascript
BaseRemotePlayer.prototype.currentTime; // 0
```

Returns **[number][218]** The current time in seconds.

### duration

#### Examples

```javascript
BaseRemotePlayer.prototype.duration; // 0
```

Returns **[number][218]** The duration in seconds.

### volume

Setter.

#### Parameters

- `vol` **[number][218]** The volume to set in the range of 0-1.

Returns **void**

### volume

Getter.

#### Examples

```javascript
BaseRemotePlayer.prototype.volume; // 1
```

Returns **[number][218]** The current volume in the range of 0-1.

### paused

#### Examples

```javascript
BaseRemotePlayer.prototype.paused; // false
```

Returns **[boolean][217]** Whether the cast player is in paused state.

### ended

#### Examples

```javascript
BaseRemotePlayer.prototype.ended; // false
```

Returns **[boolean][217]** Whether the cast player is in ended state.

### seeking

#### Examples

```javascript
BaseRemotePlayer.prototype.seeking; // false
```

Returns **[boolean][217]** Whether the cast player is in seeking state.

### muted

Setter.

#### Parameters

- `mute` **[boolean][217]** The mute value to set.

Returns **void**

### muted

Getter.

#### Examples

```javascript
BaseRemotePlayer.prototype.muted; // false
```

Returns **[boolean][217]** The muted state.

### src

#### Examples

```javascript
BaseRemotePlayer.prototype.src; // ''
```

Returns **[string][213]** The current playing source url.

### poster

#### Examples

```javascript
BaseRemotePlayer.prototype.poster; // ''
```

Returns **[string][213]** The current poster url.

### playbackRate

Setter.

#### Parameters

- `rate` **[number][218]** The playback rate to set.

Returns **void**

### playbackRate

#### Examples

```javascript
BaseRemotePlayer.prototype.playbackRate; // 1
```

Returns **[string][213]** The current playback rate.

### engineType

#### Examples

```javascript
BaseRemotePlayer.prototype.engineType; // ''
```

Returns **[string][213]** The active engine type.

### streamType

#### Examples

```javascript
BaseRemotePlayer.prototype.streamType; // ''
```

Returns **[string][213]** The active stream type.

### config

Returns **[Object][214]** The runtime cast config.

### type

#### Examples

```javascript
BaseRemotePlayer.prototype.type; // BaseRemotePlayer.Type
```

Returns **[string][213]** The remote player type.

### defaultConfig

Default configuration of the remote player.

Type: [Object][214]

#### Examples

```javascript
BaseRemotePlayer.defaultConfig; // {}
```

### Type

Remote player type.

Type: [string][213]

#### Examples

```javascript
BaseRemotePlayer.Type; // 'BaseRemotePlayer'
```

### isSupported

#### Examples

```javascript
BaseRemotePlayer.isSupported(); // true
```

Returns **[boolean][217]** Whether the remote player is supported in the current environment.

## CastEventType

Type: [Object][214]

### Examples

```javascript
// Events lifecycle
1. CAST_AVAILABLE
2. CAST_SESSION_STARTING
3. CAST_SESSION_STARTED || CAST_SESSION_START_FAILED -> X
4. CAST_SESSION_ENDING
5. CAST_SESSION_ENDED
```

```javascript
// How to use
player.addEventListener(KalturaPlayer.cast.CastEventType.CAST_SESSION_STARTED, e => {
  console.log(e.session);
};
```

## PlayerSnapshot

### Parameters

- `player` **KalturaPlayer** The Kaltura player.

### startTime

Type: [number][218]

### autoplay

Type: [boolean][217]

### audioLanguage

Type: [string][213]

### textLanguage

Type: [string][213]

### mediaInfo

Type: ProviderMediaInfoObject

### textStyle

Type: TextStyle

### advertising

Type: [Object][214]

## RemoteControl

### Parameters

- `player` **KalturaPlayer** The Kaltura player.

### getPlayerSnapshot

Gets the player snapshot.

Type: [Function][221]

Returns **[PlayerSnapshot][222]** player snapshot.

### getUIWrapper

Gets the UI wrapper.

Type: [Function][221]

Returns **UIWrapper** The UI wrapper.

### onRemoteDeviceDisconnected

On remote device disconnected handler.

Type: [Function][221]

#### Parameters

- `payload` **[RemoteDisconnectedPayload][223]** disconnected payload.

Returns **void**

### onRemoteDeviceConnected

On remote device connected handler.

Type: [Function][221]

#### Parameters

- `payload` **[RemoteConnectedPayload][224]** connected payload.

Returns **void**

### onRemoteDeviceAvailable

On remote device available handler.

Type: [Function][221]

#### Parameters

- `payload` **[RemoteAvailablePayload][225]** available payload.

Returns **void**

### onRemoteDeviceConnecting

On remote device connecting handler.

Type: [Function][221]

Returns **void**

### onRemoteDeviceDisconnecting

On remote device disconnecting handler.

Type: [Function][221]

Returns **void**

### onRemoteDeviceConnectFailed

On remote device connect failed handler.

Type: [Function][221]

Returns **void**

## RemotePayload

### Parameters

- `player` **[BaseRemotePlayer][226]** The active remote player.

### player

The active remote player.

Type: [BaseRemotePlayer][226]

Returns **[BaseRemotePlayer][226]**

## RemoteConnectedPayload

**Extends RemotePayload**

### Parameters

- `player` **[BaseRemotePlayer][226]** The active remote player.
- `session` **[RemoteSession][220]** The remote session.
- `ui` **[RemotePlayerUI][227]?** Optional remote player UI preset.

### ui

Remote player UI preset.

Type: [RemotePlayerUI][227]?

Returns **[RemotePlayerUI][227]?**

### session

Remote session.

Type: [RemoteSession][220]

Returns **[RemoteSession][220]?**

## RemoteDisconnectedPayload

**Extends RemotePayload**

### Parameters

- `player` **[BaseRemotePlayer][226]** The active remote player.
- `snapshot` **[PlayerSnapshot][222]** The remote player snapshot.

### snapshot

Remote player snapshot.

Type: [PlayerSnapshot][222]

Returns **[PlayerSnapshot][222]**

## RemoteAvailablePayload

**Extends RemotePayload**

### Parameters

- `player` **[BaseRemotePlayer][226]** The active remote player.
- `available` **[boolean][217]** Remote player availability.

### available

Remote player availability.

Type: [boolean][217]

Returns **[boolean][217]**

## RemotePlayerUI

### playbackUI

Playback UI of the remote player.

#### Parameters

- `props` **[Object][214]** UI creation parameters.

Returns **React$Element&lt;any>** Component.

### idleUI

Idle UI of the remote player.

#### Parameters

- `props` **[Object][214]** UI creation parameters.

Returns **React$Element&lt;any>** Component.

### adsUI

Idle UI of the remote player.

#### Parameters

- `props` **[Object][214]** UI creation parameters.

Returns **React$Element&lt;any>** Component.

### liveUI

Live UI of the remote player.

#### Parameters

- `props` **[Object][214]** UI creation parameters.

Returns **React$Element&lt;any>** Component.

### errorUI

Error UI of the remote player.

#### Parameters

- `props` **[Object][214]** UI creation parameters.

Returns **React$Element&lt;any>** Component.

### uis

UI presets.

Type: [Array][219]&lt;UIPreset>

Returns **[Array][219]&lt;UIPreset>**

## IRemotePlayer

### textStyle

Type: TextStyle

### muted

Type: [boolean][217]

### playbackRate

Type: [number][218]

### volume

Type: [number][218]

### currentTime

Type: [number][218]

### buffered

Type: [number][218]

### duration

Type: [number][218]

### paused

Type: [boolean][217]

### ended

Type: [boolean][217]

### seeking

Type: [boolean][217]

### src

Type: [string][213]

### poster

Type: [string][213]

### config

Type: [Object][214]

### engineType

Type: [string][213]

### streamType

Type: [string][213]

### type

Type: [string][213]

### ads

Type: [Object][214]

### addEventListener

#### Parameters

- `type` **[string][213]**
- `listener` **[Function][221]**

### removeEventListener

#### Parameters

- `type` **[string][213]**
- `listener` **[Function][221]**

### dispatchEvent

#### Parameters

- `event` **FakeEvent**

### loadMedia

#### Parameters

- `mediaInfo` **[Object][214]**

### setMedia

#### Parameters

- `mediaConfig` **[Object][214]**

### getMediaInfo

Returns **[Object][214]**

### configure

#### Parameters

- `config` **[Object][214]**

### ready

Returns **[Promise][216]&lt;any>**

### load

### play

### pause

### reset

### destroy

### isLive

Returns **[boolean][217]**

### isDvr

Returns **[boolean][217]**

### seekToLiveEdge

### getStartTimeOfDvrWindow

Returns **[number][218]**

### getTracks

#### Parameters

- `type` **[string][213]?**

Returns **[Array][219]&lt;Track>**

### getActiveTracks

Returns **[Object][214]**

### selectTrack

#### Parameters

- `track` **Track**

### hideTextTrack

### enableAdaptiveBitrate

### isAdaptiveBitrateEnabled

Returns **[boolean][217]**

### setTextDisplaySettings

#### Parameters

- `settings` **[Object][214]**

### startCasting

### stopCasting

### isCasting

Returns **[boolean][217]**

### isCastAvailable

Returns **[boolean][217]**

### getCastSession

Returns **[RemoteSession][220]**

### isVr

Returns **[boolean][217]**

### toggleVrStereoMode

### isInVrStereoMode

Returns **[boolean][217]**

### Type

Type: [string][213]

### isSupported

Returns **[boolean][217]**

## RemoteSession

### Parameters

- `id` **[string][213]** Session ID.
- `friendlyName` **[string][213]** Receiver friendly name.
- `resuming` **[boolean][217]?** Whether the session is resuming.

### deviceFriendlyName

Receiver friendly name.

Type: [string][213]

Returns **[string][213]**

### id

Session ID.

Type: [string][213]

Returns **[string][213]**

### resuming

Whether the session is resuming.

Type: [boolean][217]?

Returns **[boolean][217]?**

[1]: #baseremoteplayer
[2]: #parameters
[3]: #loadmedia
[4]: #parameters-1
[5]: #setmedia
[6]: #parameters-2
[7]: #getmediainfo
[8]: #configure
[9]: #parameters-3
[10]: #ready
[11]: #load
[12]: #play
[13]: #pause
[14]: #reset
[15]: #destroy
[16]: #islive
[17]: #examples
[18]: #isdvr
[19]: #examples-1
[20]: #seektoliveedge
[21]: #getstarttimeofdvrwindow
[22]: #examples-2
[23]: #gettracks
[24]: #parameters-4
[25]: #examples-3
[26]: #getactivetracks
[27]: #examples-4
[28]: #selecttrack
[29]: #parameters-5
[30]: #hidetexttrack
[31]: #enableadaptivebitrate
[32]: #isadaptivebitrateenabled
[33]: #examples-5
[34]: #settextdisplaysettings
[35]: #parameters-6
[36]: #startcasting
[37]: #stopcasting
[38]: #iscasting
[39]: #examples-6
[40]: #iscastavailable
[41]: #examples-7
[42]: #getcastsession
[43]: #examples-8
[44]: #isvr
[45]: #examples-9
[46]: #togglevrstereomode
[47]: #isinvrstereomode
[48]: #examples-10
[49]: #ads
[50]: #examples-11
[51]: #textstyle
[52]: #parameters-7
[53]: #textstyle-1
[54]: #examples-12
[55]: #buffered
[56]: #examples-13
[57]: #currenttime
[58]: #parameters-8
[59]: #currenttime-1
[60]: #examples-14
[61]: #duration
[62]: #examples-15
[63]: #volume
[64]: #parameters-9
[65]: #volume-1
[66]: #examples-16
[67]: #paused
[68]: #examples-17
[69]: #ended
[70]: #examples-18
[71]: #seeking
[72]: #examples-19
[73]: #muted
[74]: #parameters-10
[75]: #muted-1
[76]: #examples-20
[77]: #src
[78]: #examples-21
[79]: #poster
[80]: #examples-22
[81]: #playbackrate
[82]: #parameters-11
[83]: #playbackrate-1
[84]: #examples-23
[85]: #enginetype
[86]: #examples-24
[87]: #streamtype
[88]: #examples-25
[89]: #config
[90]: #type
[91]: #examples-26
[92]: #defaultconfig
[93]: #examples-27
[94]: #type-1
[95]: #examples-28
[96]: #issupported
[97]: #examples-29
[98]: #casteventtype
[99]: #examples-30
[100]: #playersnapshot
[101]: #parameters-12
[102]: #starttime
[103]: #autoplay
[104]: #audiolanguage
[105]: #textlanguage
[106]: #mediainfo
[107]: #textstyle-2
[108]: #advertising
[109]: #remotecontrol
[110]: #parameters-13
[111]: #getplayersnapshot
[112]: #getuiwrapper
[113]: #onremotedevicedisconnected
[114]: #parameters-14
[115]: #onremotedeviceconnected
[116]: #parameters-15
[117]: #onremotedeviceavailable
[118]: #parameters-16
[119]: #onremotedeviceconnecting
[120]: #onremotedevicedisconnecting
[121]: #onremotedeviceconnectfailed
[122]: #remotepayload
[123]: #parameters-17
[124]: #player
[125]: #remoteconnectedpayload
[126]: #parameters-18
[127]: #ui
[128]: #session
[129]: #remotedisconnectedpayload
[130]: #parameters-19
[131]: #snapshot
[132]: #remoteavailablepayload
[133]: #parameters-20
[134]: #available
[135]: #remoteplayerui
[136]: #playbackui
[137]: #parameters-21
[138]: #idleui
[139]: #parameters-22
[140]: #adsui
[141]: #parameters-23
[142]: #liveui
[143]: #parameters-24
[144]: #errorui
[145]: #parameters-25
[146]: #uis
[147]: #iremoteplayer
[148]: #textstyle-3
[149]: #muted-2
[150]: #playbackrate-2
[151]: #volume-2
[152]: #currenttime-2
[153]: #buffered-1
[154]: #duration-1
[155]: #paused-1
[156]: #ended-1
[157]: #seeking-1
[158]: #src-1
[159]: #poster-1
[160]: #config-1
[161]: #enginetype-1
[162]: #streamtype-1
[163]: #type-2
[164]: #ads-1
[165]: #addeventlistener
[166]: #parameters-26
[167]: #removeeventlistener
[168]: #parameters-27
[169]: #dispatchevent
[170]: #parameters-28
[171]: #loadmedia-1
[172]: #parameters-29
[173]: #setmedia-1
[174]: #parameters-30
[175]: #getmediainfo-1
[176]: #configure-1
[177]: #parameters-31
[178]: #ready-1
[179]: #load-1
[180]: #play-1
[181]: #pause-1
[182]: #reset-1
[183]: #destroy-1
[184]: #islive-1
[185]: #isdvr-1
[186]: #seektoliveedge-1
[187]: #getstarttimeofdvrwindow-1
[188]: #gettracks-1
[189]: #parameters-32
[190]: #getactivetracks-1
[191]: #selecttrack-1
[192]: #parameters-33
[193]: #hidetexttrack-1
[194]: #enableadaptivebitrate-1
[195]: #isadaptivebitrateenabled-1
[196]: #settextdisplaysettings-1
[197]: #parameters-34
[198]: #startcasting-1
[199]: #stopcasting-1
[200]: #iscasting-1
[201]: #iscastavailable-1
[202]: #getcastsession-1
[203]: #isvr-1
[204]: #togglevrstereomode-1
[205]: #isinvrstereomode-1
[206]: #type-3
[207]: #issupported-1
[208]: #remotesession
[209]: #parameters-35
[210]: #devicefriendlyname
[211]: #id
[212]: #resuming
[213]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[214]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[215]: #remotecontrol
[216]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise
[217]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[218]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[219]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[220]: #remotesession
[221]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[222]: #playersnapshot
[223]: #remotedisconnectedpayload
[224]: #remoteconnectedpayload
[225]: #remoteavailablepayload
[226]: #baseremoteplayer
[227]: #remoteplayerui
