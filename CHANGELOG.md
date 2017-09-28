# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.6.1"></a>
## [0.6.1](https://github.com/kaltura/kaltura-player-js/compare/v0.6.0...v0.6.1) (2017-09-28)


### Bug Fixes

* **FEC-7123:** include global webpack var in flow config  ([#38](https://github.com/kaltura/kaltura-player-js/issues/38)) ([d77e96a](https://github.com/kaltura/kaltura-player-js/commit/d77e96a))


<a name="0.6.0"></a>
# [0.6.0](https://github.com/kaltura/kaltura-player-js/compare/v0.3.0...v0.6.0) (2017-09-26)


### Bug Fixes

* **FEC-7131:** fix HLS playback on iOS ([#29](https://github.com/kaltura/kaltura-player-js/issues/29)) ([b635184](https://github.com/kaltura/kaltura-player-js/commit/b635184))
* **FEC-7192:** play native HLS on iOS ([#34](https://github.com/kaltura/kaltura-player-js/issues/34)) ([9b27213](https://github.com/kaltura/kaltura-player-js/commit/9b27213))
* **FEC-7123:** pass player version as provider param ([#35](https://github.com/kaltura/kaltura-player-js/issues/35)) ([bb950f8](https://github.com/kaltura/kaltura-player-js/commit/bb950f8))
* remove import of global webpack var ([ca0a23c](https://github.com/kaltura/kaltura-player-js/commit/ca0a23c))


### Features

* **local storage:** support caching user preferences ([#24](https://github.com/kaltura/kaltura-player-js/issues/24)) ([2e4280a](https://github.com/kaltura/kaltura-player-js/commit/2e4280a))
* evaluate default plugins config ([#30](https://github.com/kaltura/kaltura-player-js/issues/30)) ([f87beac](https://github.com/kaltura/kaltura-player-js/commit/f87beac))
* player doesn't attach itself to parent ([#27](https://github.com/kaltura/kaltura-player-js/issues/27)) ([b612d57](https://github.com/kaltura/kaltura-player-js/commit/b612d57))
* prefer native hls on safari ([#25](https://github.com/kaltura/kaltura-player-js/issues/25)) ([81ba2bf](https://github.com/kaltura/kaltura-player-js/commit/81ba2bf))
* storage refactor ([#33](https://github.com/kaltura/kaltura-player-js/issues/33)) ([717f409](https://github.com/kaltura/kaltura-player-js/commit/717f409))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/kaltura/kaltura-player-js/compare/v0.5.1...v0.5.2) (2017-09-18)



<a name="0.5.1"></a>
## [0.5.1](https://github.com/kaltura/kaltura-player-js/compare/v0.5.0...v0.5.1) (2017-09-17)


### Bug Fixes

* **FEC-7131:** fix HLS playback on iOS ([#29](https://github.com/kaltura/kaltura-player-js/issues/29)) ([b635184](https://github.com/kaltura/kaltura-player-js/commit/b635184))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/kaltura/kaltura-player-js/compare/v0.4.0...v0.5.0) (2017-09-17)


### Features

* player doesn't attach itself to parent ([#27](https://github.com/kaltura/kaltura-player-js/issues/27)) ([b612d57](https://github.com/kaltura/kaltura-player-js/commit/b612d57))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/kaltura/kaltura-player-js/compare/v0.3.0...v0.4.0) (2017-09-11)


### Features

* prefer native hls on safari ([#25](https://github.com/kaltura/kaltura-player-js/issues/25)) ([81ba2bf](https://github.com/kaltura/kaltura-player-js/commit/81ba2bf))
* **local storage:** support caching user preferences ([#24](https://github.com/kaltura/kaltura-player-js/issues/24)) ([2e4280a](https://github.com/kaltura/kaltura-player-js/commit/2e4280a))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/kaltura/kaltura-player-js/compare/v0.2.0...v0.3.0) (2017-09-07)


### Features

* choose native hls playback on safari ([#23](https://github.com/kaltura/kaltura-player-js/issues/23)) ([742cedf](https://github.com/kaltura/kaltura-player-js/commit/742cedf))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/kaltura/kaltura-player-js/compare/v0.2.0...v0.2.1) (2017-08-31)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/kaltura/kaltura-player-js/compare/v0.1.0...v0.2.0) (2017-08-23)


### Bug Fixes

* various playkit fixes ([df857fe](https://github.com/kaltura/kaltura-player-js/commit/df857fe))


### Features

* added youbora plugin ([990231a](https://github.com/kaltura/kaltura-player-js/commit/990231a))



<a name="0.1.0"></a>
# 0.1.0 (2017-08-08)


### Features

* **config:** extend setup config (ks, uiconf id and env) ([#8](https://github.com/kaltura/kaltura-player-js/issues/8)) ([871f0ff](https://github.com/kaltura/kaltura-player-js/commit/871f0ff))
* **config:** handle fully user config ([#7](https://github.com/kaltura/kaltura-player-js/issues/7)) ([912a7f1](https://github.com/kaltura/kaltura-player-js/commit/912a7f1))
* **kaltura player:** export setup method ([#2](https://github.com/kaltura/kaltura-player-js/issues/2)) ([e2fe738](https://github.com/kaltura/kaltura-player-js/commit/e2fe738))
* **polyfills:** handle polyfills to support safari 9, ie11, ie10 and ie9 ([#10](https://github.com/kaltura/kaltura-player-js/issues/10)) ([2dc37f5](https://github.com/kaltura/kaltura-player-js/commit/2dc37f5))
* add kaltura url params ([#11](https://github.com/kaltura/kaltura-player-js/issues/11)) ([1b36a12](https://github.com/kaltura/kaltura-player-js/commit/1b36a12))
* **poster:** decorate poster call with player dimensions ([#15](https://github.com/kaltura/kaltura-player-js/issues/15)) ([2a5b853](https://github.com/kaltura/kaltura-player-js/commit/2a5b853))
* add player name and version strings ([e0fc3b5](https://github.com/kaltura/kaltura-player-js/commit/e0fc3b5))
* decorates the player with kaltura-player to extend api ([#14](https://github.com/kaltura/kaltura-player-js/issues/14)) ([2393215](https://github.com/kaltura/kaltura-player-js/commit/2393215))
* handle dom element append and change response from setup to an object ([#6](https://github.com/kaltura/kaltura-player-js/issues/6)) ([7c7d653](https://github.com/kaltura/kaltura-player-js/commit/7c7d653))
