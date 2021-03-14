import SourcesConfig from '../../configs/sources';
import {getConfigStructure} from '../../utils/test-utils';
import {KalturaPlayer as Player} from '../../../../src/kaltura-player';
import {CustomEventType, AdEventType, Error, FakeEvent, Utils} from '@playkit-js/playkit-js';

describe('AdsController', () => {
  let config, player, sandbox;

  before(() => {
    config = getConfigStructure();
  });

  beforeEach(() => {
    player = new Player(config);
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    player.destroy();
    sandbox.restore();
  });

  describe('advertising config', () => {
    it('Should fire AD_MANIFEST_LOADED with the uniq and valid breaks only', done => {
      const fakeCtrl = {
        playAdNow: () => {}
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.addEventListener(AdEventType.AD_MANIFEST_LOADED, event => {
        try {
          event.payload.adBreaksPosition.should.deep.equal(['0%', 0, 2, '50%', 1, -1, '100%']);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.configure({
        sources: SourcesConfig.Mp4,
        advertising: {
          adBreaks: [
            {percentage: 0, ads: [{}]},
            {position: 0, ads: [{}]},
            {position: '1', ads: [{}]},
            {position: 1, ads: []},
            {position: 2, ads: [{}]},
            {position: 2, ads: [{}]},
            {percentage: 50, ads: [{}]},
            {position: 1, ads: [{}]},
            {position: -1, ads: [{}]},
            {percentage: 100, ads: [{}]}
          ]
        }
      });
    });

    it('Should not fire AD_MANIFEST_LOADED for empty list', done => {
      const fakeCtrl = {
        playAdNow: () => {}
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.addEventListener(AdEventType.AD_MANIFEST_LOADED, () => {
        done(new Error('Should not fireAD_MANIFEST_LOADED'));
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: '1', ads: [{}]},
            {position: 1, ads: []}
          ]
        }
      });
      setTimeout(done);
    });

    it('Should play pre-roll, 2 mid-rolls and post-roll by position', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[2]},
            {position: -1, ads: adBreaks[3]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should play pre-roll, 2 mid-rolls and post-roll by percentage', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {percentage: 0, ads: adBreaks[0]},
            {percentage: 25, ads: adBreaks[1]},
            {percentage: 50, ads: adBreaks[2]},
            {percentage: 100, ads: adBreaks[3]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should play 5 mid-rolls by every', done => {
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            adBreakIndex++;
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal([{url: ['MID_ROLL']}]);
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{every: 1, ads: [{url: ['MID_ROLL']}]}]
        }
      });
      player.addEventListener(CustomEventType.PLAYBACK_ENDED, () => {
        try {
          adBreakIndex.should.equal(5);
          player._adsController._configAdBreaks.length.should.equal(5);
          done();
        } catch (e) {
          done(e);
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should play pre-roll, mid-rolls and post-roll by mix position, percentage and every', done => {
      const adBreaks = [
        [{url: ['PRE_ROLL_1']}, {url: ['PRE_ROLL_1']}],
        [{url: ['MID_ROLL_1']}],
        [{url: ['MID_ROLL_2']}],
        [{url: ['MID_ROLL_3']}],
        [{url: ['MID_ROLL_3']}],
        [{url: ['POST_ROLL']}]
      ];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 0, ads: [adBreaks[0][0]]},
            {percentage: 0, ads: [adBreaks[0][1]]},
            {percentage: 25, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[2]},
            {every: 2.5, ads: adBreaks[3]},
            {percentage: 100, ads: adBreaks[5]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should skip the first mid-roll (snap-back)', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[1]},
            {position: -1, ads: adBreaks[2]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.currentTime = 2;
      });
      player.play();
    });

    it('Should fire PLAYBACK_ENDED when snap-back after post-roll finished', done => {
      const adBreaks = [[{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 1;
      const fakeCtrl = {
        done: true,
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            setTimeout(() => player.dispatchEvent(new FakeEvent(AdEventType.ADS_COMPLETED)));
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 1, ads: adBreaks[0]},
            {position: 2, ads: adBreaks[1]},
            {position: -1, ads: adBreaks[2]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.PLAYBACK_ENDED, () => {
        done();
      });
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.currentTime = 2;
      });
      player.play();
    });

    it('Should fire PLAYBACK_ENDED when snap-back after post-roll failed', done => {
      const adBreaks = [[{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 1;
      const fakeCtrl = {
        done: true,
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            player._adsController._adPlayed = true;
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            setTimeout(() => player.dispatchEvent(new FakeEvent(AdEventType.AD_ERROR, {severity: 2})));
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 1, ads: adBreaks[0]},
            {position: 2, ads: adBreaks[1]},
            {position: -1, ads: adBreaks[2]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.PLAYBACK_ENDED, () => {
        done();
      });
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.currentTime = 2;
      });
      player.play();
    });

    it('Should not play skipped mid-roll (snap-back) on replay', done => {
      const adBreaks = [[{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}]];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[1]);
          } catch (e) {
            done(new Error('Should not play skipped mid-roll'));
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 2, ads: adBreaks[0]},
            {position: 3, ads: adBreaks[1]}
          ]
        }
      });
      let firstPlay = true;
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.PLAYBACK_ENDED, () => {
        if (firstPlay) {
          player.play();
          firstPlay = false;
        } else {
          done();
        }
      });
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.currentTime = 4;
      });
      player.play();
    });

    it('Should play the in reverse (snap-back)', done => {
      const adBreaks = [
        [{url: ['PRE_ROLL']}],
        [{url: ['MID_ROLL_3']}],
        [{url: ['MID_ROLL_2']}],
        [{url: ['MID_ROLL_1']}],
        [{url: ['MID_ROLL_4']}],
        [{url: ['POST_ROLL']}]
      ];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === 2) {
              player.currentTime = 2.5;
            }
            if (adBreakIndex === 3) {
              player.currentTime = 0;
            }
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[3]},
            {position: 2, ads: adBreaks[2]},
            {position: 3, ads: adBreaks[1]},
            {position: 4, ads: adBreaks[4]},
            {position: -1, ads: adBreaks[5]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.currentTime = 3;
      });
      player.play();
    });

    it('Should skip the pre-roll and first mid-roll as playback.startTime configured', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 2;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        playback: {
          startTime: 1
        },
        advertising: {
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[2]},
            {position: -1, ads: adBreaks[3]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should skip the pre-roll and first mid-roll as playAdsAfterTime configured', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 2;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          playAdsAfterTime: 1,
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[2]},
            {position: -1, ads: adBreaks[3]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should not skip even playback.startTime since playAdsAfterTime configured', done => {
      const adBreaks = [[{url: ['PRE_ROLL']}], [{url: ['MID_ROLL_1']}], [{url: ['MID_ROLL_2']}], [{url: ['POST_ROLL']}]];
      let adBreakIndex = 0;
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[adBreakIndex]);
            adBreakIndex++;
            if (adBreakIndex === adBreaks.length) {
              done();
            }
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        playback: {
          startTime: 1
        },
        advertising: {
          playAdsAfterTime: -1,
          adBreaks: [
            {position: 0, ads: adBreaks[0]},
            {position: 1, ads: adBreaks[1]},
            {position: 2, ads: adBreaks[2]},
            {position: -1, ads: adBreaks[3]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should unify 2 pre-rolls', done => {
      const adBreaks = [[{url: ['PRE_ROLL_1']}, {url: ['PRE_ROLL_2']}]];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[0]);
            done();
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 0, ads: [adBreaks[0][0]]},
            {position: 0, ads: [adBreaks[0][1]]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should unify 2 mid-rolls', done => {
      const adBreaks = [[{url: ['MID_ROLL_1']}, {url: ['MID_ROLL_2']}]];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[0]);
            done();
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 2, ads: [adBreaks[0][0]]},
            {position: 2, ads: [adBreaks[0][1]]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should unify 2 post-rolls', done => {
      const adBreaks = [[{url: ['POST_ROLL_1']}, {url: ['POST_ROLL_2']}]];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            player._adsController && (player._adsController._adIsLoading = false);
            ads.should.deep.equal(adBreaks[0]);
            done();
          } catch (e) {
            done(e);
          }
        },
        onPlaybackEnded: () => {
          return Promise.resolve();
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: -1, ads: [adBreaks[0][0]]},
            {position: -1, ads: [adBreaks[0][1]]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should ignore ad break positioned out of the duration', done => {
      const fakeCtrl = {
        playAdNow: () => {
          done(new Error('Should not play an out of range ad break'));
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 10, ads: [{url: ['MID_ROLL_1']}]}]
        }
      });
      player.addEventListener(CustomEventType.PLAYBACK_ENDED, () => {
        try {
          player._adsController._configAdBreaks.every(adBreak => adBreak.played).should.be.true;
          done();
        } catch (e) {
          done(e);
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });

    it('Should validate only one time is configured', done => {
      const fakeCtrl = {
        playAdNow: () => {}
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.addEventListener(AdEventType.AD_MANIFEST_LOADED, event => {
        try {
          event.payload.adBreaksPosition.should.deep.equal([10, '60%', '5s', 0.5, 1, '80%', 2]);
        } catch (e) {
          done(e);
        }
      });
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        try {
          (!!player._adsController._configAdBreaks[0].position).should.be.true;
          (!!player._adsController._configAdBreaks[0].percentage).should.be.false;
          (!!player._adsController._configAdBreaks[0].every).should.be.false;

          (!!player._adsController._configAdBreaks[1].position).should.be.true;
          (!!player._adsController._configAdBreaks[1].percentage).should.be.false;
          (!!player._adsController._configAdBreaks[1].every).should.be.false;

          (!!player._adsController._configAdBreaks[2].position).should.be.true;
          (!!player._adsController._configAdBreaks[2].percentage).should.be.false;
          (!!player._adsController._configAdBreaks[2].every).should.be.false;

          (!!player._adsController._configAdBreaks[3].position).should.be.true;
          (!!player._adsController._configAdBreaks[3].percentage).should.be.true;
          (!!player._adsController._configAdBreaks[3].every).should.be.false;

          (!!player._adsController._configAdBreaks[4].position).should.be.true;
          (!!player._adsController._configAdBreaks[4].percentage).should.be.true;
          (!!player._adsController._configAdBreaks[4].every).should.be.false;

          (!!player._adsController._configAdBreaks[5].position).should.be.true;
          (!!player._adsController._configAdBreaks[5].percentage).should.be.false;
          (!!player._adsController._configAdBreaks[5].every).should.be.true;

          (!!player._adsController._configAdBreaks[6].position).should.be.true;
          (!!player._adsController._configAdBreaks[6].percentage).should.be.false;
          (!!player._adsController._configAdBreaks[6].every).should.be.false;
          done();
        } catch (e) {
          done(e);
        }
      });
      player.configure({
        advertising: {
          adBreaks: [
            {position: 10, ads: [{url: ['']}]},
            {percentage: 60, ads: [{url: ['']}]},
            {every: 5, ads: [{url: ['']}]},
            {position: 0.5, percentage: 50, ads: [{url: ['']}]},
            {position: 1, every: 15, ads: [{url: ['']}]},
            {percentage: 80, every: 10, ads: [{url: ['']}]},
            {position: 2, percentage: 60, every: 20, ads: [{url: ['']}]}
          ]
        }
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.play();
    });
  });

  describe('playAdNow', () => {
    it('Should play pre-roll', done => {
      const preroll = [{url: ['PRE_ROLL']}];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            ads.should.deep.equal(preroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.ads.playAdNow(preroll);
    });

    it('Should play mid-roll', done => {
      const midroll = [{url: ['MID_ROLL']}];
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            ads.should.deep.equal(midroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player.ads.playAdNow(midroll);
      });
      player.play();
    });

    it('Should not play mid-roll while ad break', done => {
      const midroll = [{url: ['MID_ROLL']}];
      const fakeCtrl = {
        playAdNow: () => {
          done(new Error('Should not play ad while ad break'));
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({sources: SourcesConfig.Mp4});
      player.addEventListener(CustomEventType.FIRST_PLAY, () => {
        player._adsController._adBreak = true;
        player.ads.playAdNow(midroll);
        setTimeout(done);
      });
      player.play();
    });
  });

  describe('Prebid', () => {
    const preroll = [{url: ['PREBID_PRE_ROLL', 'PRE_ROLL'], prebid: {}}];
    const midroll = [{url: ['PREBID_MID_ROLL', 'MID_ROLL'], prebid: {}}];

    before(() => {
      config = Utils.Object.mergeDeep({}, getConfigStructure(), {
        advertising: {
          prebid: {libUrl: 'dummyUrl'}
        },
        plugins: {
          ima: {}
        }
      });
    });

    it('Should play Prebid as pre-roll', done => {
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            (player.currentTime === 0).should.be.true;
            ads.should.deep.equal(preroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 0, ads: [{url: ['PRE_ROLL'], prebid: {}}]}]
        }
      });
      sandbox.stub(player._adsController._prebidManager, '_isPrebidSDKLibLoaded').callsFake(function () {
        return true;
      });
      sandbox.stub(player._adsController._prebidManager, 'load').callsFake(function () {
        return Promise.resolve([{vastUrl: 'PREBID_PRE_ROLL'}]);
      });
      player.setMedia({sources: SourcesConfig.Mp4, session: {}, plugins: {}});
      player.play();
    });

    it('Should Prebid delay pre-roll until Prebid loaded', done => {
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            (player.currentTime === 0).should.be.true;
            ads.should.deep.equal(preroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 0, ads: [{url: ['PRE_ROLL'], prebid: {}}]}]
        }
      });
      sandbox.stub(player._adsController._prebidManager, '_isPrebidSDKLibLoaded').callsFake(function () {
        return true;
      });
      sandbox.stub(player._adsController._prebidManager, '_loadPrebidSDKLib').callsFake(function () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{vastUrl: 'PREBID_PRE_ROLL'}]);
          }, 3000);
        });
      });
      sandbox.stub(player._adsController._prebidManager, 'load').callsFake(function () {
        return Promise.resolve([{vastUrl: 'PREBID_PRE_ROLL'}]);
      });
      player.setMedia({sources: SourcesConfig.Mp4, session: {}, plugins: {}});
      player.play();
    });

    it('Should Prebid delay pre-roll until Prebid ad loaded', done => {
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            (player.currentTime === 0).should.be.true;
            ads.should.deep.equal(preroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 0, ads: [{url: ['PRE_ROLL'], prebid: {}}]}]
        }
      });
      sandbox.stub(player._adsController._prebidManager, '_isPrebidSDKLibLoaded').callsFake(function () {
        return true;
      });
      sandbox.stub(player._adsController._prebidManager, 'load').callsFake(function () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{vastUrl: 'PREBID_PRE_ROLL'}]);
          }, 3000);
        });
      });
      player.setMedia({sources: SourcesConfig.Mp4, session: {}, plugins: {}});
      player.play();
    });

    it('Should play Prebid as mid-roll', done => {
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            (Math.floor(player.currentTime) === 2).should.be.true;
            ads.should.deep.equal(midroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 2, ads: [{url: ['MID_ROLL'], prebid: {}}]}]
        }
      });
      sandbox.stub(player._adsController._prebidManager, '_isPrebidSDKLibLoaded').callsFake(function () {
        return true;
      });
      sandbox.stub(player._adsController._prebidManager, 'load').callsFake(function () {
        return Promise.resolve([{vastUrl: 'PREBID_MID_ROLL'}]);
      });
      player.setMedia({sources: SourcesConfig.Mp4, session: {}, plugins: {}});
      player.play();
    });

    it('Should delay play Prebid mid-roll until it loaded', done => {
      const fakeCtrl = {
        playAdNow: ads => {
          try {
            (Math.floor(player.currentTime) > 2).should.be.true;
            ads.should.deep.equal(midroll);
            done();
          } catch (e) {
            done(e);
          }
        }
      };
      sandbox.stub(player._controllerProvider, 'getAdsControllers').callsFake(function () {
        return [fakeCtrl];
      });
      player.configure({
        advertising: {
          adBreaks: [{position: 2, ads: [{url: ['MID_ROLL'], prebid: {}}]}]
        }
      });
      sandbox.stub(player._adsController._prebidManager, '_isPrebidSDKLibLoaded').callsFake(function () {
        return true;
      });
      sandbox.stub(player._adsController._prebidManager, 'load').callsFake(function () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([{vastUrl: 'PREBID_MID_ROLL'}]);
          }, 5000);
        });
      });
      player.setMedia({sources: SourcesConfig.Mp4, session: {}, plugins: {}});
      player.play();
    });
  });
});
