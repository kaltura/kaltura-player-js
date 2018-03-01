// @flow
import {loadPlayer, Utils, Error, FakeEvent} from 'playkit-js'
import {UIManager} from 'playkit-js-ui'
import {Provider} from 'playkit-js-providers'
import getLogger from './common/utils/logger'
import {addKalturaParams} from './common/utils/kaltura-params'
import {setUISeekbarConfig, setUITouchConfig, setUIErrorOverlayConfig} from './common/utils/setup-helpers'
import {evaluatePluginsConfig} from './common/plugins/plugins-config'
import {addKalturaPoster} from 'poster'
import './assets/style.css'

export default class KalturaPlayer {
  _options: KalturaPlayerOptionsObject;
  _player: Player;
  _provider: Provider;
  _uiManager: UIManager;
  _logger: any;

  constructor(options: KalturaPlayerOptionsObject) {
    this._options = options;
    this._player = loadPlayer(options.player);
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new UIManager(this._player, options.ui);
    setUITouchConfig(options.ui.forceTouchUI, this._uiManager);
    this._provider = new Provider(options.provider, __VERSION__);
    this._uiManager.buildDefaultUI();
    Object.assign(this._player, {loadMedia: mediaInfo => this.loadMedia(mediaInfo)});
    return this._player;
  }

  loadMedia(mediaInfo: ProviderMediaInfoObject): Promise<*> {
    this._logger.debug('loadMedia', mediaInfo);
    this._player.loadingMedia = true;
    setUIErrorOverlayConfig(mediaInfo, this._uiManager);
    return this._provider.getMediaConfig(mediaInfo)
      .then(mediaConfig => {
        const dimensions = this._player.dimensions;
        setUISeekbarConfig(mediaConfig, this._uiManager);
        Utils.Object.mergeDeep(mediaConfig.metadata, this._options.player.metadata);
        addKalturaPoster(mediaConfig.metadata, dimensions.width, dimensions.height);
        addKalturaParams(mediaConfig.sources, this._player);
        Utils.Object.mergeDeep(mediaConfig.plugins, this._player.config.plugins);
        Utils.Object.mergeDeep(mediaConfig.session, this._player.config.session);
        evaluatePluginsConfig(mediaConfig);
        this._player.configure(mediaConfig);
      }).catch(e => {
        this._player.dispatchEvent(new FakeEvent(this._player.Event.ERROR, new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e)));
      });
  }
}
