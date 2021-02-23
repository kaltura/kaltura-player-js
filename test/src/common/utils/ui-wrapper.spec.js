import {UIWrapper} from '../../../../src/common/ui-wrapper';
import * as TestUtils from '../../utils/test-utils';
import {getPlayerProxy} from '../../../../src/proxy';
import {getDefaultOptions} from '../../../../src/common/utils/setup-helpers';
import {DefaultThumbnailConfig} from '../../../../src/common/thumbnail-manager';

const targetId = 'player-placeholder_ui-wrapper.spec';

describe('UIWrapper', function () {
  let uiWrapper, uiConfig, player, sandbox;
  const thumbsSprite = 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg';

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(function () {
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  describe('setSeekbarConfig', function () {
    beforeEach(function () {
      sandbox = sinon.createSandbox();
      player = getPlayerProxy(getDefaultOptions({targetId: 'player', provider: {partnerId: 123}}));
      uiConfig = {
        targetId: targetId,
        components: {
          seekbar: {}
        }
      };
    });

    afterEach(function () {
      uiWrapper._uiManager.store.getState().config.components.seekbar = {};
      sandbox.restore();
      uiWrapper = null;
      player.destroy();
      player = null;
    });

    it('should set the configured thumbs sprite with default sizes', function (done) {
      uiConfig.components.seekbar.thumbsSprite = thumbsSprite;
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.should.deep.equal({
          thumbsSprite: thumbsSprite,
          ...DefaultThumbnailConfig
        });
        done();
      });
      uiWrapper.setSeekbarConfig(uiConfig, DefaultThumbnailConfig);
    });

    it('should set the configured thumbs sprite with configured sizes', function (done) {
      uiConfig.components.seekbar = {
        thumbsSlices: 200,
        thumbsSprite: thumbsSprite,
        thumbsWidth: 300
      };
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.should.deep.equal({
          ...DefaultThumbnailConfig,
          thumbsSlices: 200,
          thumbsSprite: thumbsSprite,
          thumbsWidth: 300
        });
        done();
      });
      uiWrapper.setSeekbarConfig(uiConfig, DefaultThumbnailConfig);
    });

    it('should set the backend thumbs sprite with default sizes', function (done) {
      uiConfig.components.seekbar = {};
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.thumbsSlices.should.equal(DefaultThumbnailConfig.thumbsSlices);
        config.thumbsWidth.should.equal(DefaultThumbnailConfig.thumbsWidth);
        done();
      });
      uiWrapper.setSeekbarConfig(uiConfig, DefaultThumbnailConfig);
    });

    it('should set the backend thumbs sprite with configured sizes', function (done) {
      uiConfig.components.seekbar = {
        thumbsSlices: 200,
        thumbsWidth: 300
      };
      uiWrapper = new UIWrapper(player, {ui: uiConfig});
      sandbox.stub(uiWrapper, 'setConfig').callsFake(config => {
        config.thumbsSlices.should.equal(200);
        config.thumbsWidth.should.equal(300);
        done();
      });
      uiWrapper.setSeekbarConfig(uiConfig, DefaultThumbnailConfig);
    });
  });
});
