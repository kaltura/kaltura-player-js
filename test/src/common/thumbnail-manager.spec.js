import {MediaType} from '@playkit-js/playkit-js';
import {DefaultThumbnailConfig, ThumbnailManager} from '../../../src/common/thumbnail-manager';

describe('ThumbnailManager', () => {
  let thumbnailManager, fakePlayer, fakeMediaConfig, sandbox;
  const thumbsSprite = 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg';
  const fakeSeekbarConfig = {
    thumbsSlices: 200,
    thumbsWidth: 100
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fakePlayer = {
      config: {
        ui: {
          components: {
            seekbar: {}
          }
        }
      },
      getThumbnail: () => {},
      _localPlayer: {
        getThumbnail: () => {}
      }
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
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager
      .getKalturaThumbnailConfig()
      .thumbsSprite.should.equals(
        `${fakeMediaConfig.sources.poster}/width/${DefaultThumbnailConfig.thumbsWidth}/vid_slices/${DefaultThumbnailConfig.thumbsSlices}/ks/${fakeMediaConfig.session.ks}`
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
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager
      .getKalturaThumbnailConfig()
      .thumbsSprite.should.equals(
        `${fakeMediaConfig.sources.poster}/width/${fakeSeekbarConfig.thumbsWidth}/vid_slices/${fakeSeekbarConfig.thumbsSlices}/ks/${fakeMediaConfig.session.ks}`
      );
  });

  it('should get empty thumbnail slices url for non string given', () => {
    fakeMediaConfig.sources.poster = null;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for non valid string given', () => {
    fakeMediaConfig.sources.poster = '//my-thumb-service.com/p/1/entry_id/2/version/3';
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for live content', () => {
    fakeMediaConfig.sources.type = MediaType.LIVE;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should get empty thumbnail slices url for live content', () => {
    fakeMediaConfig.sources.type = MediaType.LIVE;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().thumbsSprite.should.equals(``);
  });

  it('should return kaltura thumbnail', () => {
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    const spy = sandbox.spy(thumbnailManager, '_convertKalturaThumbnailToThumbnailInfo');
    thumbnailManager.getThumbnail(100);
    spy.should.calledOnce;
  });

  it('should return thumbnail from core player', () => {
    fakeMediaConfig.sources.poster = null;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    const spy = sandbox.spy(fakePlayer, 'getThumbnail');
    thumbnailManager.getThumbnail(100);
    spy.should.calledOnce;
  });

  it('should return thumbnail height from image sprite', () => {
    fakeMediaConfig.sources.poster = null;
    fakePlayer.config.ui.components.seekbar.thumbsSprite = thumbsSprite;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager._thumbsHeight = 999;
    const thumbInfo = thumbnailManager.getThumbnail(100);
    thumbInfo.height.should.equal(999);
  });

  it('should set the configured thumbs sprite with default sizes', () => {
    fakePlayer.config.ui.components.seekbar.thumbsSprite = thumbsSprite;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().should.deep.equal({
      thumbsSprite,
      ...DefaultThumbnailConfig
    });
  });

  it('should set the configured thumbs sprite with configured sizes', () => {
    const seekbarConfig = {
      thumbsSlices: 200,
      thumbsSprite,
      thumbsWidth: 300
    };
    fakePlayer.config.ui.components.seekbar = seekbarConfig;
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    thumbnailManager.getKalturaThumbnailConfig().should.deep.equal({...seekbarConfig, ...DefaultThumbnailConfig});
  });

  it('should set the backend thumbs sprite with default sizes', () => {
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    const config = thumbnailManager.getKalturaThumbnailConfig();
    config.thumbsSlices.should.equal(DefaultThumbnailConfig.thumbsSlices);
    config.thumbsWidth.should.equal(DefaultThumbnailConfig.thumbsWidth);
  });

  it('should set the backend thumbs sprite with configured sizes', () => {
    fakePlayer.config.ui.components.seekbar = {
      thumbsSlices: 200,
      thumbsWidth: 300
    };
    thumbnailManager = new ThumbnailManager(fakePlayer, fakePlayer.config.ui, fakeMediaConfig);
    const config = thumbnailManager.getKalturaThumbnailConfig();
    config.thumbsSlices.should.equal(200);
    config.thumbsWidth.should.equal(300);
  });
});
