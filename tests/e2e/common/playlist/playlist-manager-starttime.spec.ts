// @ts-nocheck
/**
 * Regression test for SUP-52309
 *
 * When a playlist entry is initially non-playable (empty hls/dash arrays), _setItem
 * calls loadMedia to hydrate full sources. The resolved mediaConfig.sources can carry
 * a startTime value from KalturaViewHistoryUserEntry. Before the fix, this value was
 * stored verbatim via updateItemSources and forwarded to setMedia on subsequent replays,
 * causing the entry to start at 00:15 instead of 00:00.
 */
import { KalturaPlayer } from '../../../../src/kaltura-player';
import { PlaylistManager } from '../../../../src/common/playlist/playlist-manager';
import { PlaylistEventType } from '../../../../src/common/playlist/playlist-event-type';

describe('PlaylistManager - startTime leak (SUP-52309)', () => {
  let kalturaPlayer, playlistManager, sandbox;
  const STALE_START_TIME = 15;

  const config = {
    ui: {},
    plugins: {},
    advertising: { adBreaks: [] },
    provider: {},
    playback: { autoplay: false }
  };

  const makeNonPlayableItem = (id) => ({
    sources: { id, hls: [], dash: [], progressive: [] }
  });

  const makeFullSources = (id, startTime) => ({
    session: { isAnonymous: true, partnerId: 1091, ks: '' },
    sources: {
      id,
      hls: [{ id: `${id}_hls`, url: `http://example.com/p/1091/playManifest/entryId/${id}/format/applehttp/a.m3u8`, mimetype: 'application/x-mpegURL' }],
      dash: [{ id: `${id}_dash`, url: `http://example.com/p/1091/playManifest/entryId/${id}/format/mpegdash/a.mpd`, mimetype: 'application/dash+xml' }],
      progressive: [],
      duration: 120,
      type: 'Vod',
      startTime
    }
  });

  before(() => {
    sandbox = sinon.createSandbox();
    kalturaPlayer = new KalturaPlayer(config);
  });

  beforeEach(() => {
    playlistManager = new PlaylistManager(kalturaPlayer, config);
    kalturaPlayer._eventManager.removeAll();
    kalturaPlayer.reset();
  });

  afterEach(() => {
    playlistManager.reset();
    playlistManager = null;
  });

  after(() => {
    sandbox.restore();
  });

  it('should NOT carry over startTime from a prior loadMedia response when replaying an item', (done) => {
    const entryId = '0_starttime_test';
    const capturedStartTimes = [];

    // Simulate provider returning startTime = 15 (KalturaViewHistoryUserEntry last-position)
    sinon.stub(kalturaPlayer, 'loadMedia').callsFake(() => {
      return Promise.resolve(makeFullSources(entryId, STALE_START_TIME));
    });

    // Spy on every setMedia call to record startTime values
    sinon.stub(kalturaPlayer, 'setMedia').callsFake((mediaConfig) => {
      if (mediaConfig && mediaConfig.sources) {
        capturedStartTimes.push(mediaConfig.sources.startTime);
      }
    });

    let eventCount = 0;
    kalturaPlayer._eventManager.listen(kalturaPlayer, PlaylistEventType.PLAYLIST_ITEM_CHANGED, () => {
      eventCount++;
      if (eventCount === 1) {
        // First play: loadMedia resolved, sources with startTime=15 stored on PlaylistItem.
        // Replay the item — now isPlayable() is true, so _setItem uses the direct setMedia path.
        kalturaPlayer._reset = false;
        playlistManager.playItem(0);
      } else if (eventCount === 2) {
        kalturaPlayer.setMedia.restore();
        kalturaPlayer.loadMedia.restore();
        try {
          // The replay setMedia call must NOT carry startTime = 15
          const replayStartTime = capturedStartTimes[capturedStartTimes.length - 1];
          (replayStartTime === undefined || replayStartTime === 0).should.be.true;
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    playlistManager.configure({
      id: 'sup-52309-test',
      items: [makeNonPlayableItem(entryId)],
      options: { autoContinue: false }
    });
  });
});
