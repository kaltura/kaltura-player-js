# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.0](https://github.com/kaltura/kaltura-player-js/compare/v3.0.0...v3.1.0) (2022-03-23)


### Bug Fixes

* **FEC-12000:** smart tv - dash video not working ([#530](https://github.com/kaltura/kaltura-player-js/issues/530)) ([4edac6f](https://github.com/kaltura/kaltura-player-js/commit/4edac6f))
* **FEC-12059:** [Youbora] Rendition values have a high number of "Undefined data" records ([#533](https://github.com/kaltura/kaltura-player-js/issues/533)) ([43e023e](https://github.com/kaltura/kaltura-player-js/commit/43e023e))


### Features

* update playkit-js to [0.79.0](https://github.com/kaltura/playkit-js/releases/tag/v0.79.0) ([66e3572](https://github.com/kaltura/kaltura-player-js/commit/66e3572))
* update playkit-js-hls to [1.30.1](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.30.1) ([7d6ffef](https://github.com/kaltura/kaltura-player-js/commit/7d6ffef))
* update playkit-js-providers to [2.34.0](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.34.0) ([b55539d](https://github.com/kaltura/kaltura-player-js/commit/b55539d))
* **FEC-11875:** Related Entries - by context ([#523](https://github.com/kaltura/kaltura-player-js/issues/523)) ([86fe909](https://github.com/kaltura/kaltura-player-js/commit/86fe909))
* **FEC-11889:** Upgrade to hlsjs 1.1.5 ([#528](https://github.com/kaltura/kaltura-player-js/issues/528)) ([6990f08](https://github.com/kaltura/kaltura-player-js/commit/6990f08))



## [3.0.0](https://github.com/kaltura/kaltura-player-js/compare/v2.0.0...v3.0.0) (2022-02-16)


### Bug Fixes

* update playkit-js-ui to [0.70.1](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.70.1) ([11ea80f](https://github.com/kaltura/kaltura-player-js/commit/11ea80f))
* **FEC-9716:** An array doesn't merged into plugin config ([#524](https://github.com/kaltura/kaltura-player-js/issues/524)) ([773171d](https://github.com/kaltura/kaltura-player-js/commit/773171d))


### Features

* update playkit-js to [0.78.0](https://github.com/kaltura/playkit-js/releases/tag/v0.78.0) ([81c7f8f](https://github.com/kaltura/kaltura-player-js/commit/81c7f8f))
* update playkit-js-dash to [1.30.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.30.0) ([a4d3b9a](https://github.com/kaltura/kaltura-player-js/commit/a4d3b9a))
* update playkit-js-hls to [1.29.0](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.29.0) ([ad6997f](https://github.com/kaltura/kaltura-player-js/commit/ad6997f))
* update playkit-js-providers to [2.33.0](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.33.0) ([112a412](https://github.com/kaltura/kaltura-player-js/commit/112a412))
* **FEC-11214:** upgrade shaka to 3.3 ([#518](https://github.com/kaltura/kaltura-player-js/issues/518)) ([05cdfe0](https://github.com/kaltura/kaltura-player-js/commit/05cdfe0))
* **FEC-11785:** [Youbora] - update youbora options for drm system that is used by the player ([#515](https://github.com/kaltura/kaltura-player-js/issues/515)) ([fbd6ab2](https://github.com/kaltura/kaltura-player-js/commit/fbd6ab2)), closes [kaltura/playkit-js-youbora#82](https://github.com/kaltura/kaltura-player-js/issues/82) [kaltura/playkit-js-dash#175](https://github.com/kaltura/kaltura-player-js/issues/175) [kaltura/playkit-js#624](https://github.com/kaltura/kaltura-player-js/issues/624)


### BREAKING CHANGES

* **FEC-11214:** - dash not supported on IE11



## [2.0.0](https://github.com/kaltura/kaltura-player-js/compare/v1.17.3...v2.0.0) (2022-01-19)


### Bug Fixes

* **FEC-11863:** default kava details are reported with no player version ([#513](https://github.com/kaltura/kaltura-player-js/issues/513)) ([42425b8](https://github.com/kaltura/kaltura-player-js/commit/42425b8))
* **FEC-11864:** kava reports player version instead of product version ([#514](https://github.com/kaltura/kaltura-player-js/issues/514)) ([b81f88b](https://github.com/kaltura/kaltura-player-js/commit/b81f88b))


### Features

* update playkit-js to [0.77.0](https://github.com/kaltura/playkit-js/releases/tag/v0.77.0) ([5dbbda4](https://github.com/kaltura/kaltura-player-js/commit/5dbbda4))
* update playkit-js-dash to [1.29.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.29.0) ([2054f7c](https://github.com/kaltura/kaltura-player-js/commit/2054f7c))
* update playkit-js-hls to [1.28.0](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.28.0) ([7c83f29](https://github.com/kaltura/kaltura-player-js/commit/7c83f29))
* update playkit-js-ui to [0.70.0](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.70.0) ([363cc8f](https://github.com/kaltura/kaltura-player-js/commit/363cc8f))
* **FEC-11738:** Related Entries - Phase 1 ([#511](https://github.com/kaltura/kaltura-player-js/issues/511)) ([13163a8](https://github.com/kaltura/kaltura-player-js/commit/13163a8))
* **FEC-11761:** expose stream timed metadata - phase 2 ([#512](https://github.com/kaltura/kaltura-player-js/issues/512)) ([dea6cbb](https://github.com/kaltura/kaltura-player-js/commit/dea6cbb))


### BREAKING CHANGES

* **FEC-11761:** for - 
https://github.com/kaltura/playkit-js-dual-screen/pull/52
https://github.com/kaltura/playkit-js-kaltura-cuepoints/pull/15



### [1.17.3](https://github.com/kaltura/kaltura-player-js/compare/v1.17.1...v1.17.3) (2022-01-02)


### Bug Fixes

* update playkit-js to [0.76.1](https://github.com/kaltura/playkit-js/releases/tag/v0.76.1) ([77df920](https://github.com/kaltura/kaltura-player-js/commit/77df920))
* **FEC-11792:** slides does not appear in dual video ([#510](https://github.com/kaltura/kaltura-player-js/issues/510)) ([a2f69fa](https://github.com/kaltura/kaltura-player-js/commit/a2f69fa))



### [1.17.2](https://github.com/kaltura/kaltura-player-js/compare/v1.17.1...v1.17.2) (2021-12-23)


### Bug Fixes

* **FEC-11792:** slides does not appear in dual video ([#510](https://github.com/kaltura/kaltura-player-js/issues/510)) ([a2f69fa](https://github.com/kaltura/kaltura-player-js/commit/a2f69fa))



### [1.17.1](https://github.com/kaltura/kaltura-player-js/compare/v1.17.0...v1.17.1) (2021-12-21)



## [1.17.0](https://github.com/kaltura/kaltura-player-js/compare/v1.16.3...v1.17.0) (2021-12-21)


### Bug Fixes

* update playkit-js-hls to [1.27.5](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.27.5) ([064e3a1](https://github.com/kaltura/kaltura-player-js/commit/064e3a1))
* update playkit-js-ui to [0.69.5](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.5) ([e18a2b4](https://github.com/kaltura/kaltura-player-js/commit/e18a2b4))
* **FEC-11711:** loadMedia is triggered before configuration is set from getMediaConfig ([#508](https://github.com/kaltura/kaltura-player-js/issues/508)) ([15b90e9](https://github.com/kaltura/kaltura-player-js/commit/15b90e9))


### Features

* update playkit-js to [0.76.0](https://github.com/kaltura/playkit-js/releases/tag/v0.76.0) ([beaac5f](https://github.com/kaltura/kaltura-player-js/commit/beaac5f))
* update playkit-js-dash to [1.28.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.28.0) ([110e03b](https://github.com/kaltura/kaltura-player-js/commit/110e03b))
* update playkit-js-providers to [2.32.0](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.32.0) ([a8c7123](https://github.com/kaltura/kaltura-player-js/commit/a8c7123))
* **FEC-11632:** expose stream timed metadata ([#509](https://github.com/kaltura/kaltura-player-js/issues/509)) ([9610316](https://github.com/kaltura/kaltura-player-js/commit/9610316))



### [1.16.3](https://github.com/kaltura/kaltura-player-js/compare/v1.16.2...v1.16.3) (2021-11-24)


### Bug Fixes

* update playkit-js-dash to [1.27.3](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.27.3) ([5da47f8](https://github.com/kaltura/kaltura-player-js/commit/5da47f8))
* update playkit-js-ui to [0.69.4](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.4) ([9a4fb0e](https://github.com/kaltura/kaltura-player-js/commit/9a4fb0e))
* **FEC-11156:** cast button appears for one player only when multiple players configured on the page and casting failed ([#495](https://github.com/kaltura/kaltura-player-js/issues/495)) ([5a46f84](https://github.com/kaltura/kaltura-player-js/commit/5a46f84))



### [1.16.2](https://github.com/kaltura/kaltura-player-js/compare/v1.16.1...v1.16.2) (2021-11-17)


### Bug Fixes

* **FEC-11695,FEC-11698:** player thumbnail stripe URL changes according to player size ([#507](https://github.com/kaltura/kaltura-player-js/issues/507)) ([50a02b0](https://github.com/kaltura/kaltura-player-js/commit/50a02b0))


### Tests

* **FEC-11611:** Pass the program ID when sending a bookmark ([#506](https://github.com/kaltura/kaltura-player-js/issues/506)) ([dc62c36](https://github.com/kaltura/kaltura-player-js/commit/dc62c36))



### [1.16.1](https://github.com/kaltura/kaltura-player-js/compare/v1.16.0...v1.16.1) (2021-11-10)


### Bug Fixes

* update playkit-js-providers to [2.31.0](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.31.0) ([7bb11b3](https://github.com/kaltura/kaltura-player-js/commit/7bb11b3))



## [1.16.0](https://github.com/kaltura/kaltura-player-js/compare/v1.15.0...v1.16.0) (2021-11-10)


### Bug Fixes

* **FEC-11611:** Pass the program ID when sending a bookmark ([#503](https://github.com/kaltura/kaltura-player-js/issues/503)) ([5355bcc](https://github.com/kaltura/kaltura-player-js/commit/5355bcc))
* **FEC-11611:** Pass the program ID when sending a bookmark ([#504](https://github.com/kaltura/kaltura-player-js/issues/504)) ([953c3a9](https://github.com/kaltura/kaltura-player-js/commit/953c3a9))
* **FEC-11668:** thumbnails not shown when hovering over Previous / Next playlist controls ([#502](https://github.com/kaltura/kaltura-player-js/issues/502)) ([d5ec72e](https://github.com/kaltura/kaltura-player-js/commit/d5ec72e))


### Features

* update playkit-js to [0.75.0](https://github.com/kaltura/playkit-js/releases/tag/v0.75.0) ([15eb60a](https://github.com/kaltura/kaltura-player-js/commit/15eb60a))



## [1.15.0](https://github.com/kaltura/kaltura-player-js/compare/v1.14.1...v1.15.0) (2021-10-27)


### Bug Fixes

* update playkit-js to [0.74.4](https://github.com/kaltura/playkit-js/releases/tag/v0.74.4 ([a1a0223](https://github.com/kaltura/kaltura-player-js/commit/a1a0223))
* update playkit-js-hls to [1.27.3](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.27.3) ([8bb7efd](https://github.com/kaltura/kaltura-player-js/commit/8bb7efd))
* update playkit-js-ui to [0.69.3](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.3) ([6c08e93](https://github.com/kaltura/kaltura-player-js/commit/6c08e93))


### Features

* **FEC-11649:** live duration APIs ([#501](https://github.com/kaltura/kaltura-player-js/issues/501)) ([ab8a715](https://github.com/kaltura/kaltura-player-js/commit/ab8a715))



### [1.14.1](https://github.com/kaltura/kaltura-player-js/compare/v1.14.0...v1.14.1) (2021-10-12)


### Bug Fixes

* update playkit-js to [0.74.2](https://github.com/kaltura/playkit-js/releases/tag/v0.74.2) ([550851b](https://github.com/kaltura/kaltura-player-js/commit/550851b))



## [1.14.0](https://github.com/kaltura/kaltura-player-js/compare/v1.13.2...v1.14.0) (2021-10-12)


### Bug Fixes

* **FEV-1011:** add TS-types for cue-point manager and cues ([#499](https://github.com/kaltura/kaltura-player-js/issues/499)) ([5abb342](https://github.com/kaltura/kaltura-player-js/commit/5abb342))
* **FEV-1011:** add TS-types for player ([#500](https://github.com/kaltura/kaltura-player-js/issues/500)) ([6823193](https://github.com/kaltura/kaltura-player-js/commit/6823193))


### Features

* **FEC-11554:** delay addCuePoints after media loaded in video ([#498](https://github.com/kaltura/kaltura-player-js/issues/498)) ([10f80e0](https://github.com/kaltura/kaltura-player-js/commit/10f80e0))



### [1.13.2](https://github.com/kaltura/kaltura-player-js/compare/v1.13.1...v1.13.2) (2021-09-30)


### Build System

* doesn't recognize correctly the branch ([#464](https://github.com/kaltura/kaltura-player-js/issues/464)) ([2cb82fc](https://github.com/kaltura/kaltura-player-js/commit/2cb82fc))



### [1.13.1](https://github.com/kaltura/kaltura-player-js/compare/v1.13.0...v1.13.1) (2021-09-30)


### Bug Fixes

* update playkit-js to [0.74.1](https://github.com/kaltura/playkit-js/releases/tag/v0.74.1) ([c0788f7](https://github.com/kaltura/kaltura-player-js/commit/c0788f7))
* update playkit-js-ui to [0.69.2](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.2) ([94c5491](https://github.com/kaltura/kaltura-player-js/commit/94c5491))



## [1.13.0](https://github.com/kaltura/kaltura-player-js/compare/v1.12.1...v1.13.0) (2021-09-15)


### Bug Fixes

* update playkit-js to [0.74.0](https://github.com/kaltura/playkit-js/releases/tag/v0.74.0) ([a643057](https://github.com/kaltura/kaltura-player-js/commit/a643057))
* **FEC-11498:** Remove product version from player config ([#492](https://github.com/kaltura/kaltura-player-js/issues/492)) ([900ad75](https://github.com/kaltura/kaltura-player-js/commit/900ad75))
* **FEC-11510:** fix cvaa default font size ([#491](https://github.com/kaltura/kaltura-player-js/issues/491)) ([99f2959](https://github.com/kaltura/kaltura-player-js/commit/99f2959)), closes [kaltura/playkit-js#603](https://github.com/kaltura/kaltura-player-js/issues/603) [kaltura/playkit-js-ui#639](https://github.com/kaltura/kaltura-player-js/issues/639)
* **FEC-11513:** Need to click the Retry button twice after error ([#485](https://github.com/kaltura/kaltura-player-js/issues/485)) ([84406e9](https://github.com/kaltura/kaltura-player-js/commit/84406e9))
* **FEC-11525:** disableUserCache is not working properly for text style ([#487](https://github.com/kaltura/kaltura-player-js/issues/487)) ([a44e060](https://github.com/kaltura/kaltura-player-js/commit/a44e060))


### Features

* **FEC-11540:** CuePoint Manager ([#488](https://github.com/kaltura/kaltura-player-js/issues/488)) ([025059a](https://github.com/kaltura/kaltura-player-js/commit/025059a))



### [1.12.1](https://github.com/kaltura/kaltura-player-js/compare/v1.12.0...v1.12.1) (2021-08-30)


### Bug Fixes

* update playkit-js-ui to [0.69.1](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.1) ([3ddf68b](https://github.com/kaltura/kaltura-player-js/commit/3ddf68b))



## [1.12.0](https://github.com/kaltura/kaltura-player-js/compare/v1.11.1...v1.12.0) (2021-08-26)


### Bug Fixes
* update playkit-js to [0.73.1](https://github.com/kaltura/playkit-js/releases/tag/v0.73.1)
* update playkit-js-dash to [1.27.2](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.27.2) ([478e0af](https://github.com/kaltura/kaltura-player-js/commit/478e0af))
* update playkit-js-providers to [2.30.0](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.30.0 ([4823de7](https://github.com/kaltura/kaltura-player-js/commit/4823de7))
* **FEC-10598:** add streamId to ad object ([#481](https://github.com/kaltura/kaltura-player-js/issues/481)) ([e70c741](https://github.com/kaltura/kaltura-player-js/commit/e70c741))
* **FEC-11441:** Default kava details are reported with wrong (unknown) player version ([#478](https://github.com/kaltura/kaltura-player-js/issues/478)) ([d918029](https://github.com/kaltura/kaltura-player-js/commit/d918029))
* **FEC-11475:** revert api in uiWrapper of Manager for backward compatibility ([#483](https://github.com/kaltura/kaltura-player-js/issues/483)) ([1f5d4a7](https://github.com/kaltura/kaltura-player-js/commit/1f5d4a7))


### Features

* update playkit-js-ui to [0.69.0](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.69.0) ([5e2c275](https://github.com/kaltura/kaltura-player-js/commit/5e2c275))
* **FEC-11399:** allow ignoring server config ([#480](https://github.com/kaltura/kaltura-player-js/issues/480)) ([707d519](https://github.com/kaltura/kaltura-player-js/commit/707d519))
* **FEC-11475:** create service manager that allows registration and accessing of services ([#477](https://github.com/kaltura/kaltura-player-js/issues/477)) ([437f7b6](https://github.com/kaltura/kaltura-player-js/commit/437f7b6))



### [1.11.1](https://github.com/kaltura/kaltura-player-js/compare/v1.11.0...v1.11.1) (2021-07-27)



## [1.11.0](https://github.com/kaltura/kaltura-player-js/compare/v1.10.3...v1.11.0) (2021-07-27)


### Bug Fixes

* update playkit-js-hls to [1.27.1](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.27.1) ([b11f3bc](https://github.com/kaltura/kaltura-player-js/commit/b11f3bc))
* **FEC-11402:** preview does not work - fix y position ([#471](https://github.com/kaltura/kaltura-player-js/issues/471)) ([2d79e57](https://github.com/kaltura/kaltura-player-js/commit/2d79e57))
* **FEC-11402:** preview doesn't work in video ratio different than 16:9 ([#466](https://github.com/kaltura/kaltura-player-js/issues/466)) ([26dc475](https://github.com/kaltura/kaltura-player-js/commit/26dc475))
* **FEC-11431:** no preview thumbnails shown when casting on chromecast - regression ([#472](https://github.com/kaltura/kaltura-player-js/issues/472)) ([830f828](https://github.com/kaltura/kaltura-player-js/commit/830f828))
* **FEC-11431:** refactor preview thumb height from real image sprite height ([#473](https://github.com/kaltura/kaltura-player-js/issues/473)) ([fe5ad62](https://github.com/kaltura/kaltura-player-js/commit/fe5ad62)), closes [#466](https://github.com/kaltura/kaltura-player-js/issues/466) [#471](https://github.com/kaltura/kaltura-player-js/issues/471) [#472](https://github.com/kaltura/kaltura-player-js/issues/472)


### Features

* update playkit-js to [0.73.0](https://github.com/kaltura/playkit-js/releases/tag/v0.73.0) ([290e191](https://github.com/kaltura/kaltura-player-js/commit/290e191))
* update playkit-js-dash to [1.27.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.27.0) ([ed268af](https://github.com/kaltura/kaltura-player-js/commit/ed268af))
* update playkit.js-ui to [0.68.0](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.68.0) ([ab1fb88](https://github.com/kaltura/kaltura-player-js/commit/ab1fb88))
* **FEC-10791:** Ad-Layout for live streams  ([#459](https://github.com/kaltura/kaltura-player-js/issues/459)) ([ba693c1](https://github.com/kaltura/kaltura-player-js/commit/ba693c1))
* **FEC-11423:** upgrade shaka to 3.0.13 ([#468](https://github.com/kaltura/kaltura-player-js/issues/468)) ([54da73d](https://github.com/kaltura/kaltura-player-js/commit/54da73d))
* **FEC-11423:** upgrade shaka to 3.0.13 ([#470](https://github.com/kaltura/kaltura-player-js/issues/470)) ([0b6f853](https://github.com/kaltura/kaltura-player-js/commit/0b6f853))



### [1.10.3](https://github.com/kaltura/kaltura-player-js/compare/v1.10.2...v1.10.3) (2021-07-15)


### Bug Fixes

* update playkit.js-ui to [0.67.3](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.67.3) ([cf9a840](https://github.com/kaltura/kaltura-player-js/commit/cf9a840))



### [1.10.2](https://github.com/kaltura/kaltura-player-js/compare/v1.10.1...v1.10.2) (2021-07-08)


### Bug Fixes

* update playkit.js-ui to [0.67.1](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.67.1) ([7e1f329](https://github.com/kaltura/kaltura-player-js/commit/7e1f329))


### Build System

* **FEC-11389:** reduce builds from travis ([0e6eedb](https://github.com/kaltura/kaltura-player-js/commit/0e6eedb))



### [1.10.1](https://github.com/kaltura/kaltura-player-js/compare/v1.10.0...v1.10.1) (2021-07-01)


### Bug Fixes

* update playkit.js-providers to [2.29.1](https://github.com/kaltura/playkit-js-providers/releases/tag/v2.29.1) ([62f6822](https://github.com/kaltura/kaltura-player-js/commit/62f6822))



## [1.10.0](https://github.com/kaltura/kaltura-player-js/compare/v1.7.5...v1.10.0) (2021-07-01)


### Bug Fixes

* **FEC-10994:** Invalid version reported by players ([#452](https://github.com/kaltura/kaltura-player-js/issues/452)) ([25fcd7d](https://github.com/kaltura/kaltura-player-js/commit/25fcd7d))
* **FEC-11125:** expose selected source ([#461](https://github.com/kaltura/kaltura-player-js/issues/461)) ([79d7c0d](https://github.com/kaltura/kaltura-player-js/commit/79d7c0d))
* **FEC-11374:** Live DVR starting to cast from beginning of the DVR instead of Live edge ([#463](https://github.com/kaltura/kaltura-player-js/issues/463)) ([70ffe79](https://github.com/kaltura/kaltura-player-js/commit/70ffe79))


### Build System

* fix CI/CD canary process ([d2c55d8](https://github.com/kaltura/kaltura-player-js/commit/d2c55d8))
* resolve the correct patch for deployment ([#455](https://github.com/kaltura/kaltura-player-js/issues/455)) ([f15f16d](https://github.com/kaltura/kaltura-player-js/commit/f15f16d))
* trigger jenkins with correct canary version ([8da55b0](https://github.com/kaltura/kaltura-player-js/commit/8da55b0))
* **FEC-10700:** Improvement for CI/CD ([#389](https://github.com/kaltura/kaltura-player-js/issues/389)) ([8937aea](https://github.com/kaltura/kaltura-player-js/commit/8937aea))


### Features

* update playkit.js to [0.72.0](https://github.com/kaltura/playkit-js/releases/tag/v0.72.0) ([f71dfb2](https://github.com/kaltura/kaltura-player-js/commit/f71dfb2))
* update playkit.js-dash to [1.26.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.26.0) ([318deb0](https://github.com/kaltura/kaltura-player-js/commit/318deb0))
* update playkit.js-hls to [1.27.0](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.27.0) ([10314bb](https://github.com/kaltura/kaltura-player-js/commit/10314bb))
* update playkit.js-ui to [0.67.0](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.67.0) ([539d0cd](https://github.com/kaltura/kaltura-player-js/commit/539d0cd))
* **FEC-10785:** add support to remove ui element ([#460](https://github.com/kaltura/kaltura-player-js/issues/460)) ([fd2172c](https://github.com/kaltura/kaltura-player-js/commit/fd2172c))
* **FEC-10817:** expose the current time of the video element in live streams ([#431](https://github.com/kaltura/kaltura-player-js/issues/431)) ([c62a54a](https://github.com/kaltura/kaltura-player-js/commit/c62a54a))
* **FEC-10835:** expose share to plugin ([#447](https://github.com/kaltura/kaltura-player-js/issues/447)) ([45dd205](https://github.com/kaltura/kaltura-player-js/commit/45dd205))
* **FEC-11337:** Upgrade hls.js to 1.0  ([#456](https://github.com/kaltura/kaltura-player-js/issues/456)) ([cdedeaa](https://github.com/kaltura/kaltura-player-js/commit/cdedeaa))



## [1.9.0](https://github.com/kaltura/kaltura-player-js/compare/v1.7.5...v1.9.0) (2021-07-01)


### Bug Fixes

* **FEC-11125:** expose selected source ([#461](https://github.com/kaltura/kaltura-player-js/issues/461)) ([79d7c0d](https://github.com/kaltura/kaltura-player-js/commit/79d7c0d))


### Build System

* fix CI/CD canary process ([d2c55d8](https://github.com/kaltura/kaltura-player-js/commit/d2c55d8))
* resolve the correct patch for deployment ([#455](https://github.com/kaltura/kaltura-player-js/issues/455)) ([f15f16d](https://github.com/kaltura/kaltura-player-js/commit/f15f16d))
* trigger jenkins with correct canary version ([8da55b0](https://github.com/kaltura/kaltura-player-js/commit/8da55b0))
* **FEC-10700:** Improvement for CI/CD ([#389](https://github.com/kaltura/kaltura-player-js/issues/389)) ([8937aea](https://github.com/kaltura/kaltura-player-js/commit/8937aea))


### Features

* **FEC-10785:** add support to remove ui element ([#460](https://github.com/kaltura/kaltura-player-js/issues/460)) ([fd2172c](https://github.com/kaltura/kaltura-player-js/commit/fd2172c))
* **FEC-10817:** expose the current time of the video element in live streams ([#431](https://github.com/kaltura/kaltura-player-js/issues/431)) ([c62a54a](https://github.com/kaltura/kaltura-player-js/commit/c62a54a))
* **FEC-10835:** expose share to plugin ([#447](https://github.com/kaltura/kaltura-player-js/issues/447)) ([45dd205](https://github.com/kaltura/kaltura-player-js/commit/45dd205))
* **FEC-11337:** Upgrade hls.js to 1.0  ([#456](https://github.com/kaltura/kaltura-player-js/issues/456)) ([cdedeaa](https://github.com/kaltura/kaltura-player-js/commit/cdedeaa))



### [1.7.5](https://github.com/kaltura/kaltura-player-js/compare/v1.7.3...v1.7.5) (2021-06-03)


### Bug Fixes

* **FEC-11304:** missing entryId on plugins ([#453](https://github.com/kaltura/kaltura-player-js/issues/453)) ([db567aa](https://github.com/kaltura/kaltura-player-js/commit/db567aa))



### [1.7.3](https://github.com/kaltura/kaltura-player-js/compare/v1.7.2...v1.7.3) (2021-06-02)


### Bug Fixes

* update playkit.js to [0.71.0](https://github.com/kaltura/playkit-js/releases/tag/v0.71.0) ([b148b26](https://github.com/kaltura/kaltura-player-js/commit/b148b26))
* update playkit.js-dash to [1.25.0](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.25.0) ([155d5f3](https://github.com/kaltura/kaltura-player-js/commit/155d5f3))
* update playkit.js-hls to [1.26.0](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.26.0) ([8305089](https://github.com/kaltura/kaltura-player-js/commit/8305089))
* update playkit.js-ui to [0.66.2](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.66.2) ([994ae63](https://github.com/kaltura/kaltura-player-js/commit/994ae63))
* **FEC-10381:** sources config need to be passed via setMedia api ([#440](https://github.com/kaltura/kaltura-player-js/issues/440)) ([2e91c65](https://github.com/kaltura/kaltura-player-js/commit/2e91c65))
* **FEC-11281:** youbora reporting buffering during playback ([#450](https://github.com/kaltura/kaltura-player-js/issues/450)) ([fcc7234](https://github.com/kaltura/kaltura-player-js/commit/fcc7234))



### [1.7.2](https://github.com/kaltura/kaltura-player-js/compare/v1.7.1...v1.7.2) (2021-05-11)


### Bug Fixes

* update playkit.js to [0.70.1](https://github.com/kaltura/playkit-js/releases/tag/v0.70.1) ([5a2e8ac](https://github.com/kaltura/kaltura-player-js/commit/5a2e8ac))


### Build System

* update Jenkins trigger ([#441](https://github.com/kaltura/kaltura-player-js/issues/441)) ([7709ff5](https://github.com/kaltura/kaltura-player-js/commit/7709ff5))



### [1.7.1](https://github.com/kaltura/kaltura-player-js/compare/v1.7.0...v1.7.1) (2021-05-04)


### Bug Fixes

* update playkit-js-dash to [1.24.3](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.24.3) ([856d217](https://github.com/kaltura/kaltura-player-js/commit/856d217))



## [1.7.0](https://github.com/kaltura/kaltura-player-js/compare/v1.6.1...v1.7.0) (2021-04-28)


### Bug Fixes

* **FEC-11126:** moved useShakaTextTrackDisplay from playback.options.playback.options.html5.dash to text ([#432](https://github.com/kaltura/kaltura-player-js/issues/432)) ([bd6022e](https://github.com/kaltura/kaltura-player-js/commit/bd6022e))


### Features

* update playkit.js to [0.70.0](https://github.com/kaltura/playkit-js/releases/tag/v0.70.0) ([2e8311f](https://github.com/kaltura/kaltura-player-js/commit/2e8311f))
* update playkit.js-dash to [1.24.2](https://github.com/kaltura/playkit-js-dash/releases/tag/v1.24.2) ([4974cf8](https://github.com/kaltura/kaltura-player-js/commit/4974cf8))
* update playkit.js-hls to [1.25.1](https://github.com/kaltura/playkit-js-hls/releases/tag/v1.25.1) ([59e35e2](https://github.com/kaltura/kaltura-player-js/commit/59e35e2))
* update playkit.js-ui to [0.65.3](https://github.com/kaltura/playkit-js-ui/releases/tag/v0.65.3) ([874f0be](https://github.com/kaltura/kaltura-player-js/commit/874f0be))
* **FEC-11091:** add support for XMLHttpRequest.withCredentials in request filter ([#438](https://github.com/kaltura/kaltura-player-js/issues/438)) ([5ccdc1a](https://github.com/kaltura/kaltura-player-js/commit/5ccdc1a))
* **FEC-11126:** upgrade Shaka to 3.0.10 ([#434](https://github.com/kaltura/kaltura-player-js/issues/434)) ([18bafd6](https://github.com/kaltura/kaltura-player-js/commit/18bafd6))



### [1.6.1](https://github.com/kaltura/kaltura-player-js/compare/v1.6.0...v1.6.1) (2021-04-06)



## [1.6.0](https://github.com/kaltura/kaltura-player-js/compare/v1.5.6...v1.6.0) (2021-04-06)


### Bug Fixes

* **FEC-10281:** chromecast does not work after playing it once and trying it on another video ([#417](https://github.com/kaltura/kaltura-player-js/issues/417)) ([42e7939](https://github.com/kaltura/kaltura-player-js/commit/42e7939))
* **FEC-10405:** set capabilities manually on iOS devices when airplay is configured ([#422](https://github.com/kaltura/kaltura-player-js/issues/422)) ([d16d4b1](https://github.com/kaltura/kaltura-player-js/commit/d16d4b1))
* **FEC-11057:** ima postroll doesn't play when imadai configured before ([#424](https://github.com/kaltura/kaltura-player-js/issues/424)) ([a838ea5](https://github.com/kaltura/kaltura-player-js/commit/a838ea5))
* **FEC-11062:** ad layout doesn't work when IMA DAI configured ([#425](https://github.com/kaltura/kaltura-player-js/issues/425)) ([2251d5f](https://github.com/kaltura/kaltura-player-js/commit/2251d5f))
* **FEC-11089:** bumper preroll doesn't play after ima preroll ([#428](https://github.com/kaltura/kaltura-player-js/issues/428)) ([cd7a287](https://github.com/kaltura/kaltura-player-js/commit/cd7a287))


### Features

* **11077:** expose api for restart the media source ([#427](https://github.com/kaltura/kaltura-player-js/issues/427)) ([145f53c](https://github.com/kaltura/kaltura-player-js/commit/145f53c))
* **FEC-10541:** add support on working with bidding, Prebid and IMA  ([#412](https://github.com/kaltura/kaltura-player-js/issues/412)) ([0f21b24](https://github.com/kaltura/kaltura-player-js/commit/0f21b24))
* **FEC-10941:** Use In-Stream DASH thumbnails on the timeline ([#423](https://github.com/kaltura/kaltura-player-js/issues/423)) ([33bc80c](https://github.com/kaltura/kaltura-player-js/commit/33bc80c))



### [1.5.6](https://github.com/kaltura/kaltura-player-js/compare/v1.5.5...v1.5.6) (2021-03-24)



### [1.5.5](https://github.com/kaltura/kaltura-player-js/compare/v1.5.4...v1.5.5) (2021-03-07)



### [1.5.4](https://github.com/kaltura/kaltura-player-js/compare/v1.5.2...v1.5.4) (2021-03-03)


### Bug Fixes

* remove thumbnail height from thumbnail service call ([#421](https://github.com/kaltura/kaltura-player-js/issues/421)) ([9611685](https://github.com/kaltura/kaltura-player-js/commit/9611685))
* **FEC-11037:** multiple decorator exist after destroy plugin with decorator ([#418](https://github.com/kaltura/kaltura-player-js/issues/418)) ([9e9685c](https://github.com/kaltura/kaltura-player-js/commit/9e9685c))
* **FEC-11041:** player fails in IE11 ([#419](https://github.com/kaltura/kaltura-player-js/issues/419)) ([3f16f12](https://github.com/kaltura/kaltura-player-js/commit/3f16f12))



### [1.5.3](https://github.com/kaltura/kaltura-player-js/compare/v1.5.2...v1.5.3) (2021-03-02)


### Bug Fixes

* **FEC-11037:** multiple decorator exist after destroy plugin with decorator ([#418](https://github.com/kaltura/kaltura-player-js/issues/418)) ([9e9685c](https://github.com/kaltura/kaltura-player-js/commit/9e9685c))


### [1.5.2](https://github.com/kaltura/kaltura-player-js/compare/v1.5.0...v1.5.2) (2021-02-28)


### Bug Fixes

* **FEC-11041:** player fails in IE11 ([#419](https://github.com/kaltura/kaltura-player-js/issues/419)) ([52f9bc1](https://github.com/kaltura/kaltura-player-js/commit/52f9bc1))



## [1.5.0](https://github.com/kaltura/kaltura-player-js/compare/v1.4.0...v1.5.0) (2021-02-24)


### Bug Fixes

* **FEC-10872:** loadMedia returns the provider response instead of the updated one ([#405](https://github.com/kaltura/kaltura-player-js/issues/405)) ([d26013d](https://github.com/kaltura/kaltura-player-js/commit/d26013d))
* **FEC-10968:** OTT doesn't have default external-stream-redirect-helper ([#416](https://github.com/kaltura/kaltura-player-js/issues/416)) ([f13a81d](https://github.com/kaltura/kaltura-player-js/commit/f13a81d))
* **FEC-10995:** update Shaka to 3.0.8 ([#411](https://github.com/kaltura/kaltura-player-js/issues/411)) ([e40bc1e](https://github.com/kaltura/kaltura-player-js/commit/e40bc1e))


### Features

* **FEC-10041:** playAdsWithMSE with DAI detach the playback and ad ([#408](https://github.com/kaltura/kaltura-player-js/issues/408)) ([d7b5e09](https://github.com/kaltura/kaltura-player-js/commit/d7b5e09))
* **FEC-10640:** add api to get the playlist current working item index ([#413](https://github.com/kaltura/kaltura-player-js/issues/413)) ([7e59c37](https://github.com/kaltura/kaltura-player-js/commit/7e59c37))
* **FEC-10768:** expose in-stream DASH thumbnails ([#415](https://github.com/kaltura/kaltura-player-js/issues/415)) ([9581fa1](https://github.com/kaltura/kaltura-player-js/commit/9581fa1))
* **FEC-10961:** show the thumbnail preview in live ([#407](https://github.com/kaltura/kaltura-player-js/issues/407)) ([c1ac3fe](https://github.com/kaltura/kaltura-player-js/commit/c1ac3fe))
* **FEC-10970:** expose vpaid field on ad object ([#410](https://github.com/kaltura/kaltura-player-js/issues/410)) ([2db9ce8](https://github.com/kaltura/kaltura-player-js/commit/2db9ce8))
* **FEC-11013:** upgrade to hlsjs latest (0.14.17) ([#414](https://github.com/kaltura/kaltura-player-js/issues/414)) ([863b18d](https://github.com/kaltura/kaltura-player-js/commit/863b18d))



## [1.4.0](https://github.com/kaltura/kaltura-player-js/compare/v1.3.0...v1.4.0) (2021-01-28)


### Bug Fixes

* **ads-controller:** sources.startTime isn't always exists and can change from source to source ([#399](https://github.com/kaltura/kaltura-player-js/issues/399)) ([3965295](https://github.com/kaltura/kaltura-player-js/commit/3965295))
* **FEC-10687:** Allow partial config in setMedia API ([#394](https://github.com/kaltura/kaltura-player-js/issues/394)) ([aab1eab](https://github.com/kaltura/kaltura-player-js/commit/aab1eab))
* **FEC-10945:** ad / bumper isn't paused with autoPause ([#404](https://github.com/kaltura/kaltura-player-js/issues/404)) ([6495047](https://github.com/kaltura/kaltura-player-js/commit/6495047))
* update Shaka to fix the memory leak ([#396](https://github.com/kaltura/kaltura-player-js/issues/396)) ([f6cc4dd](https://github.com/kaltura/kaltura-player-js/commit/f6cc4dd))


### Features

* **FEC-10686:** move startTime config from playback to sources ([#398](https://github.com/kaltura/kaltura-player-js/issues/398)) ([bf909e0](https://github.com/kaltura/kaltura-player-js/commit/bf909e0))
* **FEC-10709, FEC-10712:** player visibility - Auto-pause when player is out of view, Autoplay only when player is in view ([#395](https://github.com/kaltura/kaltura-player-js/issues/395)) ([d1d3feb](https://github.com/kaltura/kaltura-player-js/commit/d1d3feb))



## [1.3.0](https://github.com/kaltura/kaltura-player-js/compare/v1.2.0...v1.3.0) (2021-01-07)


### Bug Fixes

* **FEC-10680:** back-end bumper: the app should decide what bumper will be displayed when also set user bumper ([#392](https://github.com/kaltura/kaltura-player-js/issues/392)) ([a062427](https://github.com/kaltura/kaltura-player-js/commit/a062427))
* **FEC-10729:** forceRedirectExternalStreams is reset in playlist ([#381](https://github.com/kaltura/kaltura-player-js/issues/381)) ([77e86ec](https://github.com/kaltura/kaltura-player-js/commit/77e86ec)), closes [#370](https://github.com/kaltura/kaltura-player-js/issues/370)
* **FEC-10732, FEC-10759:** player params are not injected to additional instances config ([#385](https://github.com/kaltura/kaltura-player-js/issues/385)) ([8c5a6c7](https://github.com/kaltura/kaltura-player-js/commit/8c5a6c7))
* **FEC-10776:** set the plugins event registration after kaltura player internal events ([#383](https://github.com/kaltura/kaltura-player-js/issues/383)) ([4233d9f](https://github.com/kaltura/kaltura-player-js/commit/4233d9f))
* **FEC-10797:** back-end bumper config is left from previous media played ([#393](https://github.com/kaltura/kaltura-player-js/issues/393)) ([f3905e7](https://github.com/kaltura/kaltura-player-js/commit/f3905e7))
* **FEC-10806:** playlist has limitation which configure cause setMedia ([#390](https://github.com/kaltura/kaltura-player-js/issues/390)) ([c5caeda](https://github.com/kaltura/kaltura-player-js/commit/c5caeda))


### Build System

* remove webpack warnings ([#384](https://github.com/kaltura/kaltura-player-js/issues/384)) ([8926752](https://github.com/kaltura/kaltura-player-js/commit/8926752))


### Features

* **FEC-10015:** support smart scrubber preview and timeline marker ([#359](https://github.com/kaltura/kaltura-player-js/issues/359)) ([ed9606a](https://github.com/kaltura/kaltura-player-js/commit/ed9606a))
* **FEC-10766:** create text config section and option for styling ([#387](https://github.com/kaltura/kaltura-player-js/issues/387)) ([dac194d](https://github.com/kaltura/kaltura-player-js/commit/dac194d))


### Tests

* fix tests ([#391](https://github.com/kaltura/kaltura-player-js/issues/391)) ([4731ea1](https://github.com/kaltura/kaltura-player-js/commit/4731ea1))



### [1.2.1](https://github.com/kaltura/kaltura-player-js/compare/v1.2.0...v1.2.1) (2020-12-10)



## [1.2.0](https://github.com/kaltura/kaltura-player-js/compare/v1.0.5...v1.2.0) (2020-12-07)


### Bug Fixes

* **FEC-10324:** class instances merged like simple object ([#368](https://github.com/kaltura/kaltura-player-js/issues/368)) ([4968c5f](https://github.com/kaltura/kaltura-player-js/commit/4968c5f))
* **FEC-10694:** Ima post roll overrides the post bumper ([#378](https://github.com/kaltura/kaltura-player-js/issues/378)) ([e350cbe](https://github.com/kaltura/kaltura-player-js/commit/e350cbe))
* **FEC-10749:** playlist by sources stuck ([#386](https://github.com/kaltura/kaltura-player-js/issues/386)) ([a747f70](https://github.com/kaltura/kaltura-player-js/commit/a747f70)), closes [#370](https://github.com/kaltura/kaltura-player-js/issues/370) [/github.com/kaltura/kaltura-player-js/pull/370/files#diff-b20fda8cac0288af75e0f3c4304df5420584de585d923934f9606e3634d2dbf5L302](https://github.com/kaltura/kaltura-player-js/issues/diff-b20fda8cac0288af75e0f3c4304df5420584de585d923934f9606e3634d2dbf5L302)


### Features

* **FEC-10233:** plugin async loading support ([#372](https://github.com/kaltura/kaltura-player-js/issues/372)) ([716e8c0](https://github.com/kaltura/kaltura-player-js/commit/716e8c0))
* **FEC-10632:** handle player dimensions dynamically  ([#373](https://github.com/kaltura/kaltura-player-js/issues/373)) ([c0bf2e1](https://github.com/kaltura/kaltura-player-js/commit/c0bf2e1))
* **FEC-10656:** set forceRedirectExternalStreams as true by default on IE11 and Chromecast ([#370](https://github.com/kaltura/kaltura-player-js/issues/370)) ([51d8a4a](https://github.com/kaltura/kaltura-player-js/commit/51d8a4a))
* **FEC-10669:** add ability to pass options to loadMedia request ([#374](https://github.com/kaltura/kaltura-player-js/issues/374)) ([1db395a](https://github.com/kaltura/kaltura-player-js/commit/1db395a))
* **FEC-10684:** reset player automatically inside setMedia ([#376](https://github.com/kaltura/kaltura-player-js/issues/376)) ([63f698d](https://github.com/kaltura/kaltura-player-js/commit/63f698d))
* update playkit-js-* versions ([318d87a](https://github.com/kaltura/kaltura-player-js/commit/318d87a))



## [1.1.0](https://github.com/kaltura/kaltura-player-js/compare/v1.0.5...v1.1.0) (2020-11-22)


### [1.0.5](https://github.com/kaltura/kaltura-player-js/compare/v1.0.4...v1.0.5) (2020-11-04)



### [1.0.4](https://github.com/kaltura/kaltura-player-js/compare/v1.0.3...v1.0.4) (2020-11-03)


### Bug Fixes

* **FEC-10469:** pre-roll Ad for playlist displays for each second media instead of for each one ([#367](https://github.com/kaltura/kaltura-player-js/issues/367)) ([c3a52cd](https://github.com/kaltura/kaltura-player-js/commit/c3a52cd))


### Build System

* remove plugins that already exist on preset-env ([#366](https://github.com/kaltura/kaltura-player-js/issues/366)) ([9ac3fd6](https://github.com/kaltura/kaltura-player-js/commit/9ac3fd6))



### [1.0.3](https://github.com/kaltura/kaltura-player-js/compare/v1.0.2...v1.0.3) (2020-10-14)


### Bug Fixes

* DRM doesn't play on edge chromium ([#364](https://github.com/kaltura/kaltura-player-js/issues/364)) ([cc4cce4](https://github.com/kaltura/kaltura-player-js/commit/cc4cce4))



### [1.0.2](https://github.com/kaltura/kaltura-player-js/compare/v1.0.1...v1.0.2) (2020-10-06)


### Tests

* textStyle from kaltura player has get method which doesn't exist on textStyle object ([#363](https://github.com/kaltura/kaltura-player-js/issues/363)) ([d463067](https://github.com/kaltura/kaltura-player-js/commit/d463067))



### [1.0.1](https://github.com/kaltura/kaltura-player-js/compare/v1.0.0...v1.0.1) (2020-10-06)


### Bug Fixes

* incorrect order in import dependencies break IE11 ([#362](https://github.com/kaltura/kaltura-player-js/issues/362)) ([6da6518](https://github.com/kaltura/kaltura-player-js/commit/6da6518))
* **FEC-10524:** get logger from playkit and set to ui and provider ([#360](https://github.com/kaltura/kaltura-player-js/issues/360)) ([7387569](https://github.com/kaltura/kaltura-player-js/commit/7387569))


### Build System

* upgrade provider version to master on canary version ([#361](https://github.com/kaltura/kaltura-player-js/issues/361)) ([88435a5](https://github.com/kaltura/kaltura-player-js/commit/88435a5))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/kaltura/kaltura-player-js/compare/v0.57.0...v1.0.0) (2020-09-08)


### Features

* **FEC-10347:** expose kaltura player as a global variable instead of UMD ([#350](https://github.com/kaltura/kaltura-player-js/issues/350)) ([b6253ff](https://github.com/kaltura/kaltura-player-js/commit/b6253ff))


### BREAKING CHANGES

* **FEC-10347:** kaltura-player is not UMD anymore



## [0.57.0](https://github.com/kaltura/kaltura-player-js/compare/v0.56.1...v0.57.0) (2020-09-08)


### Bug Fixes

* **FEC-10161:** add kava analytics url from server response ([#355](https://github.com/kaltura/kaltura-player-js/issues/355)) ([e4ce3f1](https://github.com/kaltura/kaltura-player-js/commit/e4ce3f1))
* **FEC-10275:** Bumper incorrectly recognised as ad ([#352](https://github.com/kaltura/kaltura-player-js/issues/352)) ([716d01a](https://github.com/kaltura/kaltura-player-js/commit/716d01a))
* **FEC-10417:** playlist by sources stuck after press Play button when set IMA or bumper plugins ([#349](https://github.com/kaltura/kaltura-player-js/issues/349)) ([b2256f3](https://github.com/kaltura/kaltura-player-js/commit/b2256f3))
* **FEC-10455:** incorrect order in reset and destroy process ([#353](https://github.com/kaltura/kaltura-player-js/issues/353)) ([fc9bf96](https://github.com/kaltura/kaltura-player-js/commit/fc9bf96))
* **FEC-10468:** PLAYBACK_START not fired on autoplay ([#356](https://github.com/kaltura/kaltura-player-js/issues/356)) ([78c3ed5](https://github.com/kaltura/kaltura-player-js/commit/78c3ed5))


### Build System

* **FEC-10064:** add automatic release notes ([#357](https://github.com/kaltura/kaltura-player-js/issues/357)) ([b0b6988](https://github.com/kaltura/kaltura-player-js/commit/b0b6988))


### Features

* **FEC-10076:** add support for dynamic injection ([#351](https://github.com/kaltura/kaltura-player-js/issues/351)) ([b9e9a31](https://github.com/kaltura/kaltura-player-js/commit/b9e9a31))
* **FEC-10296:** upgrade hls.js to 0.14.9 ([#348](https://github.com/kaltura/kaltura-player-js/issues/348)) ([2d0ec6e](https://github.com/kaltura/kaltura-player-js/commit/2d0ec6e))
* **FEC-10435:** upgrade shaka for fixing live issue and optimizations for smartTV ([#354](https://github.com/kaltura/kaltura-player-js/issues/354)) ([90ce625](https://github.com/kaltura/kaltura-player-js/commit/90ce625))



### [0.56.1](https://github.com/kaltura/kaltura-player-js/compare/v0.56.0...v0.56.1) (2020-08-10)


### Bug Fixes

* **FEC-10404:** media doesn't work properly on Safari browser - no video displayed - Regression bug ([#347](https://github.com/kaltura/kaltura-player-js/issues/347)) ([7456bee](https://github.com/kaltura/kaltura-player-js/commit/7456bee))



## [0.56.0](https://github.com/kaltura/kaltura-player-js/compare/v0.55.0...v0.56.0) (2020-08-05)


### Bug Fixes

* downgrade shaka from 3.0.x ([#346](https://github.com/kaltura/kaltura-player-js/issues/346)) ([f126796](https://github.com/kaltura/kaltura-player-js/commit/f126796))
* old browser(IE11) get mehtod in proxy doesn't work ([#345](https://github.com/kaltura/kaltura-player-js/issues/345)) ([4d3f69c](https://github.com/kaltura/kaltura-player-js/commit/4d3f69c))
* **FEC-10356:** 4K DASH HEVC + LIVE doesn't play correctly on LG ([#342](https://github.com/kaltura/kaltura-player-js/issues/342)) ([111cdac](https://github.com/kaltura/kaltura-player-js/commit/111cdac))


### Features

* **FEC-10057:** move the plugin manager to kaltura player ([#332](https://github.com/kaltura/kaltura-player-js/issues/332)) ([66b2f3d](https://github.com/kaltura/kaltura-player-js/commit/66b2f3d))
* **FEC-10290:** upgrade NPM packages ([#335](https://github.com/kaltura/kaltura-player-js/issues/335)) ([07fa73b](https://github.com/kaltura/kaltura-player-js/commit/07fa73b))
* **FEC-10291:** migrate analytics plugins injection from kaltura player to server ([#337](https://github.com/kaltura/kaltura-player-js/issues/337)) ([1caf168](https://github.com/kaltura/kaltura-player-js/commit/1caf168))



<a name="0.55.1"></a>
## [0.55.1](https://github.com/kaltura/kaltura-player-js/compare/v0.55.0...v0.55.1) (2020-07-27)



<a name="0.55.0"></a>
# [0.55.0](https://github.com/kaltura/kaltura-player-js/compare/v0.54.0...v0.55.0) (2020-07-07)


### Bug Fixes

* **FEC-10122:** destroy cleanup process ([#326](https://github.com/kaltura/kaltura-player-js/issues/326)) ([5fbe11b](https://github.com/kaltura/kaltura-player-js/commit/5fbe11b))
* update shaka version for TTML container fix ([#327](https://github.com/kaltura/kaltura-player-js/issues/327)) ([a270df1](https://github.com/kaltura/kaltura-player-js/commit/a270df1))


### Features

* **FEC-9649:** loading external CSS ([#329](https://github.com/kaltura/kaltura-player-js/issues/329)) ([0f74daf](https://github.com/kaltura/kaltura-player-js/commit/0f74daf))



<a name="0.54.0"></a>
# [0.54.0](https://github.com/kaltura/kaltura-player-js/compare/v0.53.7...v0.54.0) (2020-06-10)


### Bug Fixes

* **FEC-10053:** Subtitle issue for Player with TTML in MP4 container ([#316](https://github.com/kaltura/kaltura-player-js/issues/316)) ([c053ac2](https://github.com/kaltura/kaltura-player-js/commit/c053ac2))
* **FEC-10155:** text track language is incorrect on cast disconnecting ([#318](https://github.com/kaltura/kaltura-player-js/issues/318)) ([75690a3](https://github.com/kaltura/kaltura-player-js/commit/75690a3)), closes [#188](https://github.com/kaltura/kaltura-player-js/issues/188)


### Features

* **FEC-9631:** add support for out of band text tracks on cast sdk ([#319](https://github.com/kaltura/kaltura-player-js/issues/319)) ([16562b6](https://github.com/kaltura/kaltura-player-js/commit/16562b6))



<a name="0.53.7"></a>
## [0.53.7](https://github.com/kaltura/kaltura-player-js/compare/v0.53.6...v0.53.7) (2020-05-11)



<a name="0.53.6"></a>
## [0.53.6](https://github.com/kaltura/kaltura-player-js/compare/v0.53.5...v0.53.6) (2020-05-10)


### Bug Fixes

* **FEC-9495:** travis ping to jenkins for deployment ([#294](https://github.com/kaltura/kaltura-player-js/issues/294)) ([871b096](https://github.com/kaltura/kaltura-player-js/commit/871b096))



<a name="0.53.5"></a>
## [0.53.5](https://github.com/kaltura/kaltura-player-js/compare/v0.53.3...v0.53.5) (2020-05-03)



<a name="0.53.4"></a>
## [0.53.4](https://github.com/kaltura/kaltura-player-js/compare/v0.53.3...v0.53.4) (2020-04-13)



<a name="0.53.3"></a>
## [0.53.3](https://github.com/kaltura/kaltura-player-js/compare/v0.53.2...v0.53.3) (2020-03-12)


### Bug Fixes

* **FEC-9734:** auto play doesn't works, if "playsinline"=false on all platforms ([#307](https://github.com/kaltura/kaltura-player-js/issues/307)) ([3c562fd](https://github.com/kaltura/kaltura-player-js/commit/3c562fd))



<a name="0.53.2"></a>
## [0.53.2](https://github.com/kaltura/kaltura-player-js/compare/v0.53.1...v0.53.2) (2020-03-10)


### Bug Fixes

* remove french (fr) translation file ([5529611](https://github.com/kaltura/kaltura-player-js/commit/5529611))



<a name="0.53.1"></a>
## [0.53.1](https://github.com/kaltura/kaltura-player-js/compare/v0.53.0...v0.53.1) (2020-03-10)



<a name="0.53.0"></a>
# [0.53.0](https://github.com/kaltura/kaltura-player-js/compare/v0.52.1...v0.53.0) (2020-03-01)


### Features

* **FEC-9109:** add DRM Load time metric ([#305](https://github.com/kaltura/kaltura-player-js/issues/305)) ([e0b267e](https://github.com/kaltura/kaltura-player-js/commit/e0b267e))



<a name="0.52.1"></a>
## [0.52.1](https://github.com/kaltura/kaltura-player-js/compare/v0.52.0...v0.52.1) (2020-02-24)



<a name="0.52.0"></a>
# [0.52.0](https://github.com/kaltura/kaltura-player-js/compare/v0.51.3...v0.52.0) (2020-02-16)


### Features

* **FEC-9465:** internationalization (i18n) - player localization ([#304](https://github.com/kaltura/kaltura-player-js/issues/304)) ([6b33757](https://github.com/kaltura/kaltura-player-js/commit/6b33757))



<a name="0.51.3"></a>
## [0.51.3](https://github.com/kaltura/kaltura-player-js/compare/v0.51.2...v0.51.3) (2020-02-03)



<a name="0.51.2"></a>
## [0.51.2](https://github.com/kaltura/kaltura-player-js/compare/v0.51.1...v0.51.2) (2020-01-30)


### Bug Fixes

* **FEC-9629:** Player is not inline when rendered after the DOM loads ([#302](https://github.com/kaltura/kaltura-player-js/issues/302)) ([cdd85d0](https://github.com/kaltura/kaltura-player-js/commit/cdd85d0))



<a name="0.51.1"></a>
## [0.51.1](https://github.com/kaltura/kaltura-player-js/compare/v0.51.0...v0.51.1) (2020-01-30)



<a name="0.51.0"></a>
# [0.51.0](https://github.com/kaltura/kaltura-player-js/compare/v0.50.9...v0.51.0) (2020-01-29)


### Bug Fixes

* **FEC-9489:** IE11 proxy issue in get set ([#295](https://github.com/kaltura/kaltura-player-js/issues/295)) ([d95ef8c](https://github.com/kaltura/kaltura-player-js/commit/d95ef8c))
* **FEC-9577:** Hisense playback doesn't work ([#298](https://github.com/kaltura/kaltura-player-js/issues/298)) ([f6da3ca](https://github.com/kaltura/kaltura-player-js/commit/f6da3ca))
* **FEC-9632:** edge play playready on mac os when it's not supported ([#301](https://github.com/kaltura/kaltura-player-js/issues/301)) ([efb4665](https://github.com/kaltura/kaltura-player-js/commit/efb4665))


### Features

* **FEC-8998:** add url encoded for referrer token ([#299](https://github.com/kaltura/kaltura-player-js/issues/299)) ([b540625](https://github.com/kaltura/kaltura-player-js/commit/b540625))
* **FEC-9545:** add ability to correlate udrm calls to player type and session ([#297](https://github.com/kaltura/kaltura-player-js/issues/297)) ([c7f7748](https://github.com/kaltura/kaltura-player-js/commit/c7f7748))



<a name="0.50.9"></a>
## [0.50.9](https://github.com/kaltura/kaltura-player-js/compare/v0.50.8...v0.50.9) (2020-01-09)



<a name="0.50.8"></a>
## [0.50.8](https://github.com/kaltura/kaltura-player-js/compare/v0.50.7...v0.50.8) (2020-01-08)



<a name="0.50.7"></a>
## [0.50.7](https://github.com/kaltura/kaltura-player-js/compare/v0.50.6...v0.50.7) (2020-01-07)



<a name="0.50.6"></a>
## [0.50.6](https://github.com/kaltura/kaltura-player-js/compare/v0.50.5...v0.50.6) (2020-01-06)



<a name="0.50.5"></a>
## [0.50.5](https://github.com/kaltura/kaltura-player-js/compare/v0.50.4...v0.50.5) (2020-01-05)



<a name="0.50.4"></a>
## [0.50.4](https://github.com/kaltura/kaltura-player-js/compare/v0.50.3...v0.50.4) (2020-01-02)



<a name="0.50.3"></a>
## [0.50.3](https://github.com/kaltura/kaltura-player-js/compare/v0.50.2...v0.50.3) (2019-12-31)


### Bug Fixes

* **FEC-9366:** setMedia doesn't get custom poster as string ([#292](https://github.com/kaltura/kaltura-player-js/issues/292)) ([cc9c663](https://github.com/kaltura/kaltura-player-js/commit/cc9c663))



<a name="0.50.2"></a>
## [0.50.2](https://github.com/kaltura/kaltura-player-js/compare/v0.50.1...v0.50.2) (2019-12-29)



<a name="0.50.1"></a>
## [0.50.1](https://github.com/kaltura/kaltura-player-js/compare/v0.50.0...v0.50.1) (2019-12-11)



<a name="0.50.0"></a>
# [0.50.0](https://github.com/kaltura/kaltura-player-js/compare/v0.49.1...v0.50.0) (2019-12-08)


### Bug Fixes

* **FEC-9471:** slider progress bar exceeds 100% ([#287](https://github.com/kaltura/kaltura-player-js/issues/287)) ([a617eae](https://github.com/kaltura/kaltura-player-js/commit/a617eae))


### Features

* **FEC-9175:** cast content coming from external sources ([#288](https://github.com/kaltura/kaltura-player-js/issues/288)) ([43a46b2](https://github.com/kaltura/kaltura-player-js/commit/43a46b2))



<a name="0.49.1"></a>
## [0.49.1](https://github.com/kaltura/kaltura-player-js/compare/v0.49.0...v0.49.1) (2019-12-01)



<a name="0.49.0"></a>
# [0.49.0](https://github.com/kaltura/kaltura-player-js/compare/v0.48.0...v0.49.0) (2019-11-12)


### Bug Fixes

* config keySystem isn't boolean ([#283](https://github.com/kaltura/kaltura-player-js/issues/283)) ([4280dc5](https://github.com/kaltura/kaltura-player-js/commit/4280dc5))


### Features

* new hasUserInteracted api ([#284](https://github.com/kaltura/kaltura-player-js/issues/284)) ([6855309](https://github.com/kaltura/kaltura-player-js/commit/6855309))



<a name="0.48.0"></a>
# [0.48.0](https://github.com/kaltura/kaltura-player-js/compare/v0.47.8...v0.48.0) (2019-11-03)


### Bug Fixes

* **FEC-9307:** live issue on LG SDK2 with hls.js ([#273](https://github.com/kaltura/kaltura-player-js/issues/273)) ([1ca1b5d](https://github.com/kaltura/kaltura-player-js/commit/1ca1b5d))
* **FEC-9379:** Edge chromium should use playready when exist ([#274](https://github.com/kaltura/kaltura-player-js/issues/274)) ([6b87274](https://github.com/kaltura/kaltura-player-js/commit/6b87274))


### Features

* **FEC-9326:** report productVersion ([#275](https://github.com/kaltura/kaltura-player-js/issues/275)) ([304f9ca](https://github.com/kaltura/kaltura-player-js/commit/304f9ca))



<a name="0.47.8"></a>
## [0.47.8](https://github.com/kaltura/kaltura-player-js/compare/v0.47.2...v0.47.8) (2019-10-10)


### Bug Fixes

* **FEC-9389:** media playing unmuted after unmute fallback ([#272](https://github.com/kaltura/kaltura-player-js/issues/272)) ([dafa0d6](https://github.com/kaltura/kaltura-player-js/commit/dafa0d6))



<a name="0.47.7"></a>
## [0.47.7](https://github.com/kaltura/kaltura-player-js/compare/v0.47.6...v0.47.7) (2019-10-07)



<a name="0.47.6"></a>
## [0.47.6](https://github.com/kaltura/kaltura-player-js/compare/v0.47.5...v0.47.6) (2019-10-03)


### Bug Fixes

* **FEC-9389:** media playing unmuted after unmute fallback ([#272](https://github.com/kaltura/kaltura-player-js/issues/272)) ([dafa0d6](https://github.com/kaltura/kaltura-player-js/commit/dafa0d6))



<a name="0.47.5"></a>
## [0.47.5](https://github.com/kaltura/kaltura-player-js/compare/v0.47.4...v0.47.5) (2019-10-03)



<a name="0.47.4"></a>
## [0.47.4](https://github.com/kaltura/kaltura-player-js/compare/v0.47.3...v0.47.4) (2019-10-02)



<a name="0.47.3"></a>
## [0.47.3](https://github.com/kaltura/kaltura-player-js/compare/v0.47.2...v0.47.3) (2019-09-26)



<a name="0.47.2"></a>
## [0.47.2](https://github.com/kaltura/kaltura-player-js/compare/v0.47.1...v0.47.2) (2019-09-26)



<a name="0.47.1"></a>
## [0.47.1](https://github.com/kaltura/kaltura-player-js/compare/v0.47.0...v0.47.1) (2019-09-25)



<a name="0.47.0"></a>
# [0.47.0](https://github.com/kaltura/kaltura-player-js/compare/v0.46.0...v0.47.0) (2019-09-18)


### Features

* **FEC-8696:** allow adding/changing discrete components in U ([#264](https://github.com/kaltura/kaltura-player-js/issues/264)) ([880762e](https://github.com/kaltura/kaltura-player-js/commit/880762e))



<a name="0.46.0"></a>
# [0.46.0](https://github.com/kaltura/kaltura-player-js/compare/v0.45.8...v0.46.0) (2019-09-15)


### Features

* **FEC-9314:** update Shaka version ([#268](https://github.com/kaltura/kaltura-player-js/issues/268)) ([0739090](https://github.com/kaltura/kaltura-player-js/commit/0739090))



<a name="0.45.8"></a>
## [0.45.8](https://github.com/kaltura/kaltura-player-js/compare/v0.45.7...v0.45.8) (2019-08-28)


### Bug Fixes

* **FEC-9137:** Samsung smart tv doesn't success playing playready  ([#267](https://github.com/kaltura/kaltura-player-js/issues/267)) ([c14a319](https://github.com/kaltura/kaltura-player-js/commit/c14a319))



<a name="0.45.7"></a>
## [0.45.7](https://github.com/kaltura/kaltura-player-js/compare/v0.45.4...v0.45.7) (2019-08-26)



<a name="0.45.6"></a>
## [0.45.6](https://github.com/kaltura/kaltura-player-js/compare/v0.45.5...v0.45.6) (2019-08-19)



<a name="0.45.5"></a>
## [0.45.5](https://github.com/kaltura/kaltura-player-js/compare/v0.45.4...v0.45.5) (2019-08-04)



<a name="0.45.4"></a>
## [0.45.4](https://github.com/kaltura/kaltura-player-js/compare/v0.45.3...v0.45.4) (2019-08-01)


### Bug Fixes

* **FEC-9273:** playing preroll on AV player (ios+playsinline=false) gets the player stuck ([#262](https://github.com/kaltura/kaltura-player-js/issues/262)) ([fb238b4](https://github.com/kaltura/kaltura-player-js/commit/fb238b4))



<a name="0.45.3"></a>
## [0.45.3](https://github.com/kaltura/kaltura-player-js/compare/v0.45.2...v0.45.3) (2019-07-30)



<a name="0.45.2"></a>
## [0.45.2](https://github.com/kaltura/kaltura-player-js/compare/v0.45.1...v0.45.2) (2019-07-28)


### Bug Fixes

* useNativeTextTrack doesn't change to true by default on MacOS ([#258](https://github.com/kaltura/kaltura-player-js/issues/258)) ([f4ee047](https://github.com/kaltura/kaltura-player-js/commit/f4ee047))
* **FEC-9260:** Autoplay is not working on LG TV ([#260](https://github.com/kaltura/kaltura-player-js/issues/260)) ([ce838e0](https://github.com/kaltura/kaltura-player-js/commit/ce838e0))



<a name="0.45.1"></a>
## [0.45.1](https://github.com/kaltura/kaltura-player-js/compare/v0.45.0...v0.45.1) (2019-07-21)



<a name="0.45.0"></a>
# [0.45.0](https://github.com/kaltura/kaltura-player-js/compare/v0.44.0...v0.45.0) (2019-07-19)


### Features

* **FEC-9156:** getting bumper from playback context ([#252](https://github.com/kaltura/kaltura-player-js/issues/252)) ([dfe18ac](https://github.com/kaltura/kaltura-player-js/commit/dfe18ac))
* **FEC-9227:** support reInit of MSE ([#254](https://github.com/kaltura/kaltura-player-js/issues/254)) ([2b78cd7](https://github.com/kaltura/kaltura-player-js/commit/2b78cd7))



<a name="0.44.0"></a>
# [0.44.0](https://github.com/kaltura/kaltura-player-js/compare/v0.41.2...v0.44.0) (2019-07-07)


### Bug Fixes

* **FEC-8940:** cannot configure plugin by array ([#222](https://github.com/kaltura/kaltura-player-js/issues/222)) ([0237207](https://github.com/kaltura/kaltura-player-js/commit/0237207))
* **FEC-9087:** IMA DAI - the pre-roll Ad duration also calculated for start position - the playback started from 10th sec instead of 20th ([#240](https://github.com/kaltura/kaltura-player-js/issues/240)) ([6c4c73a](https://github.com/kaltura/kaltura-player-js/commit/6c4c73a))
* **FEC-9103:** Remove old kaltura stats ([#244](https://github.com/kaltura/kaltura-player-js/issues/244)) ([f7fa3ac](https://github.com/kaltura/kaltura-player-js/commit/f7fa3ac))
* bumper and ima-dai integration ([#245](https://github.com/kaltura/kaltura-player-js/issues/245)) ([27d7b4b](https://github.com/kaltura/kaltura-player-js/commit/27d7b4b))
* **FEC-9114:** live doesn't work properly with hls.js ([#246](https://github.com/kaltura/kaltura-player-js/issues/246)) ([f264a24](https://github.com/kaltura/kaltura-player-js/commit/f264a24))
* **FEC-9118:** External caption doesn't display ([#243](https://github.com/kaltura/kaltura-player-js/issues/243)) ([59368a3](https://github.com/kaltura/kaltura-player-js/commit/59368a3))
* **FEC-9177:** Smart TV showed as mobile device ([#242](https://github.com/kaltura/kaltura-player-js/issues/242)) ([6f17d2a](https://github.com/kaltura/kaltura-player-js/commit/6f17d2a))
* inBrowserFullscreen path ([#248](https://github.com/kaltura/kaltura-player-js/issues/248)) ([75054ea](https://github.com/kaltura/kaltura-player-js/commit/75054ea))


### Features

* **FEC-8631:** bumper plugin ([#224](https://github.com/kaltura/kaltura-player-js/issues/224)) ([627dc15](https://github.com/kaltura/kaltura-player-js/commit/627dc15))
* **FEC-8975:** QoS Data enhancement ([#241](https://github.com/kaltura/kaltura-player-js/issues/241)) ([8f3b492](https://github.com/kaltura/kaltura-player-js/commit/8f3b492))
* **FEC-9023:** more logger options ([#247](https://github.com/kaltura/kaltura-player-js/issues/247)) ([b2a57a7](https://github.com/kaltura/kaltura-player-js/commit/b2a57a7))
* **FEC-9024:** send beacon for non partner usage ([#249](https://github.com/kaltura/kaltura-player-js/issues/249)) ([d058e75](https://github.com/kaltura/kaltura-player-js/commit/d058e75))
* **FEC-9145:** support non sibling video tags ([#250](https://github.com/kaltura/kaltura-player-js/issues/250)) ([9c824b8](https://github.com/kaltura/kaltura-player-js/commit/9c824b8))



<a name="0.43.0"></a>
# [0.43.0](https://github.com/kaltura/kaltura-player-js/compare/v0.42.0...v0.43.0) (2019-06-23)


### Bug Fixes

* inBrowserFullscreen path ([#248](https://github.com/kaltura/kaltura-player-js/issues/248)) ([75054ea](https://github.com/kaltura/kaltura-player-js/commit/75054ea))


### Features

* **FEC-9023:** more logger options ([#247](https://github.com/kaltura/kaltura-player-js/issues/247)) ([b2a57a7](https://github.com/kaltura/kaltura-player-js/commit/b2a57a7))
* **FEC-9024:** send beacon for non partner usage ([#249](https://github.com/kaltura/kaltura-player-js/issues/249)) ([d058e75](https://github.com/kaltura/kaltura-player-js/commit/d058e75))



<a name="0.42.0"></a>
# [0.42.0](https://github.com/kaltura/kaltura-player-js/compare/v0.41.2...v0.42.0) (2019-06-17)


### Bug Fixes

* **FEC-8940:** cannot configure plugin by array ([#222](https://github.com/kaltura/kaltura-player-js/issues/222)) ([0237207](https://github.com/kaltura/kaltura-player-js/commit/0237207))
* **FEC-9087:** IMA DAI - the pre-roll Ad duration also calculated for start position - the playback started from 10th sec instead of 20th ([#240](https://github.com/kaltura/kaltura-player-js/issues/240)) ([6c4c73a](https://github.com/kaltura/kaltura-player-js/commit/6c4c73a))
* **FEC-9103:** Remove old kaltura stats ([#244](https://github.com/kaltura/kaltura-player-js/issues/244)) ([f7fa3ac](https://github.com/kaltura/kaltura-player-js/commit/f7fa3ac))
* bumper and ima-dai integration ([#245](https://github.com/kaltura/kaltura-player-js/issues/245)) ([27d7b4b](https://github.com/kaltura/kaltura-player-js/commit/27d7b4b))
* **FEC-9114:** live doesn't work properly with hls.js ([#246](https://github.com/kaltura/kaltura-player-js/issues/246)) ([f264a24](https://github.com/kaltura/kaltura-player-js/commit/f264a24))
* **FEC-9118:** External caption doesn't display ([#243](https://github.com/kaltura/kaltura-player-js/issues/243)) ([59368a3](https://github.com/kaltura/kaltura-player-js/commit/59368a3))
* **FEC-9177:** Smart TV showed as mobile device ([#242](https://github.com/kaltura/kaltura-player-js/issues/242)) ([6f17d2a](https://github.com/kaltura/kaltura-player-js/commit/6f17d2a))


### Features

* **FEC-8631:** bumper plugin ([#224](https://github.com/kaltura/kaltura-player-js/issues/224)) ([627dc15](https://github.com/kaltura/kaltura-player-js/commit/627dc15))
* **FEC-8975:** QoS Data enhancement ([#241](https://github.com/kaltura/kaltura-player-js/issues/241)) ([8f3b492](https://github.com/kaltura/kaltura-player-js/commit/8f3b492))



<a name="0.41.2"></a>
## [0.41.2](https://github.com/kaltura/kaltura-player-js/compare/v0.41.1...v0.41.2) (2019-05-16)


### Bug Fixes

* **FEC-9067:** playback error with ima on LG TV WebOS ([#239](https://github.com/kaltura/kaltura-player-js/issues/239)) ([99fee11](https://github.com/kaltura/kaltura-player-js/commit/99fee11))



<a name="0.41.1"></a>
## [0.41.1](https://github.com/kaltura/kaltura-player-js/compare/v0.41.0...v0.41.1) (2019-05-01)


### Bug Fixes

* **FEC-9052:** allow player to load from partner 0([#237](https://github.com/kaltura/kaltura-player-js/issues/237)) ([eca464a](https://github.com/kaltura/kaltura-player-js/commit/eca464a))



<a name="0.41.0"></a>
## [0.41.0](https://github.com/kaltura/kaltura-player-js/compare/v0.40.15...v0.41.0) (2019-04-15)



<a name="0.40.15"></a>
## [0.40.15](https://github.com/kaltura/kaltura-player-js/compare/v0.40.14...v0.40.15) (2019-04-14)



<a name="0.40.14"></a>
## [0.40.14](https://github.com/kaltura/kaltura-player-js/compare/v0.40.13...v0.40.14) (2019-04-10)


### Bug Fixes

* **FEC-9026:** [Player_V3][Flash] - When clicking fullscreen icon in flash, the player area stays in the same size ([8d64b78](https://github.com/kaltura/kaltura-player-js/commit/8d64b78))



<a name="0.40.13"></a>
## [0.40.13](https://github.com/kaltura/kaltura-player-js/compare/v0.40.12...v0.40.13) (2019-04-07)


### Bug Fixes

* **FEC-8826:** default element is video container instead main container ([#235](https://github.com/kaltura/kaltura-player-js/issues/235)) ([3b3caa3](https://github.com/kaltura/kaltura-player-js/commit/3b3caa3))
* **FEC-9002:** analytics aren't being sent ([#230](https://github.com/kaltura/kaltura-player-js/issues/230)) ([b2e8a86](https://github.com/kaltura/kaltura-player-js/commit/b2e8a86))
* **FEC-9013:** [iOS] - Player doesnt play ads native ([#234](https://github.com/kaltura/kaltura-player-js/issues/234)) ([60edaf6](https://github.com/kaltura/kaltura-player-js/commit/60edaf6))



<a name="0.40.12"></a>
## [0.40.12](https://github.com/kaltura/kaltura-player-js/compare/v0.40.11...v0.40.12) (2019-04-01)



<a name="0.40.11"></a>
## [0.40.11](https://github.com/kaltura/kaltura-player-js/compare/v0.40.10...v0.40.11) (2019-04-01)


### Bug Fixes

* **FEC-8826:** fullscreen implementation moved to core ([#227](https://github.com/kaltura/kaltura-player-js/issues/227)) ([faa5fd7](https://github.com/kaltura/kaltura-player-js/commit/faa5fd7))
* **FEC-8981:** playlist doesn't send ott analytics ([#226](https://github.com/kaltura/kaltura-player-js/issues/226)) ([afb0cf2](https://github.com/kaltura/kaltura-player-js/commit/afb0cf2))



<a name="0.40.10"></a>
## [0.40.10](https://github.com/kaltura/kaltura-player-js/compare/v0.40.9...v0.40.10) (2019-03-17)



<a name="0.40.9"></a>
## [0.40.9](https://github.com/kaltura/kaltura-player-js/compare/v0.40.8...v0.40.9) (2019-03-14)



<a name="0.40.8"></a>
## [0.40.8](https://github.com/kaltura/kaltura-player-js/compare/v0.40.7...v0.40.8) (2019-03-11)



<a name="0.40.7"></a>
## [0.40.7](https://github.com/kaltura/kaltura-player-js/compare/v0.40.6...v0.40.7) (2019-03-11)


### Bug Fixes

* **FEC-8973:** safari desktop plays using hlsjs instead of natively ([#225](https://github.com/kaltura/kaltura-player-js/issues/225)) ([696c959](https://github.com/kaltura/kaltura-player-js/commit/696c959))



<a name="0.40.6"></a>
## [0.40.6](https://github.com/kaltura/kaltura-player-js/compare/v0.40.5...v0.40.6) (2019-03-10)



<a name="0.40.5"></a>
## [0.40.5](https://github.com/kaltura/kaltura-player-js/compare/v0.40.4...v0.40.5) (2019-03-07)



<a name="0.40.4"></a>
## [0.40.4](https://github.com/kaltura/kaltura-player-js/compare/v0.40.3...v0.40.4) (2019-03-07)



<a name="0.40.3"></a>
## [0.40.3](https://github.com/kaltura/kaltura-player-js/compare/v0.40.2...v0.40.3) (2019-03-06)



<a name="0.40.2"></a>
## [0.40.2](https://github.com/kaltura/kaltura-player-js/compare/v0.40.1...v0.40.2) (2019-02-27)



<a name="0.40.1"></a>
## [0.40.1](https://github.com/kaltura/kaltura-player-js/compare/v0.40.0...v0.40.1) (2019-02-27)


### Bug Fixes

* **FEC-8901:** duplication of ClosedCaptions on iOS on none Safari browser ([#221](https://github.com/kaltura/kaltura-player-js/issues/221)) ([7dbc175](https://github.com/kaltura/kaltura-player-js/commit/7dbc175))
* **FEC-8927:** player crash on Echo show browser ([#223](https://github.com/kaltura/kaltura-player-js/issues/223)) ([f16fea0](https://github.com/kaltura/kaltura-player-js/commit/f16fea0))



<a name="0.40.0"></a>
# [0.40.0](https://github.com/kaltura/kaltura-player-js/compare/v0.39.4...v0.40.0) (2019-02-20)


### Features

* **FEC-8769:** do not allow to create two players with the same target id ([#218](https://github.com/kaltura/kaltura-player-js/issues/218)) ([bac574f](https://github.com/kaltura/kaltura-player-js/commit/bac574f))



<a name="0.39.4"></a>
## [0.39.4](https://github.com/kaltura/kaltura-player-js/compare/v0.39.3...v0.39.4) (2019-02-05)



<a name="0.39.3"></a>
## [0.39.3](https://github.com/kaltura/kaltura-player-js/compare/v0.39.2...v0.39.3) (2019-02-05)



<a name="0.39.2"></a>
## [0.39.2](https://github.com/kaltura/kaltura-player-js/compare/v0.39.0...v0.39.2) (2019-02-04)


### Bug Fixes

* **FEC-8871:** playlist - strange behavior when playback.loop is true ([#217](https://github.com/kaltura/kaltura-player-js/issues/217)) ([c619386](https://github.com/kaltura/kaltura-player-js/commit/c619386))



<a name="0.39.1"></a>
## [0.39.1](https://github.com/kaltura/kaltura-player-js/compare/v0.39.0...v0.39.1) (2019-01-31)


### Bug Fixes

* **FEC-8871:** playlist - strange behavior when playback.loop is true ([#217](https://github.com/kaltura/kaltura-player-js/issues/217)) ([c619386](https://github.com/kaltura/kaltura-player-js/commit/c619386))



<a name="0.39.0"></a>
# [0.39.0](https://github.com/kaltura/kaltura-player-js/compare/v0.38.1...v0.39.0) (2019-01-24)


### Bug Fixes

* **FEC-8298:** SOURCE_SELECTED event triggered before the UI ready when the source provided manually ([#129](https://github.com/kaltura/kaltura-player-js/issues/129)) ([44e8fb5](https://github.com/kaltura/kaltura-player-js/commit/44e8fb5))
* **FEC-8688:** When pausing video in cast and then disconnect the player display first play poster and not video stream with paused point ([#200](https://github.com/kaltura/kaltura-player-js/issues/200)) ([6c8376a](https://github.com/kaltura/kaltura-player-js/commit/6c8376a))
* **FEC-8834:** remove scrubber preview if entry is youtube ([#206](https://github.com/kaltura/kaltura-player-js/issues/206)) ([a56b4fc](https://github.com/kaltura/kaltura-player-js/commit/a56b4fc))
* **FEC-8833:** playlist - no thumbnail preview when the item already played ([#209](https://github.com/kaltura/kaltura-player-js/issues/209)) ([ccd5124](https://github.com/kaltura/kaltura-player-js/commit/ccd5124))
* **FEC-8840:** playlist - the poster url is wrong when the item is already played


### Features

* **FEC-8703:** playlist loop ([#208](https://github.com/kaltura/kaltura-player-js/issues/208)) ([f691b05](https://github.com/kaltura/kaltura-player-js/commit/f691b05))



<a name="0.38.1"></a>
## [0.38.1](https://github.com/kaltura/kaltura-player-js/compare/v0.38.0...v0.38.1) (2019-01-21)



<a name="0.38.0"></a>
# [0.38.0](https://github.com/kaltura/kaltura-player-js/compare/v0.37.3...v0.38.0) (2019-01-20)


### Bug Fixes

* remove applicative style ([#203](https://github.com/kaltura/kaltura-player-js/issues/203)) ([31e78fc](https://github.com/kaltura/kaltura-player-js/commit/31e78fc))
* set playlist by configure method doesn't work ([#197](https://github.com/kaltura/kaltura-player-js/issues/197)) ([7f4c515](https://github.com/kaltura/kaltura-player-js/commit/7f4c515))
* **FEC-8818:** cast doesn't respect 'startTime' config ([#202](https://github.com/kaltura/kaltura-player-js/issues/202)) ([f1f6392](https://github.com/kaltura/kaltura-player-js/commit/f1f6392))
* **FEC-8842:** playlist - item sources config ignored ([#211](https://github.com/kaltura/kaltura-player-js/issues/211)) ([fc73982](https://github.com/kaltura/kaltura-player-js/commit/fc73982))


### Features

* **FEC-8661:** support youtube engine playback ([#205](https://github.com/kaltura/kaltura-player-js/issues/205)) ([63f1a3b](https://github.com/kaltura/kaltura-player-js/commit/63f1a3b))
* **FEC-8751:** add support for ima playAdsAfterTime setting ([#201](https://github.com/kaltura/kaltura-player-js/issues/201)) ([f4c243d](https://github.com/kaltura/kaltura-player-js/commit/f4c243d))



<a name="0.37.3"></a>
## [0.37.3](https://github.com/kaltura/kaltura-player-js/compare/v0.37.2...v0.37.3) (2018-12-27)


### Bug Fixes

* **FEC-8788:** fix shaka playready endianness for Tivo ([#193](https://github.com/kaltura/kaltura-player-js/issues/193)) ([f44716f](https://github.com/kaltura/kaltura-player-js/commit/f44716f))
* **FEC-8791:** When changing volume in local mode it's not showing the correct rate/state when returning to local mode after casting ([#194](https://github.com/kaltura/kaltura-player-js/issues/194)) ([c0d89d5](https://github.com/kaltura/kaltura-player-js/commit/c0d89d5))



<a name="0.37.2"></a>
## [0.37.2](https://github.com/kaltura/kaltura-player-js/compare/v0.37.1...v0.37.2) (2018-12-24)


### Bug Fixes

* **FEC-8780:** captions not shown after seek ([#192](https://github.com/kaltura/kaltura-player-js/issues/192)) ([73b0107](https://github.com/kaltura/kaltura-player-js/commit/73b0107))



<a name="0.37.1"></a>
## [0.37.1](https://github.com/kaltura/kaltura-player-js/compare/v0.37.0...v0.37.1) (2018-12-20)


### Bug Fixes

* **FEC-8706:** After pre-roll ad playing in cast and disconnect the video starting from beginning (including pre-roll ad) ([#191](https://github.com/kaltura/kaltura-player-js/issues/191)) ([792fed4](https://github.com/kaltura/kaltura-player-js/commit/792fed4))
* **FEC-8773:** local storage mute state is not updated when user drag volume bar ([#190](https://github.com/kaltura/kaltura-player-js/issues/190)) ([28d098f](https://github.com/kaltura/kaltura-player-js/commit/28d098f))



<a name="0.37.0"></a>
# [0.37.0](https://github.com/kaltura/kaltura-player-js/compare/v0.36.7...v0.37.0) (2018-12-16)


### Bug Fixes

* **FEC-8595:** disconnect from cast failed ([#188](https://github.com/kaltura/kaltura-player-js/issues/188)) ([8825fae](https://github.com/kaltura/kaltura-player-js/commit/8825fae))
* **FEC-8719:** volume is not in sync when switching between sender-receiver ([#189](https://github.com/kaltura/kaltura-player-js/issues/189)) ([222d214](https://github.com/kaltura/kaltura-player-js/commit/222d214))


### Features

* **FEC-8507:** update hlsjs version to 0.12.0 ([#187](https://github.com/kaltura/kaltura-player-js/issues/187)) ([7e7b669](https://github.com/kaltura/kaltura-player-js/commit/7e7b669))
* **FEC-8705:** playlist - OTT support ([#186](https://github.com/kaltura/kaltura-player-js/issues/186)) ([6db068b](https://github.com/kaltura/kaltura-player-js/commit/6db068b))



<a name="0.36.7"></a>
## [0.36.7](https://github.com/kaltura/kaltura-player-js/compare/v0.36.5...v0.36.7) (2018-12-12)


### Bug Fixes

* **FEC-8714:** 'onclick' handler for iOS is not needed ([#181](https://github.com/kaltura/kaltura-player-js/issues/181)) ([10b3c42](https://github.com/kaltura/kaltura-player-js/commit/10b3c42))
* **FEC-8726:** kalturaPlayer.config api is broken while casting ([#185](https://github.com/kaltura/kaltura-player-js/issues/185)) ([d3cd747](https://github.com/kaltura/kaltura-player-js/commit/d3cd747))



<a name="0.36.6"></a>
## [0.36.6](https://github.com/kaltura/kaltura-player-js/compare/v0.36.5...v0.36.6) (2018-12-04)



<a name="0.36.5"></a>
## [0.36.5](https://github.com/kaltura/kaltura-player-js/compare/v0.36.4...v0.36.5) (2018-11-22)



<a name="0.36.4"></a>
## [0.36.4](https://github.com/kaltura/kaltura-player-js/compare/v0.36.3...v0.36.4) (2018-11-22)


### Bug Fixes

* **FEC-8713:** playlist by config not playing ([#179](https://github.com/kaltura/kaltura-player-js/issues/179)) ([da3ee4e](https://github.com/kaltura/kaltura-player-js/commit/da3ee4e))



<a name="0.36.3"></a>
## [0.36.3](https://github.com/kaltura/kaltura-player-js/compare/v0.36.2...v0.36.3) (2018-11-20)



<a name="0.36.2"></a>
## [0.36.2](https://github.com/kaltura/kaltura-player-js/compare/v0.36.1...v0.36.2) (2018-11-19)


### Bug Fixes

* **FEC-8698:** when ui is disabled, playNext() called even when playlist isn't configured ([#177](https://github.com/kaltura/kaltura-player-js/issues/177)) ([7a70147](https://github.com/kaltura/kaltura-player-js/commit/7a70147))
* export does not transpile correctly [#176](https://github.com/kaltura/kaltura-player-js/issues/176) ([c7532d4](https://github.com/kaltura/kaltura-player-js/commit/c7532d4))



<a name="0.36.1"></a>
## [0.36.1](https://github.com/kaltura/kaltura-player-js/compare/v0.36.0...v0.36.1) (2018-11-18)


### Bug Fixes

* **FEC-8689:** PLAYLIST_ITEM_CHANGED event fired before item has been changed ([#175](https://github.com/kaltura/kaltura-player-js/issues/175)) ([3892d98](https://github.com/kaltura/kaltura-player-js/commit/3892d98))



<a name="0.36.0"></a>
# [0.36.0](https://github.com/kaltura/kaltura-player-js/compare/v0.35.8...v0.36.0) (2018-11-15)


### Bug Fixes

* **FEC-8621:** playerdestory event is not sent on player destory ([a1b0597](https://github.com/kaltura/kaltura-player-js/commit/a1b0597))


### Features

* **FEC-8153:** save reference to player instances and expose API to get them ([#174](https://github.com/kaltura/kaltura-player-js/issues/174)) ([764849b](https://github.com/kaltura/kaltura-player-js/commit/764849b))



<a name="0.35.8"></a>
## [0.35.8](https://github.com/kaltura/kaltura-player-js/compare/v0.35.7...v0.35.8) (2018-11-14)



<a name="0.35.7"></a>
## [0.35.7](https://github.com/kaltura/kaltura-player-js/compare/v0.35.6...v0.35.7) (2018-11-14)


### Bug Fixes

* **FEC-8581:** playlist by config, no playlist buttons in first video ([#171](https://github.com/kaltura/kaltura-player-js/issues/171)) ([5e1ab92](https://github.com/kaltura/kaltura-player-js/commit/5e1ab92))
* **FEC-8588:** large play button displayed for a sec before the next item is playing ([#172](https://github.com/kaltura/kaltura-player-js/issues/172)) ([cc2f8f2](https://github.com/kaltura/kaltura-player-js/commit/cc2f8f2))
* **FEC-8685:** when disconnecting from cast player state is wrong - local and cast mode is not in sync ([#170](https://github.com/kaltura/kaltura-player-js/issues/170)) ([263f915](https://github.com/kaltura/kaltura-player-js/commit/263f915))



<a name="0.35.6"></a>
## [0.35.6](https://github.com/kaltura/kaltura-player-js/compare/v0.35.1...v0.35.6) (2018-11-11)


### Bug Fixes

* return analytics plugins import ([#167](https://github.com/kaltura/kaltura-player-js/issues/167)) ([55cd12d](https://github.com/kaltura/kaltura-player-js/commit/55cd12d))
* **FEC-8588:** large play button displayed for a sec before the next item is playing ([#168](https://github.com/kaltura/kaltura-player-js/issues/168)) ([46a4c40](https://github.com/kaltura/kaltura-player-js/commit/46a4c40))



<a name="0.35.5"></a>
## [0.35.5](https://github.com/kaltura/kaltura-player-js/compare/v0.35.4...v0.35.5) (2018-11-08)



<a name="0.35.4"></a>
## [0.35.4](https://github.com/kaltura/kaltura-player-js/compare/v0.35.2...v0.35.4) (2018-11-07)


### Bug Fixes

* return analytics plugins import ([#167](https://github.com/kaltura/kaltura-player-js/issues/167)) ([55cd12d](https://github.com/kaltura/kaltura-player-js/commit/55cd12d))



<a name="0.35.3"></a>
## [0.35.3](https://github.com/kaltura/kaltura-player-js/compare/v0.35.2...v0.35.3) (2018-11-07)



<a name="0.35.2"></a>
## [0.35.2](https://github.com/kaltura/kaltura-player-js/compare/v0.35.0...v0.35.2) (2018-11-07)


### Bug Fixes

* expose picture in picture api ([#165](https://github.com/kaltura/kaltura-player-js/issues/165)) ([6df4ac9](https://github.com/kaltura/kaltura-player-js/commit/6df4ac9))



<a name="0.35.1"></a>
## [0.35.1](https://github.com/kaltura/kaltura-player-js/compare/v0.35.0...v0.35.1) (2018-11-06)


### Bug Fixes

* expose picture in picture api ([#165](https://github.com/kaltura/kaltura-player-js/issues/165)) ([6df4ac9](https://github.com/kaltura/kaltura-player-js/commit/6df4ac9))



<a name="0.35.0"></a>
# [0.35.0](https://github.com/kaltura/kaltura-player-js/compare/v0.34.0...v0.35.0) (2018-11-05)


### Bug Fixes

* **FEC-8594:** when casting via Play on TV button the Captions/Audio is not displayed  ([#159](https://github.com/kaltura/kaltura-player-js/issues/159)) ([6ae6253](https://github.com/kaltura/kaltura-player-js/commit/6ae6253))
* **FEC-8637:** not possible to pass a function in a plugin configuration ([#163](https://github.com/kaltura/kaltura-player-js/issues/163)) ([cb2c5af](https://github.com/kaltura/kaltura-player-js/commit/cb2c5af))


### Features

* **FEC-8623:** playlist countdown ([#164](https://github.com/kaltura/kaltura-player-js/issues/164)) ([bc7eb33](https://github.com/kaltura/kaltura-player-js/commit/bc7eb33))



<a name="0.34.0"></a>
# [0.34.0](https://github.com/kaltura/kaltura-player-js/compare/v0.33.1...v0.34.0) (2018-10-28)


### Features

* **FEC-8452:** playlist ([#155](https://github.com/kaltura/kaltura-player-js/issues/155)) ([95cfbba](https://github.com/kaltura/kaltura-player-js/commit/95cfbba))



<a name="0.33.1"></a>
## [0.33.1](https://github.com/kaltura/kaltura-player-js/compare/v0.33.0...v0.33.1) (2018-10-18)



<a name="0.33.0"></a>
# [0.33.0](https://github.com/kaltura/kaltura-player-js/compare/v0.32.11...v0.33.0) (2018-10-14)


### Bug Fixes

* add new playkit path alias [#157](https://github.com/kaltura/kaltura-player-js/issues/157) ([5bfd1d1](https://github.com/kaltura/kaltura-player-js/commit/5bfd1d1))
* **docs:** add assetReferenceType to mediaInfo ([#156](https://github.com/kaltura/kaltura-player-js/issues/156)) ([fb9cff4](https://github.com/kaltura/kaltura-player-js/commit/fb9cff4))


### Features

* **FEC-8038:** cast framework ([#158](https://github.com/kaltura/kaltura-player-js/issues/158)) ([e836e69](https://github.com/kaltura/kaltura-player-js/commit/e836e69))



<a name="0.32.11"></a>
## [0.32.11](https://github.com/kaltura/kaltura-player-js/compare/v0.32.10...v0.32.11) (2018-09-16)

### Bug Fixes

* **FEC-8530:** element prepend is not supported on IE11 ([#154](https://github.com/kaltura/kaltura-player-js/issues/154)) ([ec8dea2](https://github.com/kaltura/kaltura-player-js/commit/ec8dea2))



<a name="0.32.10"></a>
## [0.32.10](https://github.com/kaltura/kaltura-player-js/compare/v0.32.9...v0.32.10) (2018-09-06)



<a name="0.32.9"></a>
## [0.32.9](https://github.com/kaltura/kaltura-player-js/compare/v0.32.8...v0.32.9) (2018-08-22)


### Bug Fixes

* **FEC-8474:** playback starts muted on change media - iOS ([#151](https://github.com/kaltura/kaltura-player-js/issues/151)) ([c5f332f](https://github.com/kaltura/kaltura-player-js/commit/c5f332f))
* **FEC-8487:** unescaped tokens causes token evalution to fail ([#152](https://github.com/kaltura/kaltura-player-js/issues/152)) ([3b86659](https://github.com/kaltura/kaltura-player-js/commit/3b86659))



<a name="0.32.8"></a>
## [0.32.8](https://github.com/kaltura/kaltura-player-js/compare/v0.32.7...v0.32.8) (2018-08-09)



<a name="0.32.7"></a>
## [0.32.7](https://github.com/kaltura/kaltura-player-js/compare/v0.32.6...v0.32.7) (2018-08-06)



<a name="0.32.6"></a>
## [0.32.6](https://github.com/kaltura/kaltura-player-js/compare/v0.32.5...v0.32.6) (2018-08-06)


### Bug Fixes

* **FEC-8449:** configured preview thumbnail is not displayed during playback ([#149](https://github.com/kaltura/kaltura-player-js/issues/149)) ([f3544d0](https://github.com/kaltura/kaltura-player-js/commit/f3544d0))



<a name="0.32.5"></a>
## [0.32.5](https://github.com/kaltura/kaltura-player-js/compare/v0.32.4...v0.32.5) (2018-08-05)


### Bug Fixes

* **FEC-7501:** cleanup on destroy doesn't completely remove player ([#131](https://github.com/kaltura/kaltura-player-js/issues/131)) ([8be89ca](https://github.com/kaltura/kaltura-player-js/commit/8be89ca))



<a name="0.32.4"></a>
## [0.32.4](https://github.com/kaltura/kaltura-player-js/compare/v0.32.3...v0.32.4) (2018-07-26)



<a name="0.32.3"></a>
## [0.32.3](https://github.com/kaltura/kaltura-player-js/compare/v0.32.2...v0.32.3) (2018-07-23)



<a name="0.32.2"></a>
## [0.32.2](https://github.com/kaltura/kaltura-player-js/compare/v0.32.1...v0.32.2) (2018-07-12)



<a name="0.32.1"></a>
## [0.32.1](https://github.com/kaltura/kaltura-player-js/compare/v0.32.0...v0.32.1) (2018-07-09)


### Bug Fixes

* **FEC-7887, FEC-7953, SUP-14111:** upgrade hlsjs to 0.10.1 ([#147](https://github.com/kaltura/kaltura-player-js/issues/147)) ([cf1095b](https://github.com/kaltura/kaltura-player-js/commit/cf1095b))



<a name="0.32.0"></a>
# [0.32.0](https://github.com/kaltura/kaltura-player-js/compare/v0.31.5...v0.32.0) (2018-07-09)


### Features

* support download manager anti-failure mechnism [#146](https://github.com/kaltura/kaltura-player-js/issues/146) ([222007d](https://github.com/kaltura/kaltura-player-js/commit/222007d))



<a name="0.31.5"></a>
## [0.31.5](https://github.com/kaltura/kaltura-player-js/compare/v0.31.4...v0.31.5) (2018-07-05)


### Bug Fixes

* **FEC-8382:** stereos icon displayed on iPhone, even if VR plugin disabled ([#144](https://github.com/kaltura/kaltura-player-js/issues/144)) ([116cc9f](https://github.com/kaltura/kaltura-player-js/commit/116cc9f))



<a name="0.31.4"></a>
## [0.31.4](https://github.com/kaltura/kaltura-player-js/compare/v0.31.2...v0.31.4) (2018-07-04)



<a name="0.31.3"></a>
## [0.31.3](https://github.com/kaltura/kaltura-player-js/compare/v0.31.2...v0.31.3) (2018-07-04)



<a name="0.31.2"></a>
## [0.31.2](https://github.com/kaltura/kaltura-player-js/compare/v0.31.1...v0.31.2) (2018-07-04)


### Bug Fixes

* **FEC-8355:** on change media the config hold the old seekbar configuration ([#136](https://github.com/kaltura/kaltura-player-js/issues/136)) ([0f6b036](https://github.com/kaltura/kaltura-player-js/commit/0f6b036))



<a name="0.31.1"></a>
# [0.31.1](https://github.com/kaltura/kaltura-player-js/compare/v0.31.0...v0.31.1) (2018-07-03)


### Bug Fixes

* **FEC-8375:** plugins data not evaluated ([#143](https://github.com/kaltura/kaltura-player-js/issues/143)) ([0033e93](https://github.com/kaltura/kaltura-player-js/commit/0033e93))



<a name="0.31.0"></a>
# [0.31.0](https://github.com/kaltura/kaltura-player-js/compare/v0.30.5...v0.31.0) (2018-07-03)


### Features

* **FEC-8364:** support adding evaluated expressions also on player setup and configure API ([#139](https://github.com/kaltura/kaltura-player-js/issues/139)) ([84542c8](https://github.com/kaltura/kaltura-player-js/commit/84542c8))



<a name="0.30.5"></a>
## [0.30.5](https://github.com/kaltura/kaltura-player-js/compare/v0.30.4...v0.30.5) (2018-07-02)



<a name="0.30.4"></a>
## [0.30.4](https://github.com/kaltura/kaltura-player-js/compare/v0.30.3...v0.30.4) (2018-06-28)


### Bug Fixes

* **FEC-8356:** pass player version string via config ([#137](https://github.com/kaltura/kaltura-player-js/issues/137)) ([7660f6f](https://github.com/kaltura/kaltura-player-js/commit/7660f6f))



<a name="0.30.3"></a>
## [0.30.3](https://github.com/kaltura/kaltura-player-js/compare/v0.30.2...v0.30.3) (2018-06-26)


### Bug Fixes

* **FEC-7971:** change media doesn't work after a critical error ([#135](https://github.com/kaltura/kaltura-player-js/issues/135)) ([292876f](https://github.com/kaltura/kaltura-player-js/commit/292876f))



<a name="0.30.2"></a>
## [0.30.2](https://github.com/kaltura/kaltura-player-js/compare/v0.30.1...v0.30.2) (2018-06-26)


### Bug Fixes

* **FEC-7971:** change media doesn't work after a critical error ([#135](https://github.com/kaltura/kaltura-player-js/issues/135)) ([292876f](https://github.com/kaltura/kaltura-player-js/commit/292876f))



<a name="0.30.1"></a>
## [0.30.1](https://github.com/kaltura/kaltura-player-js/compare/v0.30.0...v0.30.1) (2018-06-25)


### Bug Fixes

* **FEC-8349:** OTT analytics - no event send for logged user ([#134](https://github.com/kaltura/kaltura-player-js/issues/134)) ([f3e1766](https://github.com/kaltura/kaltura-player-js/commit/f3e1766))



<a name="0.30.0"></a>
# [0.30.0](https://github.com/kaltura/kaltura-player-js/compare/v0.29.0...v0.30.0) (2018-06-24)


### Features

* **FEC-8331:** expose the anonymous flag on session object ([#132](https://github.com/kaltura/kaltura-player-js/issues/132)) ([3a4dddf](https://github.com/kaltura/kaltura-player-js/commit/3a4dddf))



<a name="0.29.0"></a>
# [0.29.0](https://github.com/kaltura/kaltura-player-js/compare/v0.28.2...v0.29.0) (2018-06-20)


### Features

* **FEC-8046:** 360 support ([#130](https://github.com/kaltura/kaltura-player-js/issues/130)) ([cec9ea6](https://github.com/kaltura/kaltura-player-js/commit/cec9ea6))



<a name="0.28.2"></a>
## [0.28.2](https://github.com/kaltura/kaltura-player-js/compare/v0.28.1...v0.28.2) (2018-06-20)



<a name="0.28.1"></a>
## [0.28.1](https://github.com/kaltura/kaltura-player-js/compare/v0.28.0...v0.28.1) (2018-06-17)



<a name="0.28.0"></a>
# [0.28.0](https://github.com/kaltura/kaltura-player-js/compare/v0.27.4...v0.28.0) (2018-06-11)


### Features

* **FEC-8281:** support jsonP redirect for OTT ([#128](https://github.com/kaltura/kaltura-player-js/issues/128)) ([34b4cf4](https://github.com/kaltura/kaltura-player-js/commit/34b4cf4))
* kava plugin integration ([#90](https://github.com/kaltura/kaltura-player-js/issues/90)) ([de71162](https://github.com/kaltura/kaltura-player-js/commit/de71162))



<a name="0.27.4"></a>
## [0.27.4](https://github.com/kaltura/kaltura-player-js/compare/v0.27.3...v0.27.4) (2018-05-28)



<a name="0.27.3"></a>
## [0.27.3](https://github.com/kaltura/kaltura-player-js/compare/v0.27.2...v0.27.3) (2018-05-27)


### Bug Fixes

* **FEC-8261:** OTT Poster is now an object - we tried to load [Object Object] url ([#127](https://github.com/kaltura/kaltura-player-js/issues/127)) ([64851b2](https://github.com/kaltura/kaltura-player-js/commit/64851b2))



<a name="0.27.2"></a>
## [0.27.2](https://github.com/kaltura/kaltura-player-js/compare/v0.27.1...v0.27.2) (2018-05-26)


### Bug Fixes

* **FEC-8228:** calculate correct referrer param for inline and iframe embeds ([#123](https://github.com/kaltura/kaltura-player-js/issues/123)) ([71401cc](https://github.com/kaltura/kaltura-player-js/commit/71401cc))
* **FEC-8235:** remove default service url from OTT provider and analytics ([#125](https://github.com/kaltura/kaltura-player-js/issues/125)) ([104bc9a](https://github.com/kaltura/kaltura-player-js/commit/104bc9a))
* **FEC-8240:** support legacy config on configure API ([#126](https://github.com/kaltura/kaltura-player-js/issues/126)) ([9a817e5](https://github.com/kaltura/kaltura-player-js/commit/9a817e5))



<a name="0.27.1"></a>
## [0.27.1](https://github.com/kaltura/kaltura-player-js/compare/v0.27.0...v0.27.1) (2018-05-15)



<a name="0.27.0"></a>
# [0.27.0](https://github.com/kaltura/kaltura-player-js/compare/v0.26.0...v0.27.0) (2018-05-10)


### Bug Fixes

* **FEC-8202:** Session ID isn't sent when reporting analytics ([#118](https://github.com/kaltura/kaltura-player-js/issues/118)) ([72c4b4e](https://github.com/kaltura/kaltura-player-js/commit/72c4b4e))
* **FEC-8204:** cannot set entry id via plugin config ([#119](https://github.com/kaltura/kaltura-player-js/issues/119)) ([2b80765](https://github.com/kaltura/kaltura-player-js/commit/2b80765))


### Features

* remove youbora & ima plugins from kaltura player bundle ([#120](https://github.com/kaltura/kaltura-player-js/issues/120)) ([9cc5766](https://github.com/kaltura/kaltura-player-js/commit/9cc5766))



<a name="0.26.0"></a>
# [0.26.0](https://github.com/kaltura/kaltura-player-js/compare/v0.25.1...v0.26.0) (2018-05-06)


### Features

* **FEC-8176:** restructure player config ([#117](https://github.com/kaltura/kaltura-player-js/issues/117)) ([3f89ef3](https://github.com/kaltura/kaltura-player-js/commit/3f89ef3))



<a name="0.25.1"></a>
## [0.25.1](https://github.com/kaltura/kaltura-player-js/compare/v0.25.0...v0.25.1) (2018-05-01)



<a name="0.25.0"></a>
# [0.25.0](https://github.com/kaltura/kaltura-player-js/compare/v0.24.2...v0.25.0) (2018-04-25)


### Features

* **FEC-8036:** google analytics ([#114](https://github.com/kaltura/kaltura-player-js/issues/114)) ([f0100b5](https://github.com/kaltura/kaltura-player-js/commit/f0100b5))



<a name="0.24.2"></a>
## [0.24.2](https://github.com/kaltura/kaltura-player-js/compare/v0.24.1...v0.24.2) (2018-04-23)



<a name="0.24.1"></a>
## [0.24.1](https://github.com/kaltura/kaltura-player-js/compare/v0.24.0...v0.24.1) (2018-04-22)


### Bug Fixes

* **FEC-8131:** skippable ads fail on iOS ([#112](https://github.com/kaltura/kaltura-player-js/issues/112)) ([9b1940c](https://github.com/kaltura/kaltura-player-js/commit/9b1940c))



<a name="0.24.0"></a>
# [0.24.0](https://github.com/kaltura/kaltura-player-js/compare/v0.23.0...v0.24.0) (2018-04-16)


### Bug Fixes

* **FEC-7934:** change storage manager to listen to UI events ([#111](https://github.com/kaltura/kaltura-player-js/issues/111)) ([619d0e9](https://github.com/kaltura/kaltura-player-js/commit/619d0e9))


### Features

* **UI wrapper:** disabling UI  ([#107](https://github.com/kaltura/kaltura-player-js/issues/107)) ([5784a75](https://github.com/kaltura/kaltura-player-js/commit/5784a75))



<a name="0.23.0"></a>
# [0.23.0](https://github.com/kaltura/kaltura-player-js/compare/v0.22.0...v0.23.0) (2018-04-11)


### Features

* register UI events ([#109](https://github.com/kaltura/kaltura-player-js/issues/109)) ([5d27f43](https://github.com/kaltura/kaltura-player-js/commit/5d27f43))



<a name="0.22.0"></a>
# [0.22.0](https://github.com/kaltura/kaltura-player-js/compare/v0.21.0...v0.22.0) (2018-04-10)


### Features

* ui customization ([#105](https://github.com/kaltura/kaltura-player-js/issues/105)) ([6b70fc0](https://github.com/kaltura/kaltura-player-js/commit/6b70fc0))



<a name="0.21.0"></a>
# [0.21.0](https://github.com/kaltura/kaltura-player-js/compare/v0.20.0...v0.21.0) (2018-04-09)


### Features

* **FEC-8084:** add loading spinner while preforming change media ([#106](https://github.com/kaltura/kaltura-player-js/issues/106)) ([a936117](https://github.com/kaltura/kaltura-player-js/commit/a936117))



<a name="0.20.0"></a>
# [0.20.0](https://github.com/kaltura/kaltura-player-js/compare/v0.19.4...v0.20.0) (2018-03-27)


### Features

* **FEC-7089:** call player.reset() before change media ([#104](https://github.com/kaltura/kaltura-player-js/issues/104)) ([c6cbfb3](https://github.com/kaltura/kaltura-player-js/commit/c6cbfb3))



<a name="0.19.4"></a>
## [0.19.4](https://github.com/kaltura/kaltura-player-js/compare/v0.19.3...v0.19.4) (2018-03-21)



<a name="0.19.3"></a>
## [0.19.3](https://github.com/kaltura/kaltura-player-js/compare/v0.19.2...v0.19.3) (2018-03-14)


### Bug Fixes

* always set default external stream handler ([#99](https://github.com/kaltura/kaltura-player-js/issues/99)) ([3b2769e](https://github.com/kaltura/kaltura-player-js/commit/3b2769e))



<a name="0.19.2"></a>
## [0.19.2](https://github.com/kaltura/kaltura-player-js/compare/v0.19.1...v0.19.2) (2018-03-14)



<a name="0.19.1"></a>
## [0.19.1](https://github.com/kaltura/kaltura-player-js/compare/v0.19.0...v0.19.1) (2018-03-14)


### Bug Fixes

* **FEC-8026:** external OTT VOD/Live media doesn't works on IE 11 ([#98](https://github.com/kaltura/kaltura-player-js/issues/98)) ([17238bf](https://github.com/kaltura/kaltura-player-js/commit/17238bf))



<a name="0.19.0"></a>
# [0.19.0](https://github.com/kaltura/kaltura-player-js/compare/v0.18.11...v0.19.0) (2018-03-12)


### Features

* **FEC-7954:** poster and thumbnail preview missing on tv player ([#97](https://github.com/kaltura/kaltura-player-js/issues/97)) ([96a51b3](https://github.com/kaltura/kaltura-player-js/commit/96a51b3))



<a name="0.18.11"></a>
## [0.18.11](https://github.com/kaltura/kaltura-player-js/compare/v0.18.10...v0.18.11) (2018-03-08)


### Bug Fixes

* **FEC-7815:** Support playManifest redirects for external streams ([#85](https://github.com/kaltura/kaltura-player-js/issues/85)) ([cac2bb6](https://github.com/kaltura/kaltura-player-js/commit/cac2bb6))



<a name="0.18.10"></a>
## [0.18.10](https://github.com/kaltura/kaltura-player-js/compare/v0.18.9...v0.18.10) (2018-03-05)


### Bug Fixes

* **uiManager:** support initial forceTouchUI config ([b9e585e](https://github.com/kaltura/kaltura-player-js/commit/b9e585e))



<a name="0.18.9"></a>
## [0.18.9](https://github.com/kaltura/kaltura-player-js/compare/v0.18.8...v0.18.9) (2018-02-28)



<a name="0.18.8"></a>
## [0.18.8](https://github.com/kaltura/kaltura-player-js/compare/v0.18.7...v0.18.8) (2018-02-28)



<a name="0.18.7"></a>
## [0.18.7](https://github.com/kaltura/kaltura-player-js/compare/v0.18.6...v0.18.7) (2018-02-26)



<a name="0.18.6"></a>
## [0.18.6](https://github.com/kaltura/kaltura-player-js/compare/v0.18.5...v0.18.6) (2018-02-19)


### Bug Fixes

* **FEC-7907, FEC-7872:** No play button when preload=auto and ima plugin enabled ([#91](https://github.com/kaltura/kaltura-player-js/issues/91)) ([58b0dec](https://github.com/kaltura/kaltura-player-js/commit/58b0dec))



<a name="0.18.5"></a>
## [0.18.5](https://github.com/kaltura/kaltura-player-js/compare/v0.18.4...v0.18.5) (2018-02-14)

<a name="0.18.4"></a>
## [0.18.4](https://github.com/kaltura/kaltura-player-js/compare/v0.18.2...v0.18.4) (2018-02-11)


### Bug Fixes

* **FEC-7534:** IE11 - After seeking back and forth when Clicking Replay the video is not playing again ([#82](https://github.com/kaltura/kaltura-player-js/issues/82)) ([1f38790](https://github.com/kaltura/kaltura-player-js/commit/1f38790))



<a name="0.18.3"></a>
## [0.18.3](https://github.com/kaltura/kaltura-player-js/compare/v0.18.2...v0.18.3) (2018-02-06)



<a name="0.18.2"></a>
## [0.18.2](https://github.com/kaltura/kaltura-player-js/compare/v0.18.1...v0.18.2) (2018-02-06)



<a name="0.18.1"></a>
## [0.18.1](https://github.com/kaltura/kaltura-player-js/compare/v0.18.0...v0.18.1) (2018-01-21)



<a name="0.18.0"></a>
# [0.18.0](https://github.com/kaltura/kaltura-player-js/compare/v0.16.2...v0.18.0) (2018-01-10)


### Bug Fixes

* **FEC-7476:** error handling ([#63](https://github.com/kaltura/kaltura-player-js/issues/63)) ([b2cdc1b](https://github.com/kaltura/kaltura-player-js/commit/b2cdc1b))
* adjust player positioning in host DOM ([56b8550](https://github.com/kaltura/kaltura-player-js/commit/56b8550))
* remove non existing method in uiManager ([89da254](https://github.com/kaltura/kaltura-player-js/commit/89da254))


### Features

* ott player ([#67](https://github.com/kaltura/kaltura-player-js/issues/67)) ([c740a33](https://github.com/kaltura/kaltura-player-js/commit/c740a33))
* support server side config ([#65](https://github.com/kaltura/kaltura-player-js/issues/65)) ([2f75dd4](https://github.com/kaltura/kaltura-player-js/commit/2f75dd4))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/kaltura/kaltura-player-js/compare/v0.16.4...v0.17.0) (2017-12-12)


### Bug Fixes

* adjust player positioning in host DOM ([56b8550](https://github.com/kaltura/kaltura-player-js/commit/56b8550))


### Features

* support server side config ([#65](https://github.com/kaltura/kaltura-player-js/issues/65)) ([2f75dd4](https://github.com/kaltura/kaltura-player-js/commit/2f75dd4))



<a name="0.16.4"></a>
## [0.16.4](https://github.com/kaltura/kaltura-player-js/compare/v0.16.3...v0.16.4) (2017-12-06)


### Bug Fixes

* remove non existing method in uiManager ([89da254](https://github.com/kaltura/kaltura-player-js/commit/89da254))



<a name="0.16.3"></a>
## [0.16.3](https://github.com/kaltura/kaltura-player-js/compare/v0.16.2...v0.16.3) (2017-12-06)


### Bug Fixes

* **FEC-7476:** error handling ([#63](https://github.com/kaltura/kaltura-player-js/issues/63)) ([b2cdc1b](https://github.com/kaltura/kaltura-player-js/commit/b2cdc1b))



<a name="0.16.2"></a>
## [0.16.2](https://github.com/kaltura/kaltura-player-js/compare/v0.16.1...v0.16.2) (2017-11-29)



<a name="0.16.1"></a>
## [0.16.1](https://github.com/kaltura/kaltura-player-js/compare/v0.16.0...v0.16.1) (2017-11-29)



<a name="0.16.0"></a>
# [0.16.0](https://github.com/kaltura/kaltura-player-js/compare/v0.15.1...v0.16.0) (2017-11-28)


### Features

* add config for forcing touch ui ([#61](https://github.com/kaltura/kaltura-player-js/issues/61)) ([93898b1](https://github.com/kaltura/kaltura-player-js/commit/93898b1))



<a name="0.15.1"></a>
## [0.15.1](https://github.com/kaltura/kaltura-player-js/compare/v0.15.0...v0.15.1) (2017-11-26)


### Bug Fixes

* **FEC-7528:** multiple players cannot be loaded ([#60](https://github.com/kaltura/kaltura-player-js/issues/60)) ([b6b9bb6](https://github.com/kaltura/kaltura-player-js/commit/b6b9bb6))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/kaltura/kaltura-player-js/compare/v0.14.0...v0.15.0) (2017-11-23)


### Features

* set ui seekbar config ([#59](https://github.com/kaltura/kaltura-player-js/issues/59)) ([304bc0a](https://github.com/kaltura/kaltura-player-js/commit/304bc0a))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/kaltura/kaltura-player-js/compare/v0.13.3...v0.14.0) (2017-11-16)


### Bug Fixes

* logLevel type syntax ([#57](https://github.com/kaltura/kaltura-player-js/issues/57)) ([6dd55a6](https://github.com/kaltura/kaltura-player-js/commit/6dd55a6))


### Features

* set log level from config and API ([#56](https://github.com/kaltura/kaltura-player-js/issues/56)) ([1c31f5d](https://github.com/kaltura/kaltura-player-js/commit/1c31f5d))



<a name="0.13.3"></a>
## [0.13.3](https://github.com/kaltura/kaltura-player-js/compare/v0.13.2...v0.13.3) (2017-11-07)



<a name="0.13.2"></a>
## [0.13.2](https://github.com/kaltura/kaltura-player-js/compare/v0.13.1...v0.13.2) (2017-11-01)


### Bug Fixes

* remove kanalytics base url ([#54](https://github.com/kaltura/kaltura-player-js/issues/54)) ([d6c0251](https://github.com/kaltura/kaltura-player-js/commit/d6c0251))
* **FEC-7364:** player save values in cache before play request ([#52](https://github.com/kaltura/kaltura-player-js/issues/52)) ([a72e9c4](https://github.com/kaltura/kaltura-player-js/commit/a72e9c4))
* use native captions on safari ([#53](https://github.com/kaltura/kaltura-player-js/issues/53)) ([fe5aa16](https://github.com/kaltura/kaltura-player-js/commit/fe5aa16))



<a name="0.13.1"></a>
## [0.13.1](https://github.com/kaltura/kaltura-player-js/compare/v0.13.0...v0.13.1) (2017-10-30)



<a name="0.13.0"></a>
# [0.13.0](https://github.com/kaltura/kaltura-player-js/compare/v0.12.0...v0.13.0) (2017-10-26)


### Bug Fixes

* import index.js to e2e tests ([#50](https://github.com/kaltura/kaltura-player-js/issues/50)) ([ccd8dbc](https://github.com/kaltura/kaltura-player-js/commit/ccd8dbc))


### Features

* update platkit-js-* versions ([fa1a37e](https://github.com/kaltura/kaltura-player-js/commit/fa1a37e))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/kaltura/kaltura-player-js/compare/v0.8.0...v0.9.0) (2017-10-16)



<a name="0.12.0"></a>
# [0.12.0](https://github.com/kaltura/kaltura-player-js/compare/v0.11.0...v0.12.0) (2017-10-25)


### Features

* **FEC-7336:** set default analyticsd plugins settings ([#48](https://github.com/kaltura/kaltura-player-js/issues/48)) ([ebdec97](https://github.com/kaltura/kaltura-player-js/commit/ebdec97))
* upgrade playkit-js-* libs ([81437fe](https://github.com/kaltura/kaltura-player-js/commit/81437fe))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/kaltura/kaltura-player-js/compare/v0.10.0...v0.11.0) (2017-10-24)


### Features

* **local-storage:** store cvaa settings ([#45](https://github.com/kaltura/kaltura-player-js/issues/45)) ([f3546f5](https://github.com/kaltura/kaltura-player-js/commit/f3546f5))
* upgrade playkit-js-* libs ([a992a4e](https://github.com/kaltura/kaltura-player-js/commit/a992a4e))
* upgrade playkit-js-ima ([ad03d91](https://github.com/kaltura/kaltura-player-js/commit/ad03d91))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/kaltura/kaltura-player-js/compare/v0.9.0...v0.10.0) (2017-10-23)


### Features

* upgrade playkit-js-* libs ([7a17570](https://github.com/kaltura/kaltura-player-js/commit/7a17570))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/kaltura/kaltura-player-js/compare/v0.8.0...v0.9.0) (2017-10-16)


### Features

* upgrade playkit-js-* libs ([c9be758](https://github.com/kaltura/kaltura-player-js/commit/c9be758))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/kaltura/kaltura-player-js/compare/v0.7.1...v0.8.0) (2017-10-10)


### Bug Fixes

* **FEC-7226, FEC-7243:** player config stronger then storage config ([#43](https://github.com/kaltura/kaltura-player-js/issues/43)) ([0fb9525](https://github.com/kaltura/kaltura-player-js/commit/0fb9525))


### Features

* upgrade playkit-js and ui libs ([8c4c1d1](https://github.com/kaltura/kaltura-player-js/commit/8c4c1d1))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/kaltura/kaltura-player-js/compare/v0.7.0...v0.7.1) (2017-10-04)


### Bug Fixes

* **FEC-7032, FEC-7034:** update playkit-js-*, shaka & hls.js versions ([#41](https://github.com/kaltura/kaltura-player-js/issues/41)) ([1f9d925](https://github.com/kaltura/kaltura-player-js/commit/1f9d925))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/kaltura/kaltura-player-js/compare/v0.6.1...v0.7.0) (2017-10-02)


### Features

* choose default text tracks on iOS by default ([#36](https://github.com/kaltura/kaltura-player-js/issues/36)) ([3329366](https://github.com/kaltura/kaltura-player-js/commit/3329366))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/kaltura/kaltura-player-js/compare/v0.6.0...v0.6.1) (2017-09-28)


### Bug Fixes

* **FEC-7123:** include global webpack var in flow config  ([#38](https://github.com/kaltura/kaltura-player-js/issues/38)) ([d77e96a](https://github.com/kaltura/kaltura-player-js/commit/d77e96a))


<a name="0.6.0"></a>
# [0.6.0](https://github.com/kaltura/kaltura-player-js/compare/v0.3.0...v0.6.0) (2017-09-26)


### Bug Fixes

* **FEC-7192:** play native HLS on iOS ([#34](https://github.com/kaltura/kaltura-player-js/issues/34)) ([9b27213](https://github.com/kaltura/kaltura-player-js/commit/9b27213))
* **FEC-7123:** pass player version as provider param ([#35](https://github.com/kaltura/kaltura-player-js/issues/35)) ([bb950f8](https://github.com/kaltura/kaltura-player-js/commit/bb950f8))
* remove import of global webpack var ([ca0a23c](https://github.com/kaltura/kaltura-player-js/commit/ca0a23c))


### Features
* evaluate default plugins config ([#30](https://github.com/kaltura/kaltura-player-js/issues/30)) ([f87beac](https://github.com/kaltura/kaltura-player-js/commit/f87beac))
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
