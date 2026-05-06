// @ts-nocheck
/**
 * Regression test for SUP-52309
 *
 * Verifies that a startTime embedded in a loadMedia response (e.g. from KalturaViewHistoryUserEntry)
 * is NOT carried over to the next _setItem call for the same entry once its sources become playable.
 *
 * Root cause: PlaylistManager._setItem stored the full loadMedia response including startTime
 * via updateItemSources. On replay (when isPlayable() = true), setMedia was called directly
 * with the cached sources, forwarding the stale startTime to the player engine.
 *
 * Fix: delete mediaConfig.sources.startTime before updateItemSources caches the object.
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
    sources: {
      id,
      hls: [],
      dash: [],
      progressive: []
    }
  });

  const makeFullSources = (id, startTime) => ({
    session: { isAnonymous: true, partnerId: 1091, ks: '' },
    sources: {
      id,
      hls: [
        {
          id: `${id}_hls`,
          url: `http://example.com/p/1091/playManifest/entryId/${id}/format/applehttp/a.m3u8`,
          mimetype: 'application/x-mpegURL'
        }
      ],
      dash: [
        {
          id: `${id}_dash`,
          url: `http://example.com/p/1091/playManifest/entryId/${id}/format/mpegdash/a.mpd`,
          mimetype: 'application/dash+xml'
        }
      ],
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

    // Simulate provider returning startTime = 15 from KalturaViewHistoryUserEntry
    sinon.stub(kalturaPlayer, 'loadMedia').callsFake(() => {
      return Promise.resolve(makeFullSources(entryId, STALE_START_TIME));
    });

    // Capture every startTime value passed into setMedia
    sinon.stub(kalturaPlayer, 'setMedia').callsFake((mediaConfig) => {
      if (mediaConfig && mediaConfig.sources) {
        capturedStartTimes.push(mediaConfig.sources.startTime);
      }
    });

    let eventCount = 0;
    kalturaPlayer._eventManager.listen(kalturaPlayer, PlaylistEventType.PLAYLIST_ITEM_CHANGED, () => {
      eventCount++;
      if (eventCount === 1) {
        // First play: sources hydrated via loadMedia (non-playable path).
        // Sources are now cached on the PlaylistItem — replay to trigger the playable path.
        kalturaPlayer._reset = false;
        playlistManager.playItem(0);
      } else if (eventCount === 2) {
        kalturaPlayer.setMedia.restore();
        kalturaPlayer.loadMedia.restore();
        try {
          // On replay, setMedia is called directly with cached sources (playable path).
          // The fix ensures startTime was stripped before caching, so it must be absent here.
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
