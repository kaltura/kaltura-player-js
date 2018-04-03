# [mwEmbed](https://github.com/kaltura/mwEmbed) vs. kaltura-player-js Parity 

## Playback Engines

| Engine  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------|-----------------------|-----------------------|
| HLS   				| Yes, hls.js	 		| Yes, hls.js			|
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
| IE 11 			| Yes, HTML5, Win8.1+		| Yes, HTML5, Win8.1+		|
| IE 9,10	  		| Yes, Flash, Win7+		| No 					|

## Tracks 

### Text Tracks (Captions / Subtitles)

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| WebVTT 608/708 (Manifest Embedded)| Yes					| Yes 					|
| SRT file		  					| Yes					| No 					|
| DFXP file		  					| Yes					| No 					|

### Audio Tracks 

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Main Audio Tracks (Switch)		| Yes					| Yes 					|
| Descriptive Audio	(Overlay)		| No					| No 					|

### Video Tracks (Multi bitrate)

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Adaptive Bitrate Switching		| Yes					| Yes 					|
| Manual Flavor Selection			| Yes					| Yes 					|

## 360 and Virtual Reality

| Kind  							| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| 360		                | Yes					| H2 2018 					|
| Play in VR headset		| Yes					| H2 2018 					|

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
| i18n UI Translations 				| Yes					| Q3 2018		|
| Share and Embed screen			| Yes					| H2 2018 		|
| Titlebar							| Yes					| H2 2018 		|
| Playlist							| Yes					| H2 2018 		|
| End of Playback Screen / Related	| Yes					| H2 2018 		|
| Info Screen 						| Yes					| N/A 			 		|
| Player.js / Embedly				| Yes					| N/A 		|
| Report Abuse (Flag for moderator)	| Yes					| N/A 		|

## Selective Packaging of Plugins

> All new plugins are bundeled selectively based on uiConnf json configuration

Below are not yet bundeled selectively:

* Chromeless (don't load UI)
* Google IMA

## Accessability - CVAA and ADA

| 					  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| CVAA Captions Style Controls 		| Yes					| Yes 					|
| Keyboard Shortcuts / Navigation 	| Yes					| Yes 					|
| Aria Tags (Screen Readers Support)| Yes					| H2 2018		|

## Analytics

| 3rd Party System  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Kaltura Analytics (legacy)	 	| Yes					| Yes 					|
| Kaltura Analytics (Kava)		 	| Yes					| Yes 					|
| Youbora (Nice People At Work)	 	| Yes					| Yes 					|
| Google Analytics 				 	| Yes					| Q2 2018 		|
| Adobe Analytics / Omniture		| Yes					| H2 2018  					|
| comScore		 				 	| Yes					| Q2 2018  					|
| Nielsen		 				 	| Yes					| H2 2018 			 		|
| Marketo		 				 	| Yes					| No 			 		|
| Eloqua		 				 	| Yes					| No 			 		|

## Live 

| Capability		  				| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Playback and UI				 	| Yes					| Yes 					|
| DVR							 	| Yes					| Yes 					|
| Waiting Screen (isLive?) 			| Yes					| No, in roadmap 		|

> See Interactivity and Use-Case Functionality for Webcasting.


## Advertising 

| Ads System			  			| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Google IMA 				 		| Yes					| Yes 					|

## Interactivity and Use-Case Functionality

| Functionality			  			| mwEmbed 				| kaltura-player-js 			|
|-----------------------------------|-----------------------|-----------------------|
| Webcasting 				 		| Yes					| No 					|
| Webcasting:Slides			 		| Yes					| No 					|
| Webcasting:Polls 			 		| Yes					| No 					|
| Webcasting:QnA 			 		| Yes					| No 					|
| In-Video Quizzes 				 	| Yes					| No 					|
| Slides and Chapters 			 	| Yes					| No 					|
| Dual-Stream 					 	| Yes					| No 					|
| RaptMedia Interactive Branching 	| Yes					| No 					|
| Call To Action 				 	| Yes					| No 					|
| Marketo Form	 				 	| Yes					| No 					|
| Eloqua Form	 				 	| Yes					| No 					|


