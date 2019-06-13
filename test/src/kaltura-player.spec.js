import {setup} from '../../src/setup';
import * as TestUtils from './utils/test-utils';
import * as MediaMockData from './mock-data/media';
import * as PlaylistMockData from './mock-data/playlist';

const targetId = 'player-placeholder_kaltura-player.spec';

describe('kaltura player api', function() {
  let config, kalturaPlayer, sandbox;
  const partnerId = 1091;

  before(function() {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
    TestUtils.removeElement(targetId);
  });

  describe('media api', function() {
    describe('loadMedia', function() {
      const entryId = '0_wifqaipd';

      beforeEach(function() {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getMediaConfig').callsFake(function(info) {
          const id = info.playlistId || info.entryId;
          return id ? Promise.resolve(MediaMockData.MediaConfig[id]) : Promise.reject({success: false, data: 'Missing mandatory parameter'});
        });
      });

      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should get media by id from the provider and set it', function(done) {
        kalturaPlayer.loadMedia({playlistId: entryId}).then(mediaConfig => {
          mediaConfig.sources.id.should.equal(entryId);
          kalturaPlayer.config.sources.id.should.equal(entryId);
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function(done) {
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

      describe('maybeSetStreamPriority', function() {
        describe('media source mime type is video/youtube', function() {
          it('should add youtube to stream priority if not already set', function(done) {
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
          it('should not add youtube to stream priority if already set', function(done) {
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
        describe('media source mime type is not video/youtube', function() {
          it('should not add youtube to stream priority', function(done) {
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

  describe('playlist api', function() {
    describe('loadPlaylist', function() {
      const playlistId = '0_wckoqjnn';

      beforeEach(function() {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getPlaylistConfig').callsFake(function(playlistInfo) {
          return playlistInfo.playlistId
            ? Promise.resolve(PlaylistMockData.playlistByID)
            : Promise.reject({success: false, data: 'Missing mandatory parameter'});
        });
      });

      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should get playlist by id from the provider and set it - without config', function(done) {
        kalturaPlayer.loadPlaylist({playlistId: playlistId}).then(playlistData => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          done();
        });
      });

      it('should get playlist by id from the provider and set it - with config', function(done) {
        kalturaPlayer.loadPlaylist({playlistId: playlistId}, {options: {autoContinue: false}}).then(playlistData => {
          playlistData.id.should.equal(playlistId);
          kalturaPlayer.playlist.id.should.equal(playlistData.id);
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function(done) {
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

    describe('loadPlaylistByEntryList', function() {
      beforeEach(function() {
        kalturaPlayer = setup(config);
        sinon.stub(kalturaPlayer._provider, 'getEntryListConfig').callsFake(function(entryList) {
          return entryList.entries
            ? Promise.resolve(PlaylistMockData.playlistByEntryList)
            : Promise.reject({success: false, data: 'Missing mandatory parameter'});
        });
      });

      afterEach(() => {
        kalturaPlayer.destroy();
      });

      it('should get playlist by entry list from the provider and set it - without config', function(done) {
        kalturaPlayer.loadPlaylistByEntryList({entries: ['0_nwkp7jtx', '0_wifqaipd']}).then(playlistData => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          done();
        });
      });

      it('should get playlist by entry list from the provider and set it- with config', function(done) {
        kalturaPlayer.loadPlaylistByEntryList({entries: ['0_nwkp7jtx', '0_wifqaipd']}, {options: {autoContinue: false}}).then(playlistData => {
          playlistData.id.should.equal('a1234');
          kalturaPlayer.playlist.id.should.equal('a1234');
          kalturaPlayer.playlist.options.autoContinue.should.be.false;
          done();
        });
      });

      it('should reject and throw an error when the provider request failed', function(done) {
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

    describe('setPlaylist', function() {
      beforeEach(function() {
        kalturaPlayer = setup(config);
      });
      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should set the playlist and evaluate the plugins - without config and entry list', function() {
        kalturaPlayer.setPlaylist(PlaylistMockData.playlistByEntryList);
        kalturaPlayer.config.plugins.kava.playlistId.should.equal('a1234');
        kalturaPlayer.playlist.id.should.equal('a1234');
      });

      it('should set the playlist and evaluate the plugins - with config and entry list', function() {
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

    describe('load playlist by setup config', function() {
      beforeEach(function() {
        config.playlist = PlaylistMockData.playlistByConfig;
        kalturaPlayer = setup(config);
      });
      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', function() {
        kalturaPlayer.playlist.id.should.equal('b1234');
        kalturaPlayer.playlist.metadata.name.should.equal('my playlist name');
        kalturaPlayer.playlist.metadata.description.should.equal('my playlist desc');
        kalturaPlayer.playlist.poster.should.equal('http://cdntesting.qa.mkaltura.com/p/1091/sp/0/thumbnail/entry_id/0_wckoqjnn/version/100162');
        kalturaPlayer.playlist.items.length.should.equal(3);
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
      });
    });

    describe('load playlist by configure', function() {
      beforeEach(function() {
        kalturaPlayer = setup(config);
      });
      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should set the configured playlist', function(done) {
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

    describe('mix setup config and api', function() {
      beforeEach(function() {
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
      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', function() {
        kalturaPlayer.setPlaylist({id: 'a12345', items: []}, {countdown: {showing: false}});
        kalturaPlayer.playlist.id.should.equal('a12345');
        kalturaPlayer.playlist.options.autoContinue.should.be.false;
        kalturaPlayer.playlist.countdown.showing.should.be.false;
        kalturaPlayer.playlist.countdown.duration.should.equal(20);
      });
    });

    describe('mix configure and api', function() {
      beforeEach(function() {
        kalturaPlayer = setup(config);
      });
      afterEach(function() {
        kalturaPlayer.destroy();
      });

      it('should load the playlist with the preset config', function() {
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
});
