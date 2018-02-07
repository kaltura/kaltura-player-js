The Kaltura Player utilizes a highly modular approach for creating a powerful media player.
Each functionality of the player is isolated into separate packages, which are designed to deliver a specific set of abilities.
This approach enables extensibility, simplicity and easy maintenance.

The Kaltura Player integrates:
* [PlayKit JS ](https://github.com/kaltura/playkit-js) - The core library.
* [PlayKit JS UI](https://github.com/kaltura/playkit-js-ui) - The UI framework.
* [PlayKit JS DASH](https://github.com/kaltura/playkit-js-dash) and [PlayKit JS HLS](https://github.com/kaltura/playkit-js-hls) for HLS & MPEG-DASH media source extensions capabilities.
* [PlayKit JS IMA](https://github.com/kaltura/playkit-js-ima) for ads and monetization.
* [PlayKit JS Providers](https://github.com/kaltura/playkit-js-providers) as the backend media providers.
* [PlayKit JS Youbora](https://github.com/kaltura/playkit-js-youbora), [PlayKit JS KAnalytics](https://github.com/kaltura/playkit-js-kanalytics), and [PlayKit JS OTT Analytics](https://github.com/kaltura/playkit-js-ott-analytics) as the different analytics plugins.

The Kaltura Player exposes two different players: the *Kaltura OVP Player* and *Kaltura Cloud TV Player*. Each player integrates its related packages, as you can see in the following table:


|  | PlayKit JS | PlayKit JS Providers|PlayKit JS UI| PlayKit JS DASH | PlayKit JS HLS| PlayKit JS Youbora |  PlayKit JS KAnalytics|  PlayKit JS OTT Analytics|
| --- |---|---|---|---|---|---| ---| --- |
| OVP Player | V | OVP | V | V | V | V | V |  |
|  Cloud TV Player | V |  OTT | V | V | V | V |  | V | 

Next, let's look at how to [get started]() by creating a player using the Player API set.
