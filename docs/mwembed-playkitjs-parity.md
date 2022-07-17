# [mwEmbed](https://github.com/kaltura/mwEmbed) vs. kaltura-player-js Parity 

#### Player V7 Motivation

* Player V2 used to mimic Flash APIs (sendNotificatiom like) V7 is using modern tecnology HTML% and preact
* Player V2 is 
* Player V7 is much light weight player, JS prarsing is more efficient and load time is much faster, player bundle contains only required code pieces for playback.
* Player V7 out of the box UI is more efficient easy to write extra cose using react
* Player V7 plugins are linked to the player life cycle and a result player memory leaks are less common
* Player V7 custom plugin are easy to be integrated to the player
* Player V7 exposes Playback Adapters or license Adapters.
* Player V7 exposes ability to register to services wich saves code duplications
* Player V7 comes with new plugins and capabilites like Ads Waterfalling, SamrtSwitch, Broadpeak
* Player V7 is not using document.write api. V2 playar was using it and it  could cause page to stop rendering and could even stuck the plge load


#### Player V2 VS Player V7 Embed codes

##### V2 Dynamic Embed

```<script src="https://cdnapisec.kaltura.com/p/2068231/sp/206823100/embedIframeJs/uiconf_id/50380002/partner_id/2068231"></script>
<div id="kaltura_player_1657529534" style="width: 560px; height: 395px;"></div>
<script>
kWidget.embed({
  "targetId": "kaltura_player_1657529534",
  "wid": "_2068231",
  "uiconf_id": 50380002,
  "flashvars": {},
  "cache_st": 1657529534,
  "entry_id": "1_zdyx07u4"
});
</script>
```


##### V2 IFrame Embed

```
<iframe id="kaltura_player_1657529513" src="https://cdnapisec.kaltura.com/p/2068231/sp/206823100/embedIframeJs/uiconf_id/50380002/partner_id/2068231?iframeembed=true&playerId=kaltura_player_1657529513&entry_id=1_zdyx07u4" width="560" height="395" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0"></iframe>
```

##### V7 Dynamic Embed

```<div id="kaltura_player_621319997" style="width: 560px;height: 395px"></div>
<script type="text/javascript" src="https://cdnapisec.kaltura.com/p/2068231/embedPlaykitJs/uiconf_id/50575592"></script>
<script type="text/javascript">
        try {
              var kalturaPlayer = KalturaPlayer.setup({
              targetId: "kaltura_player_621319997",
              provider: {
                  partnerId: 2068231,
                  uiConfId: 50575592
               }
              });
              kalturaPlayer.loadMedia({entryId: '1_zdyx07u4'});
        } catch (e) {
          console.error(e.message)
        }
</script>
```

##### V7 IFrame Embed

```
<iframe type="text/javascript" src='https://cdnapisec.kaltura.com/p/2068231/embedPlaykitJs/uiconf_id/50575592?iframeembed=true&entry_id=1_zdyx07u4' style="width: 560px; height: 395px" allowfullscreen webkitallowfullscreen mozAllowFullScreen allow="autoplay *; fullscreen *; encrypted-media *" frameborder="0"></iframe>
```

## Playback Engines

| Engine  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------|-----------------------|-----------------------|
| HLS   				| Yes, hls.js, HLS-Flash	 		| Yes, hls.js, HLS-Flash			|
| MPEG-DASH   			| Yes, Shaka   			| Yes, Shaka   			|
| Progressive  			| Yes        			| Yes        			|
| HDS					| Yes, Flash        	| No        			|
| MSS   				| Yes, Silverlight  	| No        			|
| Multicast   			| Yes, Silverlight  	| No        			|
| P2P 				   	| Yes, Various Partners | No        			|
| DRM 				   	| Yes, Kaltura uDRM		| Yes, Kaltura uDRM		|
| Offline Playback, No DRM 		| No					| Yes					|
| Offline Playback, With DRM 		| No					| Yes, PWA based (Only in Desktop and Android)					|

## Browsers Supported

| Browser  			| mwEmbed 				| kaltura-player-js 			|
|-------------------|-----------------------|-----------------------|
| Chrome Desktop  	| Yes, HTML5, Latest	| Yes, HTML5, Latest	|
| Firefox   		| Yes, HTML5, Latest	| Yes, HTML5, Latest	|
| Edge		   		| Yes, HTML5, Latest	| Yes, HTML5, Latest	|
| Safari Mac   		| Yes, HTML5, v10+		| Yes, HTML5, v10+		|
| Safari iOS iPhone	| Yes, Native, v9+		| Yes, Native, v9+		|
| Safari iOS iPad	| Yes, HTML5, v9+		| Yes, HTML5, v9+		|
| Chrome Android 	| Yes, HTML5, v4.4+		| Yes, HTML5, v4.4+		|
| IE 11 			| Yes, HTML5, Win8.1+, Flash-win7		| Yes, HTML5-Win8.1+, Flash-win7		|
| IE 9,10	  		| Yes, Flash, Win7+		| Yes, Flash, Win7+ (Not Tested) 					|

