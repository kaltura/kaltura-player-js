// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { setup } from '../../src';
import * as TestUtils from '../utils/test-utils';
import * as MediaMockData from './mock-data/media';
import * as PlaylistMockData from './mock-data/playlist';
import { PluginManager } from '../../src/common/plugins';
import ColorsPlugin from './common/plugin/test-plugins/colors-plugin';
import NumbersPlugin from './common/plugin/test-plugins/numbers-plugin';
import { KalturaPlayer as Player } from '../../src/kaltura-player';
import SourcesConfig from './configs/sources.json';
import { EventType as CoreEventType, FakeEvent, Utils, EventManager } from '@playkit-js/playkit-js';
import AsyncResolvePlugin from './common/plugin/test-plugins/async-resolve-plugin';
import AsyncRejectPlugin from './common/plugin/test-plugins/async-reject-plugin';
import { Provider } from '@playkit-js/playkit-js-providers';
import { Images } from './mock-data/images';

const targetId = 'player-placeholder_kaltura-player.spec';

describe('kaltura player api', () => {
  let config, kalturaPlayer, sandbox;
  const partnerId = 1091;

  before(() => {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId
      }
    };
  });

  afterEach(() => {
    sandbox.restore();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(() => {
    TestUtils.removeElement(targetId);
  });

  describe('constructor', () => {
    beforeEach(() => {
      kalturaPlayer = setup(config);
    });

    afterEach(() => {
      kalturaPlayer.destroy();
    });
    it('config.sources should be an empty object if no configured', () => {
      kalturaPlayer.config.sources.should.be.exist;
    });
  });
  describe('media api', () => {
    describe('loadMedia', () => {
      const entryId = '0_wifqaipd';

      beforeEach(() => {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getMediaConfig').callsFake((info) => {
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
        kalturaPlayer.destroy();
      });

      it('should get media by id from the provider and set it', (done) => {
        kalturaPlayer.loadMedia({ playlistId: entryId }).then((mediaConfig) => {
          mediaConfig.sources.id.should.equal(entryId);
          kalturaPlayer.config.sources.id.should.equal(entryId);
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', (done) => {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadMedia({}).catch((error) => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });

      it('should use the configured start time from loadMedia options', (done) => {
        kalturaPlayer.addEventListener(kalturaPlayer.Event.FIRST_PLAYING, () => {
          (kalturaPlayer.currentTime >= 10).should.be.true;
          done();
        });
        kalturaPlayer.loadMedia({ entryId }, { startTime: 10 }).then(() => kalturaPlayer.play());
      });

      it('should use the configured poster from loadMedia options', (done) => {
        const poster = Images.POSTER;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.CHANGE_SOURCE_ENDED, () => {
          kalturaPlayer.poster.should.equal(poster);
          done();
        });
        kalturaPlayer.loadMedia({ entryId }, { poster });
      });

      it('the reset stat should be false whenever an error occurs', (done) => {
        kalturaPlayer._reset.should.be.true;
        kalturaPlayer.loadMedia({}).catch(() => {
          kalturaPlayer._reset.should.be.false;
          done();
        });
      });

      describe('maybeSetStreamPriority', () => {
        describe('media source mime type is video/youtube', () => {
          it('should add youtube to stream priority if not already set', (done) => {
            kalturaPlayer.loadMedia({ entryId: 'Youtube' }).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.forEach((sp) => {
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
          it('should not add youtube to stream priority if already set', (done) => {
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
            kalturaPlayer.loadMedia({ entryId: 'Youtube' }).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.length.should.equal(1);
              kalturaPlayer.config.playback.streamPriority.forEach((sp) => {
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
        describe('media source mime type is not video/youtube', () => {
          it('should not add youtube to stream priority', (done) => {
            kalturaPlayer.loadMedia({ entryId: entryId }).then(() => {
              let hasYoutube = false;
              kalturaPlayer.config.playback.streamPriority.forEach((sp) => {
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
    describe('setMedia', () => {
      const mediaWithUserSession = {
        sources: {
          dash: [
            {
              id: '0_nwkp7jtx_301,mpegdash',
              url: 'http://qa-apache-php7.dev.kaltura.com/p/1091/sp/109100/playManifest/entryId/0_nwkp7jtx/protocol/http/format/mpegdash/flavorIds/0_iju7j519,0_98mlrldo,0_5hts3h5r,0_n6n76xp9/a.mpd',
              mimetype: 'application/dash+xml'
            }
          ]
        },
        session: {
          isAnonymous: false,
          ks: 'test-ks'
        }
      };
      describe('shouldAddKs', () => {
        describe('loadThumbnailWithKs is false', () => {
          beforeEach(() => {
            config.provider.loadThumbnailWithKs = false;
            kalturaPlayer = setup(config);
          });
          afterEach(() => {
            kalturaPlayer.destroy();
          });
          describe('session not set', () => {
            it('should return false when session not set', () => {
              kalturaPlayer.shouldAddKs().should.equals(false);
            });
          });
          describe('anonymous session', () => {
            it('should return false when loadThumbnailWithKs is false', () => {
              kalturaPlayer.setMedia(MediaMockData.MediaConfig['0_wifqaipd']);
              kalturaPlayer.shouldAddKs().should.equals(false);
              kalturaPlayer.shouldAddKs(mediaWithUserSession).should.equals(false);
            });
          });
          describe('user session', () => {
            it('should return false when loadThumbnailWithKs is false', () => {
              kalturaPlayer.setMedia(mediaWithUserSession);
              kalturaPlayer.shouldAddKs().should.equals(false);
              kalturaPlayer.shouldAddKs(mediaWithUserSession).should.equals(false);
            });
          });
        });

        describe('loadThumbnailWithKs is true', () => {
          beforeEach(() => {
            config.provider.loadThumbnailWithKs = true;
            kalturaPlayer = setup(config);
          });
          afterEach(() => {
            config.provider.loadThumbnailWithKs = false;
            kalturaPlayer.destroy();
          });
          describe('session not set', () => {
            it('should return false when session not set', () => {
              kalturaPlayer.shouldAddKs().should.equals(false);
            });
          });
          describe('anonymous session', () => {
            it('should return false for anonymous session when called without mediaConfig parameter', () => {
              kalturaPlayer.setMedia(MediaMockData.MediaConfig['0_wifqaipd']);
              kalturaPlayer.shouldAddKs().should.equals(false);
            });
            it('should return false for anonymous session when called with mediaConfig parameter', () => {
              kalturaPlayer.setMedia(mediaWithUserSession);
              kalturaPlayer.shouldAddKs(MediaMockData.MediaConfig['0_wifqaipd']).should.equals(false);
            });
          });
          describe('user session', () => {
            it('should return true for user session when called without mediaConfig parameter', () => {
              kalturaPlayer.setMedia(mediaWithUserSession);
              kalturaPlayer.shouldAddKs().should.equals(true);
            });
            it('should return true for user session when called with mediaConfig parameter', () => {
              kalturaPlayer.setMedia(MediaMockData.MediaConfig['0_wifqaipd']);
              kalturaPlayer.shouldAddKs(mediaWithUserSession).should.equals(true);
            });
          });
        });
      });
    });
    describe('selectedSource', () => {
      beforeEach(() => {
        kalturaPlayer = setup(config);
      });

      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should get the selectedSource', (done) => {
        kalturaPlayer.addEventListener(kalturaPlayer.Event.SOURCE_SELECTED, (event) => {
          kalturaPlayer.selectedSource.should.equal(event.payload.selectedSource[0]);
          done();
        });
        kalturaPlayer.setMedia({ sources: SourcesConfig.Mp4 });
        kalturaPlayer.selectedSource.should.equal(kalturaPlayer.sources.progressive[0]);
      });
    });
    describe('setSourcesMetadata', () => {
      const entryId = '0_wifqaipd';
      beforeEach(() => {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getMediaConfig').callsFake((info) => {
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
        kalturaPlayer.destroy();
      });

      it('should set the sources metadata with the provided epgId', (done) => {
        kalturaPlayer.loadMedia({ entryId }).then(() => {
          kalturaPlayer.configure({ sources: { metadata: { epgId: '54321' } } });
          kalturaPlayer.setSourcesMetadata({ epgId: '12345' });
          try {
            kalturaPlayer.config.sources.metadata.epgId.should.equals('12345');
            kalturaPlayer.sources.metadata.epgId.should.equals('12345');
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  });

  describe('playlist api', () => {
    describe('loadPlaylist', () => {
      const playlistId = '0_wckoqjnn';

      beforeEach(() => {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getPlaylistConfig').callsFake((playlistInfo) => {
          return playlistInfo.playlistId ? Promise.resolve(PlaylistMockData.playlistByID) : Promise.reject({ success: false, data: 'Missing mandatory parameter' });
        });
      });

      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should get playlist by id from the provider and set it - without config', (done) => {
        kalturaPlayer.loadPlaylist({ playlistId: playlistId }).then((playlistData) => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          done();
        });
      });

      it('should get playlist by id from the provider and set it - with config', (done) => {
        kalturaPlayer.loadPlaylist({ playlistId: playlistId }, { options: { autoContinue: false } }).then((playlistData) => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', (done) => {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadPlaylist({}).catch((error) => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });
    });

    describe('loadPlaylistByEntryList', () => {
      beforeEach(() => {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getEntryListConfig').callsFake((entryList) => {
          return entryList.entries ? Promise.resolve(PlaylistMockData.playlistByEntryList) : Promise.reject({ success: false, data: 'Missing mandatory parameter' });
        });
      });

      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should get playlist by entry list from the provider and set it - without config', (done) => {
        kalturaPlayer.loadPlaylistByEntryList({ entries: ['0_nwkp7jtx', '0_wifqaipd'] }).then((playlistData) => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          done();
        });
      });

      it('should get playlist by entry list from the provider and set it- with config', (done) => {
        kalturaPlayer.loadPlaylistByEntryList({ entries: ['0_nwkp7jtx', '0_wifqaipd'] }, { options: { autoContinue: false } }).then((playlistData) => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', (done) => {
        let errorEventTriggered = false;
        kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
          errorEventTriggered = true;
        });
        kalturaPlayer.loadPlaylistByEntryList({}).catch((error) => {
          error.data.should.equal('Missing mandatory parameter');
          error.success.should.be.false;
          errorEventTriggered.should.be.true;
          done();
        });
      });
    });

    describe('setPlaylist', () => {
      beforeEach(() => {
        kalturaPlayer = setup(config);
      });
      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should set the playlist and evaluate the plugins - without config and entry list', () => {
        kalturaPlayer.setPlaylist(PlaylistMockData.playlistByEntryList);
        kalturaPlayer.config.plugins.kava.playlistId.should.equal('a1234');
        kalturaPlayer.playlist.id.should.equal('a1234');
      });

      it('should set the playlist and evaluate the plugins - with config and entry list', () => {
        kalturaPlayer.setPlaylist(PlaylistMockData.playlistByEntryList, { options: { autoContinue: false } }, [{ entryId: '0_nwkp7jtx' }, { entryId: '0_wifqaipd' }]);
        kalturaPlayer.config.plugins.kava.playlistId.should.equal('a1234');
        kalturaPlayer.playlist.id.should.equal('a1234');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer._playlistManager._mediaInfoList.length.should.equal(2);
      });
    });

    describe('load playlist by setup config', () => {
      beforeEach(() => {
        config.playlist = PlaylistMockData.playlistByConfig;
        kalturaPlayer = setup(config);
      });
      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', () => {
        kalturaPlayer.playlist.id.should.equal('b1234');
        kalturaPlayer.playlist.metadata.name.should.equal('my playlist name');
        kalturaPlayer.playlist.metadata.description.should.equal('my playlist desc');
        kalturaPlayer.playlist.poster.should.equal('http://cdntesting.qa.mkaltura.com/p/1091/sp/0/thumbnail/entry_id/0_wckoqjnn/version/100162');
        kalturaPlayer.playlist.items.length.should.equal(3);
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        (kalturaPlayer.selectedSource === null).should.be.false;
      });
    });

    describe('load playlist by configure', () => {
      beforeEach(() => {
        kalturaPlayer = setup(config);
      });
      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', (done) => {
        kalturaPlayer.addEventListener('kaltura-player-playlistloaded', (event) => {
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
        kalturaPlayer.configure({ playlist: PlaylistMockData.playlistByConfig });
      });
    });

    describe('mix setup config and api', () => {
      beforeEach(() => {
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
      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', () => {
        kalturaPlayer.setPlaylist({ id: 'a12345', items: [] }, { countdown: { showing: false } });
        kalturaPlayer.playlist.id.should.equal('a12345');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer.playlist.countdown.showing.should.be.false;
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
      });
    });

    describe('mix configure and api', () => {
      beforeEach(() => {
        kalturaPlayer = setup(config);
      });
      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', () => {
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
        kalturaPlayer.setPlaylist({ id: 'a12345', items: [] }, { countdown: { showing: false } });
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

    it('should load 2 plugins on initial config and configure them on configure', () => {
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

    it('should load 1st plugin on initial config, load 2nd plugin and configure the 1st on configure', () => {
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

    it('should create player without plugins, load plugins on configure', () => {
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

    it('should create player without plugins, load 1st plugin on configure, configure 1st plugin with/after sources', () => {
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

    it('should create player with plugin and fail to configure other plugin after sources', () => {
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

    it('should create the plugin before playlist source selected', () => {
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

    it('should create player with plugin and fail to configure other plugin after playlist source selected', () => {
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

    it('should create player with async resolve plugin - check async load', (done) => {
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
        sinon.stub(player._localPlayer, '_load').callsFake(() => {
          player._pluginManager.get('asyncResolve').ready.then(() => {
            done();
          });
        });
        player.load();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async resolve plugin - check async play', (done) => {
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
        sinon.stub(player._localPlayer, '_play').callsFake(() => {
          player._pluginManager.get('asyncResolve').ready.then(() => {
            done();
          });
        });
        player.play();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async reject plugin - check async load', (done) => {
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
        sinon.stub(player._localPlayer, '_load').callsFake(() => {
          player._pluginManager.get('asyncReject').ready.catch(() => {
            done();
          });
        });
        player.load();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async reject plugin - check async play', (done) => {
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
        sinon.stub(player._localPlayer, '_play').callsFake(() => {
          player._pluginManager.get('asyncReject').ready.catch(() => {
            done();
          });
        });
        player.play();
      } catch (e) {
        done(e);
      }
    });

    it('should create player with async resolve plugin and reject plugin - check async play', (done) => {
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
        sinon.stub(player._localPlayer, '_load').callsFake(() => {
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

  describe('events', () => {
    let player;

    it('should fire PLAYBACK_START on play', (done) => {
      player = new Player({
        ui: {},
        provider: {}
      });
      player.addEventListener(player.Event.PLAYBACK_START, () => {
        done();
      });
      player.play();
    });

    it('should fire PLAYBACK_START on autoplay', (done) => {
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

    it('should fire auto play failed and show the poster once get AD_AUTOPLAY_FAILED', (done) => {
      player = new Player({
        ui: {},
        provider: {},
        playback: {
          autoplay: true
        }
      });
      player.addEventListener(player.Event.AUTOPLAY_FAILED, (event) => {
        try {
          player._localPlayer.posterManager._el.style.display.should.equal('');
          event.payload.error.should.equal('mock failure');
          done();
        } catch (e) {
          done(e);
        }
      });
      player.dispatchEvent(new FakeEvent(player.Event.AD_AUTOPLAY_FAILED, { error: 'mock failure' }));
    });
  });

  describe('evaluate plugins config', () => {
    beforeEach(() => {
      PluginManager.register('colors', ColorsPlugin);
    });

    afterEach(() => {
      PluginManager.unRegister('colors');
    });

    it('should pass deep object as plugin config', () => {
      const test = { a: { b: { c: 'd' } } };
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

        public print(): any {}
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

    it('should pass class instance as plugin config', (done) => {
      const test = class Test {
        constructor() {}

        public check(): any {
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

    it('should pass function as plugin config', (done) => {
      const test = (): any => {
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

    describe('changeMedia and multi players', () => {
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
        sinon.stub(Provider.prototype, 'getMediaConfig').callsFake((info) => {
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

      it('should evaluate the plugin config - first media', (done) => {
        player.loadMedia({ entryId }).then(() => {
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

      it('should evaluate the default plugin config - second media', (done) => {
        player.loadMedia({ entryId }).then(() => {
          player.loadMedia({ entryId: entryId2 }).then(() => {
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

      it('should plugin from setMedia be available after sources selected', () => {
        PluginManager.register('numbers', NumbersPlugin);
        player.setMedia({ sources: SourcesConfig.Mp4, plugins: { numbers: {} } });
        (player.plugins.numbers !== undefined).should.be.true;
        (player.plugins.numbers !== null).should.be.true;
        player.plugins.numbers.should.be.instanceOf(NumbersPlugin);
        PluginManager.unRegister('numbers', NumbersPlugin);
      });

      it('should evaluate the plugin config on source selected', (done) => {
        player.addEventListener(player.Event.SOURCE_SELECTED, () => {
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
        player.loadMedia({ entryId });
      });

      it('should evaluate the configured plugin config - second media', (done) => {
        player.loadMedia({ entryId }).then(() => {
          player.configure({
            plugins: {
              colors: {
                partnerId: '{{entryId}}',
                entryName: 'name'
              }
            }
          });
          player.loadMedia({ entryId: entryId2 }).then(() => {
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

      it('should evaluate the plugin config - another player', (done) => {
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
        player2.loadMedia({ entryId }).then(() => {
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
