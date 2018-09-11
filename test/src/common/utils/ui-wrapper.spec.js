import {UIWrapper} from '../../../../src/common/ui-wrapper';
import loadPlayer from '@playkit-js/playkit-js';
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH} from '../../../../src/common/utils/thumbs';
import * as TestUtils from '../../utils/test-utils';

const targetId = 'player-placeholder_ui-wrapper.spec';

describe('UIWrapper', function() {
  let uiWrapper, uiConfig, mediaConfig, player, sandbox;
  const thumbsSprite = 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg';

  before(function() {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(function() {
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
    TestUtils.removeElement(targetId);
  });

  describe('setSeekbarConfig', function() {
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      player = loadPlayer();
      mediaConfig = {
        session: {
          ks: 'ks'
        },
        sources: {
          id: '0_wifqaipd',
          duration: 741,
          type: 'Vod',
          poster: 'http://cdntesting.qa.mkaltura.com/p/1091/sp/109100/thumbnail/entry_id/0_wifqaipd/version/100042',
          dvr: false,
          metadata: {
            name: 'MPEG Dash with MultiAudio New Transcoding',
            description: '',
            MediaType: 'Movie',
            WatchPermissionRule: 'Parrent Allowed'
          }
        }
      };
      uiConfig = {
        targetId: targetId,
        components: {
          seekbar: {}
        }
      };
    });

    afterEach(function() {
      uiWrapper._uiManager.store.getState().config.components.seekbar = {};
      sandbox.restore();
      uiWrapper = null;
      player.destroy();
      player = null;
    });

    it('should set the configured thumbs sprite with default sizes', function(done) {
      uiConfig.components.seekbar.thumbsSprite = thumbsSprite;
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.should.deep.equal({
          thumbsSlices: DEFAULT_THUMBS_SLICES,
          thumbsSprite: thumbsSprite,
          thumbsWidth: DEFAULT_THUMBS_WIDTH
        });
        done();
      });
      uiWrapper.setSeekbarConfig(mediaConfig, uiConfig);
    });

    it('should set the configured thumbs sprite with configured sizes', function(done) {
      uiConfig.components.seekbar = {
        thumbsSlices: 200,
        thumbsSprite: thumbsSprite,
        thumbsWidth: 300
      };
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.should.deep.equal({
          thumbsSlices: 200,
          thumbsSprite: thumbsSprite,
          thumbsWidth: 300
        });
        done();
      });
      uiWrapper.setSeekbarConfig(mediaConfig, uiConfig);
    });

    it('should set the backend thumbs sprite with default sizes', function(done) {
      uiConfig.components.seekbar = {};
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.thumbsSlices.should.equal(DEFAULT_THUMBS_SLICES);
        config.thumbsWidth.should.equal(DEFAULT_THUMBS_WIDTH);
        config.thumbsSprite.startsWith(mediaConfig.sources.poster).should.be.true;
        done();
      });
      uiWrapper.setSeekbarConfig(mediaConfig, uiConfig);
    });

    it('should set the backend thumbs sprite with configured sizes', function(done) {
      uiConfig.components.seekbar = {
        thumbsSlices: 200,
        thumbsWidth: 300
      };
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.thumbsSlices.should.equal(200);
        config.thumbsWidth.should.equal(300);
        config.thumbsSprite.startsWith(mediaConfig.sources.poster).should.be.true;
        done();
      });
      uiWrapper.setSeekbarConfig(mediaConfig, uiConfig);
    });
  });
});
