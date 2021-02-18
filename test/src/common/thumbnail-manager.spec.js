import {MediaType} from '@playkit-js/playkit-js';
import {DefaultThumbnailConfig, ThumbnailManager} from '../../../src/common/thumbnail-manager';

describe('ThumbnailManager', () => {
  let thumbnailManager, fakePlayer, fakeMediaConfig, sandbox;
  const fakeSeekbarConfig = {
    thumbsSlices: 200,
    thumbsWidth: 100
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fakePlayer = {
      config: {ui: {}},
      getThumbnail: () => {}
    };
    fakeMediaConfig = {
      sources: {
        poster: '//my-thumb-service.com/p/1/thumbnail/entry_id/2/version/3',
        type: MediaType.VOD
      },
      session: {
        ks: 'my-ks'
      }
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get thumbnail slices url with default params', () => {
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager
      .getKalturaThumbnailConfig()
      .thumbsSprite.should.equals(
        `${fakeMediaConfig.sources.poster}/width/${DefaultThumbnailConfig.thumbsWidth}/height/${DefaultThumbnailConfig.thumbsHeight}/vid_slices/${DefaultThumbnailConfig.thumbsSlices}/ks/${fakeMediaConfig.session.ks}`
      );
  });

  it('should get thumbnail slices url with the custom params', () => {
    fakePlayer.config.ui = {
      components: {
        seekbar: {
          ...fakeSeekbarConfig
        }
      }
    };
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager
      .getKalturaThumbnailConfig()
      .thumbsSprite.should.equals(
        `${fakeMediaConfig.sources.poster}/width/${fakeSeekbarConfig.thumbsWidth}/height/${DefaultThumbnailConfig.thumbsHeight}/vid_slices/${fakeSeekbarConfig.thumbsSlices}/ks/${fakeMediaConfig.session.ks}`
      );
  });

  it('should get empty thumbnail slices url for non string given', () => {
    fakeMediaConfig.sources.poster = null;
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for non valid string given', () => {
    fakeMediaConfig.sources.poster = '//my-thumb-service.com/p/1/entry_id/2/version/3';
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for live content', () => {
    fakeMediaConfig.sources.type = MediaType.LIVE;
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for live content', () => {
    fakeMediaConfig.sources.type = MediaType.LIVE;
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should return kaltura thumbnail', () => {
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    const spy = sandbox.spy(thumbnailManager, '_convertKalturaThumbnailToThumbnailInfo');
    thumbnailManager.getThumbnail(100);
    spy.should.calledOnce;
  });

  it('should return thumbnail from core player', () => {
    fakeMediaConfig.sources.poster = null;
    thumbnailManager = new ThumbnailManager(fakeMediaConfig, fakePlayer);
    const spy = sandbox.spy(fakePlayer, 'getThumbnail');
    thumbnailManager.getThumbnail(100);
    spy.should.calledOnce;
  });
});
