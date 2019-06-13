import {KalturaPlayer} from '../../../../src/kaltura-player';
import {PlaylistManager} from '../../../../src/common/playlist/playlist-manager';
import * as MediaMockData from '../../mock-data/media';
import * as PlaylistMockData from '../../mock-data/playlist';
import {FakeEvent} from '@playkit-js/playkit-js';
import {PlaylistEventType} from '../../../../src/common/playlist/playlist-event-type';

describe('PlaylistManager', function() {
  let kalturaPlayer, playlistManager, sandbox;
  const config = {
    ui: {},
    provider: {},
    playback: {
      autoplay: true
    }
  };

  before(function() {
    sandbox = sinon.sandbox.create();
    kalturaPlayer = new KalturaPlayer(config);
  });

  beforeEach(function() {
    playlistManager = new PlaylistManager(kalturaPlayer, config);
  });

  afterEach(function() {
    playlistManager.reset();
    playlistManager = null;
    kalturaPlayer._eventManager.removeAll();
    kalturaPlayer.reset();
  });

  describe('configure', function() {
    it('should create a playlist manager with default values', function() {
      playlistManager._player.should.exist;
      playlistManager._eventManager.should.exist;
      playlistManager._playlist.should.exist;
      playlistManager._options.autoContinue.should.be.true;
      playlistManager._options.loop.should.be.false;
      playlistManager._countdown.duration.should.equal(10);
      playlistManager._countdown.showing.should.be.true;
      playlistManager._playerOptions.should.exist;
      playlistManager._mediaInfoList.length.should.equal(0);
    });

    it('should do nothing for empty config', function() {
      playlistManager.configure();
    });

    it('should update config', function() {
      playlistManager.configure({id: '1234', options: {autoContinue: false}, countdown: {duration: 20, showing: false, timeToShow: 50}});
      playlistManager._playlist.id.should.equal('1234');
      playlistManager._options.autoContinue.should.be.false;
      playlistManager._countdown.duration.should.equal(20);
      playlistManager._countdown.showing.should.be.false;
      playlistManager._countdown.timeToShow.should.equal(50);
    });

    it('should load playlist by config and fire event', function() {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_LOADED, event => {
        event.payload.playlist.id.should.equal('b1234');
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should not load playlist by config and fire event is no items', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_LOADED, () => {
        done(new Error('fail'));
      });
      playlistManager.configure();
      done();
    });

    it('should not load playlist by config and fire event is no sources', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_LOADED, () => {
        done(new Error('fail'));
      });
      playlistManager.configure({items: [{}]});
      done();
    });

    it('should update the media info list', function() {
      playlistManager.configure(PlaylistMockData.playlistByConfig, {entries: ['abc', {entryId: '123'}]});
      playlistManager._mediaInfoList.length.should.equal(3);
      playlistManager._mediaInfoList[0].entryId.should.equal('id1');
      playlistManager._mediaInfoList[1].entryId.should.equal('123');
      playlistManager._mediaInfoList[2].entryId.should.equal('id3');
    });

    it('should play the first item', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        done();
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should play next on ended when auto continue is true', function(done) {
      let eventCounter = 0;
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        eventCounter++;
        if (eventCounter === 2) {
          done();
        }
        playlistManager._options.autoContinue = true;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should play next on ended when loop is true', function(done) {
      let eventCounter = 0;
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        eventCounter++;
        if (eventCounter === 2) {
          done();
        }
        playlistManager._options.autoContinue = false;
        playlistManager._options.loop = true;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should not play next on ended when auto continue and loop is false', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        done();
        playlistManager._options.autoContinue = false;
        playlistManager._options.loop = false;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should not play next on ended when ui is enabled', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        done();
        playlistManager._options.autoContinue = true;
        playlistManager._options.loop = true;
        playlistManager._playerOptions.ui.disable = false;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should play next on ended when ui is enabled but countdown is hidden', function(done) {
      let eventCounter = 0;
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
        eventCounter++;
        if (eventCounter === 2) {
          done();
        }
        playlistManager._options.autoContinue = true;
        playlistManager._options.loop = true;
        playlistManager._playerOptions.ui.disable = false;
        playlistManager._countdown.showing = false;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should fire playlist ended event', function(done) {
      let onItemChanged = () => {
        playlistManager._options.autoContinue = true;
        playlistManager._options.loop = true;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      };
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ENDED, () => {
        kalturaPlayer._eventManager.unlisten(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
        done();
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should play in loop when loop is true', function(done) {
      let onItemChanged = () => {
        playlistManager._options.autoContinue = false;
        playlistManager._options.loop = true;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      };
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ENDED, () => {
        kalturaPlayer._eventManager.unlisten(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
        kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, e => {
          e.payload.index.should.equal(0);
          done();
        });
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });

    it('should not play in loop when loop is false', function(done) {
      let onItemChanged = () => {
        playlistManager._options.autoContinue = true;
        playlistManager._options.loop = false;
        playlistManager._playerOptions.ui.disable = true;
        kalturaPlayer.dispatchEvent(new FakeEvent(kalturaPlayer.Event.Core.PLAYBACK_ENDED));
      };
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
      kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ENDED, () => {
        kalturaPlayer._eventManager.unlisten(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, onItemChanged);
        done();
        kalturaPlayer._eventManager.listen(kalturaPlayer, kalturaPlayer.Event.Playlist.PLAYLIST_ITEM_CHANGED, () => {
          done(new Error('fail'));
        });
      });
      playlistManager.configure(PlaylistMockData.playlistByConfig);
    });
  });

  describe('load', function() {
    it('should merge the playlist data and config', function() {
      const playlistConfig = {
        options: {
          autoContinue: false
        },
        countdown: {
          timeToShow: 30,
          duration: 20,
          showing: false
        },
        items: [
          {
            config: {
              countdown: {
                timeToShow: 40,
                duration: 5,
                showing: true
              }
            }
          },
          {
            sources: {
              hls: [{url: 'source_url'}],
              poster: 'poster_url',
              dvr: true
            }
          }
        ]
      };
      playlistManager.load(PlaylistMockData.playlistByID, playlistConfig, {entries: [{entryId: '123'}]});
      playlistManager._playlist.id.should.equal('0_wckoqjnn');
      playlistManager._playlist.metadata.name.should.equal('Playlist_VOD_Only');
      playlistManager._playlist.poster.should.equal('http://cdntesting.qa.mkaltura.com/p/1091/sp/0/thumbnail/entry_id/0_wckoqjnn/version/100162');
      playlistManager._playlist.items[0]._sources.id.should.equal('0_fu4ifhie');
      playlistManager._playlist.items[0]._config.countdown.timeToShow.should.be.equal(40);
      playlistManager._playlist.items[0]._config.countdown.duration.should.be.equal(5);
      playlistManager._playlist.items[0]._config.countdown.showing.should.be.true;
      playlistManager._playlist.items[1]._sources.id.should.equal('0_15xrxwvo');
      playlistManager._playlist.items[1]._sources.hls[0].url.should.equal('source_url');
      playlistManager._playlist.items[1]._sources.poster.should.equal('poster_url');
      playlistManager._playlist.items[1]._sources.dvr.should.be.true;
      (playlistManager._playlist.items[1]._config === undefined).should.be.true;
      playlistManager._options.autoContinue.should.be.false;
      playlistManager._countdown.timeToShow.should.be.equal(30);
      playlistManager._countdown.duration.should.be.equal(20);
      playlistManager._countdown.showing.should.be.false;
      playlistManager._mediaInfoList[0].entryId.should.equal('123');
    });
  });

  describe('reset', function() {
    it('should reset but keep the previous config', function() {
      playlistManager.configure({
        id: '1234',
        items: [
          {
            sources: {
              hls: [{url: 'source_url'}],
              poster: 'poster_url',
              dvr: true
            }
          }
        ],
        options: {autoContinue: false},
        countdown: {duration: 20, showing: false, timeToShow: 50}
      });
      playlistManager._playlist.id.should.equal('1234');
      playlistManager._playlist.items.length.should.equal(1);
      playlistManager._mediaInfoList.length.should.equal(1);
      playlistManager._options.autoContinue.should.be.false;
      playlistManager._countdown.duration.should.equal(20);
      playlistManager._countdown.showing.should.be.false;
      playlistManager._countdown.timeToShow.should.equal(50);
      playlistManager.reset();
      playlistManager._playlist.id.should.equal('');
      playlistManager._playlist.items.length.should.equal(0);
      playlistManager._mediaInfoList.length.should.equal(0);
      playlistManager._options.autoContinue.should.be.false;
      playlistManager._countdown.duration.should.equal(20);
      playlistManager._countdown.showing.should.be.false;
    });
  });

  describe('get next', function() {
    it('should get the second item', function() {
      playlistManager.configure({
        id: '1234',
        items: [
          {
            sources: {
              id: 'id1'
            }
          },
          {
            sources: {
              id: 'id2'
            }
          }
        ]
      });
      playlistManager.next.sources.id.should.equal('id2');
    });

    it('should get null when in the last item and loop is false', function() {
      playlistManager.configure({
        id: '1234',
        items: [
          {
            sources: {
              id: 'id1'
            }
          },
          {
            sources: {
              id: 'id2'
            }
          }
        ]
      });
      playlistManager.playNext();
      (playlistManager.next === null).should.be.true;
    });

    it('should get the first item when in the last item and loop is true', function() {
      playlistManager.configure({
        id: '1234',
        items: [
          {
            sources: {
              id: 'id1'
            }
          },
          {
            sources: {
              id: 'id2'
            }
          }
        ],
        options: {
          loop: true
        }
      });
      playlistManager.playNext();
      playlistManager.next.sources.id.should.equal('id1');
    });
  });

  describe('playNext', function() {
    before(function() {
      sinon.stub(kalturaPlayer, 'loadMedia').callsFake(function({entryId}) {
        return Promise.resolve(MediaMockData.MediaConfig[entryId]);
      });
    });

    beforeEach(function() {
      playlistManager.load(PlaylistMockData.playlistByEntryList);
    });

    after(function() {
      sandbox.restore();
    });

    it('should call playNext automatically once the playlist loaded', function(done) {
      kalturaPlayer._eventManager.listen(kalturaPlayer, PlaylistEventType.PLAYLIST_ITEM_CHANGED, () => {
        done();
      });
    });

    it('should call playNext programmatically', function(done) {
      let eventCounter = 0;
      kalturaPlayer._eventManager.listen(kalturaPlayer, PlaylistEventType.PLAYLIST_ITEM_CHANGED, () => {
        if (eventCounter === 2) {
          done();
        }
        eventCounter++;
        playlistManager.playNext();
      });
    });
  });
});