## Casting and TV

| Browser  			| mwEmbed 				| kaltura-player-js 			|
|-------------------|-----------------------|-----------------------|
| Chromecast  	| Yes              | Yes	|
| AirPlay  	| Yes              | Yes	|
| Samsung (Tizen, Orsay)  	| No              | Yes	|
| LG (WebOS, Netcast)  	| No              | Yes	|

## Tracks 

### Text Tracks (Captions / Subtitles)

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| WebVTT 608/708 (Manifest Embedded)| Yes					| Yes 					|
| SRT file		  					| Yes					| Yes 					|
| DFXP file		  					| Yes					| No 					|

### Audio Tracks 

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Main Audio Tracks (Switch)		| Yes					| Yes 					|
| Overlay Audio	(e.g. Descriptions)		| No					| No 					|

### Video Tracks (Multi bitrate)

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Adaptive Bitrate Switching		| Yes					| Yes 					|
| Manual Flavor Selection			| Yes					| Yes 					|

## 360 and Virtual Reality

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| 360		                | Yes					| Yes 					|
| Play in VR headset		| Yes					| Yes 					|

* Supported also in Native Android/iOS SDKs

## User Controls and UI

| Feature  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Saved User Preferences 			| Yes					| Yes 					|
| Playback Rate (0.5x, 1x, 1.5x, 2x)| Yes					| Yes 					|
| Big Play Button		 			| Yes					| Yes 					|
| FullScreen			 			| Yes					| Yes 					|
| Seekbar (With Thumbnails Preview)	| Yes					| Yes 					|
| Time Display			 			| Yes					| Yes 					|
| 10 Seconds Rewind					| Yes					| Yes 					|
| Volume Control					| Yes					| Yes 					|
| Replay							| Yes					| Yes 					|
| Watermark 						| Yes					| Yes					|
| Mobile Skin						| Yes					| Yes 					|
| i18n UI Translations 				| Yes					| Yes		|
| Playlist							| Yes					|Yes (No UI)		|
| Share and Embed screen			| Yes					| Yes 		|
| Titlebar							| Yes					| H2 2019 		|
| End of Playback Screen / Related	| Yes					| H1 2019 		|
| Info Screen 						| Yes					| N/A 			 		|
| Player.js / Embedly				| Yes					|H1 2019 		|
| Report Abuse (Flag for moderator)	| Yes					| N/A 		|

## Selective Packaging of Plugins

All player plugins and capabilities (e.g. 360, Analytics, IMA Ads, etc.) are bundled selectively based on uiConnf json configuration. Below are not yet bundled selectively:

* Chromeless (don't load UI), currently requires pre-building a package or disabling UI but still loading it

## Accessibility - CVAA and ADA

| 					  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| CVAA Captions Style Controls 		| Yes					| Yes 					|
| Keyboard Shortcuts / Navigation 	| Yes					| Yes 					|
| Aria Tags (Screen Readers Support)| Yes					| H3 2019		|

## Analytics

| 3rd Party System  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Kaltura Analytics (legacy)	 	| Yes					| Yes 					|
| Kaltura Analytics (Kava)		 	| Yes					| Yes 					|
| Akamai Media Analytics	 	| Yes					| Yes 					|
| Youbora (Nice People At Work)	 	| Yes					| Yes 					|
| Google Analytics 				 	| Yes					| Yes 		|
| comScore		 				 	| Yes					| Yes  					|
| Adobe Analytics / Omniture		| Yes					| No  					|
| Nielsen		 				 	| No					| No 			 		|
| Marketo		 				 	| Yes					| No 			 		|
| Eloqua		 				 	| Yes					| No 			 		|

## Live 

| Capability		  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Playback and UI				 	| Yes					| Yes 					|
| DVR							 	| Yes					| Yes 					|
| Waiting Screen (isLive?) 			| Yes					| Q1 2020 		|

> See Interactivity and Use-Case Functionality for Webcasting.


## Advertising 

| Ads System			  			| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Google IMA - VAST/VPAID/VMAP				 		| Yes, VAST and VPAID					| Yes, VAST, VPAID and VMAP 					|
| Google IMA - DAI				 		| No					| Yes 					|

## Interactivity and Use-Case Functionality

| Functionality			  			| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Webcasting 				 		| Yes					| Q1 2020 					|
| Webcasting:Slides			 		| Yes					| Q1 2020 					|
| Webcasting:Polls 			 		| Yes					| Q1 2020 					|
| Webcasting:QnA 			 		| Yes					| Q1 2020 					|
| In-Video Quizzes 				 	| Yes					| No 					|
| Slides and Chapters 			 	| Yes					| No 					|
| Dual-Stream 					 	| Yes					| No 					|
| RaptMedia Interactive Branching 	| Yes					| Yes 					|
| Call To Action 				 	| Yes					| No 					|
| Hotspots 				 	| Yes					| Q2 2019 					|
| Marketo Form	 				 	| Yes					| No 					|
| Eloqua Form	 				 	| Yes					| No 					|


