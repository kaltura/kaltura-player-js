// @flow
import {loadPlayer, Utils, Error, FakeEvent} from 'playkit-js'
import {UIManager} from 'playkit-js-ui'
import {Provider} from 'playkit-js-providers'
import getLogger from './common/utils/logger'
import {addKalturaParams} from './common/utils/kaltura-params'
import {setUIErrorOverlayConfig} from './common/utils/setup-helpers'
import {evaluatePluginsConfig} from './common/plugins/plugins-config'
import {addKalturaPoster, setUISeekbarConfig} from 'poster-and-thumbs'
import './assets/style.css'

export default class KalturaPlayer {
  _player: Player;
  _playerConfigure: Function;
  _provider: Provider;
  _uiManager: UIManager;
  _logger: any;

  constructor(options: KalturaPlayerOptionsObject) {
    this._player = loadPlayer(options.player);
    this._playerConfigure = this._player.configure.bind(this._player);
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new UIManager(this._player, options.ui);
    this._provider = new Provider(options.provider, __VERSION__);
    this._uiManager.buildDefaultUI();
    Object.assign(this._player, {
      loadMedia: mediaInfo => this.loadMedia(mediaInfo),
      configure: config => this.configure(config),
      setMedia: mediaConfig => this.setMedia(mediaConfig)
    });
    return this._player;
  }

  configure(config: Object): void {
    if (!config.player && !config.ui) {
      this._playerConfigure(config);
    } else {
      if (config.player) {
        this._playerConfigure(config.player);
      }
      if (config.ui) {
        this._uiManager.setConfig(config.ui);
      }
    }
  }

  loadMedia(mediaInfo: ProviderMediaInfoObject): Promise<*> {
    this._logger.debug('loadMedia', mediaInfo);
    this._player.loadingMedia = true;
    setUIErrorOverlayConfig(this._uiManager, mediaInfo);
    return this._provider.getMediaConfig(mediaInfo)
      .then(mediaConfig => {
        this.setMedia(mediaConfig);
      }).catch(e => {
        this._player.dispatchEvent(new FakeEvent(this._player.Event.ERROR, new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e)));
      });
  }

  setMedia(mediaConfig: Object): void {
    this._logger.debug('setMedia', mediaConfig);
    const dimensions = this._player.dimensions;
    setUISeekbarConfig(this._uiManager, mediaConfig);
    Utils.Object.mergeDeep(mediaConfig.metadata, this._player.config.metadata);
    addKalturaPoster(mediaConfig.metadata, dimensions.width, dimensions.height);
    addKalturaParams(mediaConfig.sources, this._player);
    Utils.Object.mergeDeep(mediaConfig.plugins, this._player.config.plugins);
    Utils.Object.mergeDeep(mediaConfig.session, this._player.config.session);
    evaluatePluginsConfig(mediaConfig);
    this._player.configure(mediaConfig);
  }
}
