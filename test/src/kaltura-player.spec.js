import {setup} from '../../src/setup';
import * as TestUtils from './utils/test-utils';
import * as MediaMockData from './mock-data/media';
import * as PlaylistMockData from './mock-data/playlist';
import {PluginManager} from '../../src/common/plugins';
import ColorsPlugin from './common/plugin/test-plugins/colors-plugin';
import NumbersPlugin from './common/plugin/test-plugins/numbers-plugin';
import {KalturaPlayer as Player} from '../../src/kaltura-player';
import SourcesConfig from './configs/sources';
import {EventType as CoreEventType, FakeEvent, Utils, EventManager} from '@playkit-js/playkit-js';
import AsyncResolvePlugin from './common/plugin/test-plugins/async-resolve-plugin';
import AsyncRejectPlugin from './common/plugin/test-plugins/async-reject-plugin';
import {Provider} from 'playkit-js-providers';

const targetId = 'player-placeholder_kaltura-player.spec';

describe('kaltura player api', function () {
  let config, kalturaPlayer, sandbox;
  const partnerId = 1091;

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId
      }
    };
  });

  afterEach(function () {
    sandbox.restore();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  describe('constructor', function () {
    beforeEach(function () {
      kalturaPlayer = setup(config);
    });

    afterEach(function () {
      kalturaPlayer.destroy();
    });
    it('config.sources should be an empty object if no configured', function () {
      kalturaPlayer.config.sources.should.be.exist;
    });
  });
  describe('media api', function () {
    describe('loadMedia', function () {
      const entryId = '0_wifqaipd';

      beforeEach(function () {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getMediaConfig').callsFake(function (info) {
          const id = info.playlistId || info.entryId;
          return id
            ? Promise.resolve(MediaMockData.MediaConfig[id])
            : Promise.reject({
                success: false,
                data: 'Missing mandatory parameter'
              });
        });
      });

      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should get media by id from the provider and set it', function (done) {
        kalturaPlayer.loadMedia({playlistId: entryId}).then(mediaConfig => {
          mediaConfig.sources.id.should.equal(entryId);
          kalturaPlayer.config.sources.id.should.equal(entryId);
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function (done) {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadMedia({}).catch(error => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });

      it('should use the configured start time from loadMedia options', function (done) {
        kalturaPlayer.addEventListener(kalturaPlayer.Event.FIRST_PLAYING, () => {
          (kalturaPlayer.currentTime >= 10).should.be.true;
          done();
        });
        kalturaPlayer.loadMedia({entryId}, {startTime: 10}).then(() => kalturaPlayer.play());
      });

      it('should use the configured poster from loadMedia options', function (done) {
        const poster = 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg';
        kalturaPlayer.addEventListener(kalturaPlayer.Event.CHANGE_SOURCE_ENDED, () => {
          kalturaPlayer.poster.should.equal(poster);
          done();
        });
        kalturaPlayer.loadMedia({entryId}, {poster});
      });

      describe('maybeSetStreamPriority', function () {
        describe('media source mime type is video/youtube', function () {
          it('should add youtube to stream priority if not already set', function (done) {
            kalturaPlayer.loadMedia({entryId: 'Youtube'}).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.forEach(sp => {
                if (sp.engine === 'youtube') {
                  hasYoutube = true;
                }
              });
              try {
                hasYoutube.should.be.true;
                done();
              } catch (e) {
                done("youtube engine wasn't added to stream priority list");
              }
            });
          });
          it('should not add youtube to stream priority if already set', function (done) {
            kalturaPlayer.configure({
              playback: {
                streamPriority: [
                  {
                    engine: 'youtube',
                    format: 'progressive'
                  }
                ]
              }
            });
            kalturaPlayer.loadMedia({entryId: 'Youtube'}).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.length.should.equal(1);
              kalturaPlayer.config.playback.streamPriority.forEach(sp => {
                if (sp.engine === 'youtube') {
                  hasYoutube = true;
                }
              });
              try {
                hasYoutube.should.be.true;
                done();
              } catch (e) {
                done("youtube engine wasn't added to stream priority list");
              }
            });
          });
        });
        describe('media source mime type is not video/youtube', function () {
          it('should not add youtube to stream priority', function (done) {
            kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.forEach(sp => {
                if (sp.engine === 'youtube') {
                  hasYoutube = true;
                }
              });
              try {
                hasYoutube.should.be.false;
                done();
              } catch (e) {
                done('youtube engine was added to stream priority list');
              }
            });
          });
        });
      });
    });
  });

  describe('playlist api', function () {
    describe('loadPlaylist', function () {
      const playlistId = '0_wckoqjnn';

      beforeEach(function () {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getPlaylistConfig').callsFake(function (playlistInfo) {
          return playlistInfo.playlistId
            ? Promise.resolve(PlaylistMockData.playlistByID)
            : Promise.reject({success: false, data: 'Missing mandatory parameter'});
        });
      });

      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should get playlist by id from the provider and set it - without config', function (done) {
        kalturaPlayer.loadPlaylist({playlistId: playlistId}).then(playlistData => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          done();
        });
      });

      it('should get playlist by id from the provider and set it - with config', function (done) {
        kalturaPlayer.loadPlaylist({playlistId: playlistId}, {options: {autoContinue: false}}).then(playlistData => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function (done) {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadPlaylist({}).catch(error => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });
    });

    describe('loadPlaylistByEntryList', function () {
      beforeEach(function () {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getEntryListConfig').callsFake(function (entryList) {
          return entryList.entries
            ? Promise.resolve(PlaylistMockData.playlistByEntryList)
            : Promise.reject({success: false, data: 'Missing mandatory parameter'});
        });
      });

      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should get playlist by entry list from the provider and set it - without config', function (done) {
        kalturaPlayer.loadPlaylistByEntryList({entries: ['0_nwkp7jtx', '0_wifqaipd']}).then(playlistData => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          done();
        });
      });

      it('should get playlist by entry list from the provider and set it- with config', function (done) {
        kalturaPlayer.loadPlaylistByEntryList({entries: ['0_nwkp7jtx', '0_wifqaipd']}, {options: {autoContinue: false}}).then(playlistData => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function (done) {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadPlaylistByEntryList({}).catch(error => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });
    });

    describe('setPlaylist', function () {
      beforeEach(function () {
        kalturaPlayer = setup(config);
      });
      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should set the playlist and evaluate the plugins - without config and entry list', function () {
        kalturaPlayer.setPlaylist(PlaylistMockData.playlistByEntryList);
        kalturaPlayer.config.plugins.kava.playlistId.should.equal('a1234');
        kalturaPlayer.playlist.id.should.equal('a1234');
      });

      it('should set the playlist and evaluate the plugins - with config and entry list', function () {
        kalturaPlayer.setPlaylist(PlaylistMockData.playlistByEntryList, {options: {autoContinue: false}}, [
          {entryId: '0_nwkp7jtx'},
          {entryId: '0_wifqaipd'}
        ]);
        kalturaPlayer.config.plugins.kava.playlistId.should.equal('a1234');
        kalturaPlayer.playlist.id.should.equal('a1234');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer._playlistManager._mediaInfoList.length.should.equal(2);
      });
    });

    describe('load playlist by setup config', function () {
      beforeEach(function () {
        config.playlist = PlaylistMockData.playlistByConfig;
        kalturaPlayer = setup(config);
      });
      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', function () {
        kalturaPlayer.playlist.id.should.equal('b1234');
        kalturaPlayer.playlist.metadata.name.should.equal('my playlist name');
        kalturaPlayer.playlist.metadata.description.should.equal('my playlist desc');
        kalturaPlayer.playlist.poster.should.equal('http://cdntesting.qa.mkaltura.com/p/1091/sp/0/thumbnail/entry_id/0_wckoqjnn/version/100162');
        kalturaPlayer.playlist.items.length.should.equal(3);
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer._sourceSelected.should.be.true;
      });
    });

    describe('load playlist by configure', function () {
      beforeEach(function () {
        kalturaPlayer = setup(config);
      });
      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', function (done) {
        kalturaPlayer.addEventListener('kaltura-player-playlistloaded', event => {
          event.payload.playlist.id.should.equal('b1234');
          kalturaPlayer.playlist.id.should.equal('b1234');
          kalturaPlayer.playlist.metadata.name.should.equal('my playlist name');
          kalturaPlayer.playlist.metadata.description.should.equal('my playlist desc');
          kalturaPlayer.playlist.poster.should.equal('http://cdntesting.qa.mkaltura.com/p/1091/sp/0/thumbnail/entry_id/0_wckoqjnn/version/100162');
          kalturaPlayer.playlist.items.length.should.equal(3);
          kalturaPlayer.playlist.countdown.duration.should.equal(20);
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
        kalturaPlayer.configure({playlist: PlaylistMockData.playlistByConfig});
      });
    });

    describe('mix setup config and api', function () {
      beforeEach(function () {
        config.playlist = {
          countdown: {
            duration: 20,
            showing: true
          },
          options: {
            autoContinue: false
          }
        };
        kalturaPlayer = setup(config);
      });
      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', function () {
        kalturaPlayer.setPlaylist({id: 'a12345', items: []}, {countdown: {showing: false}});
        kalturaPlayer.playlist.id.should.equal('a12345');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer.playlist.countdown.showing.should.be.false;
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
      });
    });

    describe('mix configure and api', function () {
      beforeEach(function () {
        kalturaPlayer = setup(config);
      });
      afterEach(function () {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', function () {
        kalturaPlayer.configure({
          playlist: {
            countdown: {
              duration: 20,
              showing: true
            },
            options: {
              autoContinue: false
            }
          }
        });
        kalturaPlayer.setPlaylist({id: 'a12345', items: []}, {countdown: {showing: false}});
        kalturaPlayer.playlist.id.should.equal('a12345');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer.playlist.countdown.showing.should.be.false;
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
      });
    });
  });

  describe('plugins lifecycle', () => {
    let player;
    beforeEach(() => {
      PluginManager.register('colors', ColorsPlugin);
      PluginManager.register('numbers', NumbersPlugin);
    });

    afterEach(() => {
      PluginManager.unRegister('colors');
      PluginManager.unRegister('numbers');
    });

    it('should load 2 plugins on initial config and configure them on configure', function () {
      player = new Player({
        ui: {},
        provider: {},
        plugins: {
          colors: {
            size: 5
          },
          numbers: {
            size: 20
          }
        }
      });
      player._pluginManager.get('colors').should.exist;
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(2);
      player.config.plugins.colors.should.deep.equals({
        size: 5,
        favouriteColor: 'green'
      });
      player.config.plugins.numbers.should.deep.equals({
        size: 20,
        firstCellValue: 4,
        lastCellValue: 6
      });
      player.configure({
        plugins: {
          colors: {
            size: 50
          },
          numbers: {
            size: 200
          }
        }
      });
      player._pluginManager.get('colors').should.exist;
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(2);
      player.config.plugins.colors.should.deep.equals({
        size: 50,
        favouriteColor: 'green'
      });
      player.config.plugins.numbers.should.deep.equals({
        size: 200,
        firstCellValue: 4,
        lastCellValue: 6
      });
    });

    it('should load 1st plugin on initial config, load 2nd plugin and configure the 1st on configure', function () {
      player = new Player({
        ui: {},
        provider: {},
        plugins: {
          numbers: {
            size: 20
          }
        }
      });
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.numbers.should.deep.equals({
        size: 20,
        firstCellValue: 4,
        lastCellValue: 6
      });
      player.configure({
        plugins: {
          colors: {
            size: 50
          },
          numbers: {
            size: 200
          }
        }
      });
      player._pluginManager.get('colors').should.exist;
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(2);
      player.config.plugins.colors.should.deep.equals({
        size: 50,
        favouriteColor: 'green'
      });
      player.config.plugins.numbers.should.deep.equals({
        size: 200,
        firstCellValue: 4,
        lastCellValue: 6
      });
    });

    it('should create player without plugins, load plugins on configure', function () {
      player = new Player({
        ui: {},
        plugins: {},
        advertising: {
          adBreaks: []
        },
        provider: {}
      });
      Object.keys(player._pluginManager._plugins).length.should.equals(0);
      player.config.plugins.should.deep.equals({});
      player.configure({
        plugins: {
          colors: {
            size: 50
          },
          numbers: {
            size: 200
          }
        }
      });
      player._pluginManager.get('colors').should.exist;
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(2);
      player.config.plugins.colors.should.deep.equals({
        size: 50,
        favouriteColor: 'green'
      });
      player.config.plugins.numbers.should.deep.equals({
        size: 200,
        firstCellValue: 4,
        lastCellValue: 6
      });
    });

    it('should create player without plugins, load 1st plugin on configure, configure 1st plugin with/after sources', function () {
      player = new Player({
        ui: {},
        plugins: {},
        provider: {}
      });
      Object.keys(player._pluginManager._plugins).length.should.equals(0);
      player.config.plugins.should.deep.equals({});
      player.configure({
        plugins: {
          numbers: {
            size: 200
          }
        }
      });
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.numbers.should.deep.equals({
        size: 200,
        firstCellValue: 4,
        lastCellValue: 6
      });
      player.configure({
        plugins: {
          numbers: {
            size: 2,
            firstCellValue: 3
          }
        }
      });
      player.setMedia({
        sources: SourcesConfig.Mp4
      });
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.numbers.should.deep.equals({
        size: 2,
        firstCellValue: 3,
        lastCellValue: 6
      });
      player.configure({
        plugins: {
          numbers: {
            size: 78
          }
        }
      });
      player.config.plugins.numbers.should.deep.equals({
        size: 78,
        firstCellValue: 3,
        lastCellValue: 6
      });
    });

    it('should create player with plugin and fail to configure other plugin after sources', function () {
      player = new Player({
        ui: {},
        provider: {},
        sources: SourcesConfig.Mp4,
        plugins: {
          numbers: {
            size: 2,
            firstCellValue: 3
          }
        }
      });
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.should.deep.equals({
        numbers: {
          size: 2,
          firstCellValue: 3,
          lastCellValue: 6
        }
      });
      player.configure({
        plugins: {
          colors: {
            size: 200
          }
        }
      });
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.should.deep.equals({
        numbers: {
          size: 2,
          firstCellValue: 3,
          lastCellValue: 6
        }
      });
    });

    it('should create the plugin before playlist source selected', function () {
      const eventManager = new EventManager();
      player = new Player({
        ui: {},
        provider: {},
        playlist: {
          id: '1234',
          metdata: {},
          items: [
            {
              sources: SourcesConfig.Mp4
            }
          ]
        },
        plugins: {
          numbers: {
            size: 2,
            firstCellValue: 3
          }
        }
      });
      eventManager.listen(player, CoreEventType.SOURCE_SELECTED, () => {
        player._pluginManager.get('numbers').should.exist;
        Object.keys(player._pluginManager._plugins).length.should.equals(1);
        player.config.plugins.should.deep.equals({
          numbers: {
            size: 2,
            firstCellValue: 3,
            lastCellValue: 6
          }
        });
      });
    });

    it('should create player with plugin and fail to configure other plugin after playlist source selected', function () {
      player = new Player({
        ui: {},
        provider: {},
        playlist: {
          id: '1234',
          metdata: {},
          items: [
            {
              sources: SourcesConfig.Mp4
            }
          ]
        },
        plugins: {
          numbers: {
            size: 2,
            firstCellValue: 3
          }
        }
      });
      player._pluginManager.get('numbers').should.exist;
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.should.deep.equals({
        numbers: {
          size: 2,
          firstCellValue: 3,
          lastCellValue: 6
        }
      });
      player.configure({
        plugins: {
          colors: {
            size: 200
          }
        }
      });
      Object.keys(player._pluginManager._plugins).length.should.equals(1);
      player.config.plugins.should.deep.equals({
        numbers: {
          size: 2,
          firstCellValue: 3,
          lastCellValue: 6
        }
      });
    });
  });

  describe('async plugins loading', () => {
    let player;
    beforeEach(() => {
      PluginManager.register('asyncResolve', AsyncResolvePlugin);
      PluginManager.register('asyncReject', AsyncRejectPlugin);
    });

    afterEach(() => {
      PluginManager.unRegister('asyncResolve');
      PluginManager.unRegister('asyncReject');
      player.destroy();
    });

    it('should create player with async resolve plugin - check async load', done => {
      try {
        player = new Player({
          ui: {},
          provider: {},
          sources: SourcesConfig.Mp4,
          plugins: {
            asyncResolve: {}
          }
        });
        player._pluginManager.get('asyncResolve').should.exist;
        sinon.stub(player._localPlayer, '_load').callsFake(function () {
          player._pluginManager.get('asyncResolve').ready.then(() => {
            done();
          });
        });
        player.load();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async resolve plugin - check async play', done => {
      try {
        player = new Player({
          ui: {},
          provider: {},
          sources: SourcesConfig.Mp4,
          plugins: {
            asyncResolve: {}
          }
        });
        player._pluginManager.get('asyncResolve').should.exist;
        sinon.stub(player._localPlayer, '_play').callsFake(function () {
          player._pluginManager.get('asyncResolve').ready.then(() => {
            done();
          });
        });
        player.play();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async reject plugin - check async load', done => {
      try {
        player = new Player({
          ui: {},
          provider: {},
          sources: SourcesConfig.Mp4,
          plugins: {
            asyncReject: {}
          }
        });
        player._pluginManager.get('asyncReject').should.exist;
        sinon.stub(player._localPlayer, '_load').callsFake(function () {
          player._pluginManager.get('asyncReject').ready.catch(() => {
            done();
          });
        });
        player.load();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async reject plugin - check async play', done => {
      try {
        player = new Player({
          ui: {},
          provider: {},
          sources: SourcesConfig.Mp4,
          plugins: {
            asyncReject: {}
          }
        });
        player._pluginManager.get('asyncReject').should.exist;
        sinon.stub(player._localPlayer, '_play').callsFake(function () {
          player._pluginManager.get('asyncReject').ready.catch(() => {
            done();
          });
        });
        player.play();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async resolve plugin and reject plugin - check async play', done => {
      try {
        player = new Player({
          ui: {},
          provider: {},
          sources: SourcesConfig.Mp4,
          plugins: {
            asyncReject: {},
            asyncResolve: {}
          }
        });
        player._pluginManager.get('asyncReject').should.exist;
        player._pluginManager.get('asyncResolve').should.exist;
        sinon.stub(player._localPlayer, '_load').callsFake(function () {
          player._pluginManager.get('asyncResolve').ready.then(() => {
            player._pluginManager.get('asyncReject').ready.catch(() => {
              done();
            });
          });
        });
        player.load();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('events', function () {
    let player;

    it('should fire PLAYBACK_START on play', done => {
      player = new Player({
        ui: {},
        provider: {}
      });
      player.addEventListener(player.Event.PLAYBACK_START, () => {
        done();
      });
      player.play();
    });

    it('should fire PLAYBACK_START on autoplay', done => {
      player = new Player({
        ui: {},
        provider: {}
      });
      player.addEventListener(player.Event.PLAYBACK_START, () => {
        done();
      });
      player.configure({
        playback: {
          autoplay: true
        }
      });
      player.setMedia({
        sources: SourcesConfig.Mp4
      });
    });

    it('should fire auto play failed and show the poster once get AD_AUTOPLAY_FAILED', done => {
      player = new Player({
        ui: {},
        provider: {},
        playback: {
          autoplay: true
        }
      });
      player.addEventListener(player.Event.AUTOPLAY_FAILED, event => {
        try {
          player._localPlayer.posterManager._el.style.display.should.equal('');
          event.payload.error.should.equal('mock failure');
          done();
        } catch (e) {
          done(e);
        }
      });
      player.dispatchEvent(new FakeEvent(player.Event.AD_AUTOPLAY_FAILED, {error: 'mock failure'}));
    });
  });

  describe('evaluate plugins config', function () {
    beforeEach(() => {
      PluginManager.register('colors', ColorsPlugin);
    });

    afterEach(() => {
      PluginManager.unRegister('colors');
    });

    it('should pass deep object as plugin config', () => {
      const test = {a: {b: {c: 'd'}}};
      const config = {
        plugins: {
          colors: {
            prop: test
          }
        },
        ui: {},
        provider: {}
      };
      const player = new Player(config);
      player.getMediaConfig().plugins.should.deep.equals(config.plugins);
    });

    it('should pass class as plugin config', () => {
      const test = class Test {
        constructor() {}

        print() {}
      };
      const config = {
        plugins: {
          colors: {
            prop: test
          }
        },
        ui: {},
        provider: {}
      };
      const player = new Player(config);
      player.getMediaConfig().plugins.should.deep.equals(config.plugins);
    });

    it('should pass class instance as plugin config', done => {
      const test = class Test {
        constructor() {}

        check() {
          done();
        }
      };
      const config = {
        plugins: {
          colors: {
            prop: new test()
          }
        },
        ui: {},
        provider: {}
      };
      const player = new Player(config);
      player.getMediaConfig().plugins.should.deep.equals(config.plugins);
      player.plugins.colors.config.prop.check();
    });

    it('should pass function as plugin config', done => {
      const test = () => {
        done();
      };
      const config = {
        plugins: {
          colors: {
            prop: test
          }
        },
        ui: {},
        provider: {}
      };
      const player = new Player(config);
      player.getMediaConfig().plugins.should.deep.equals(config.plugins);
      player.plugins.colors.config.prop();
    });

    describe('changeMedia and multi players', function () {
      const config = {
        plugins: {},
        ui: {},
        provider: {}
      };
      let player;
      const entryId = '0_wifqaipd';
      const entryId2 = '0_nwkp7jtx';

      beforeEach(() => {
        player = new Player(Utils.Object.mergeDeep({}, config));
        player._configEvaluator._pluginConfigStore._config = {
          colors: {
            entryId: '{{entryId}}',
            partnerId: '{{partnerId}}',
            entryName: '{{entryName}}',
            entryType: '{{entryType}}'
          }
        };
        player.configure({
          plugins: {
            colors: {
              entryName: '{{entryType}}',
              entryType: 'custom'
            }
          }
        });
        sinon.stub(Provider.prototype, 'getMediaConfig').callsFake(info => {
          const id = info.playlistId || info.entryId;
          return id
            ? Promise.resolve(MediaMockData.MediaConfig[id])
            : Promise.reject({
                success: false,
                data: 'Missing mandatory parameter'
              });
        });
      });

      afterEach(() => {
        sandbox.restore();
        Provider.prototype.getMediaConfig.restore();
        player.destroy();
      });

      it('should evaluate the plugin config - first media', done => {
        player.loadMedia({entryId}).then(() => {
          try {
            player.plugins.colors.config.entryId.should.equals(entryId);
            player.plugins.colors.config.partnerId.should.equals(1091);
            player.plugins.colors.config.entryName.should.equals('Vod');
            player.plugins.colors.config.entryType.should.equals('custom');
            done();
          } catch (e) {
            done(e);
          }
        });
      });

      it('should evaluate the default plugin config - second media', done => {
        player.loadMedia({entryId}).then(() => {
          player.loadMedia({entryId: entryId2}).then(() => {
            try {
              player.plugins.colors.config.entryId.should.equals(entryId2);
              player.plugins.colors.config.partnerId.should.equals(1091);
              player.plugins.colors.config.entryName.should.equals('Live');
              player.plugins.colors.config.entryType.should.equals('custom');
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      it('should evaluate the configured plugin config - second media', done => {
        player.loadMedia({entryId}).then(() => {
          player.configure({
            plugins: {
              colors: {
                partnerId: '{{entryId}}',
                entryName: 'name'
              }
            }
          });
          player.loadMedia({entryId: entryId2}).then(() => {
            try {
              player.plugins.colors.config.entryId.should.equals(entryId2);
              player.plugins.colors.config.partnerId.should.equals(entryId2);
              player.plugins.colors.config.entryName.should.equals('name');
              player.plugins.colors.config.entryType.should.equals('custom');
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      it('should evaluate the plugin config - another player', done => {
        const player2 = new Player(
          Utils.Object.mergeDeep(
            {},
            {
              plugins: {
                colors: {}
              },
              ui: {},
              provider: {}
            }
          )
        );
        player2._configEvaluator._pluginConfigStore._config = {
          colors: {
            entryId: '{{entryId}}',
            partnerId: '{{partnerId}}'
          }
        };
        player2.loadMedia({entryId}).then(() => {
          try {
            player2.plugins.colors.config.entryId.should.equals(entryId);
            player2.plugins.colors.config.partnerId.should.equals(1091);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });
});
