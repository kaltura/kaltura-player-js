// @flow
import {Error, EventType as CoreEventType, FakeEvent, loadPlayer, Utils} from 'playkit-js';
import {EventType as UIEventType} from 'playkit-js-ui';
import {Provider} from 'playkit-js-providers';
import {supportLegacyOptions} from './common/utils/setup-helpers';
import getLogger from './common/utils/logger';
import {addKalturaParams} from './common/utils/kaltura-params';
import {evaluatePluginsConfig} from './common/plugins/plugins-config';
import {addKalturaPoster} from 'poster';
import './assets/style.css';
import {UIWrapper} from './common/ui-wrapper';

export default class KalturaPlayer {
  _player: Player;
  _playerConfigure: Function;
  _provider: Provider;
  _uiWrapper: UIWrapper;
  _logger: any;

  constructor(options: KalturaPlayerOptionsObject) {
    this._player = loadPlayer(options);
    this._playerConfigure = this._player.configure.bind(this._player);
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiWrapper = new UIWrapper(this._player, options);
    this._provider = new Provider(options.provider, __VERSION__);
    Object.assign(this._player, {
      loadMedia: mediaInfo => this.loadMedia(mediaInfo),
      configure: config => this.configure(config),
      setMedia: mediaConfig => this.setMedia(mediaConfig)
    });
    Object.defineProperty(this._player, 'Event', this.Event);
    return this._player;
  }

  configure(config: Object): void {
    config = supportLegacyOptions(config);
    // $FlowFixMe
    evaluatePluginsConfig(config);
    this._playerConfigure(config);
    if (config.ui) {
      this._uiWrapper.setConfig(config.ui);
    }
  }

  loadMedia(mediaInfo: ProviderMediaInfoObject): Promise<*> {
    this._logger.debug('loadMedia', mediaInfo);
    this._reset(mediaInfo);
    this._player.loadingMedia = true;
    this._uiWrapper.setLoadingSpinnerState(true);
    return this._provider
      .getMediaConfig(mediaInfo)
      .then(mediaConfig => this.setMedia(mediaConfig))
      .catch(e =>
        this._player.dispatchEvent(
          new FakeEvent(this._player.Event.ERROR, new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e))
        )
      );
  }

  setMedia(mediaConfig: ProviderMediaConfigObject): void {
    this._logger.debug('setMedia', mediaConfig);
    const playerConfig = Utils.Object.copyDeep(mediaConfig);
    Utils.Object.mergeDeep(playerConfig.sources, this._player.config.sources);
    Utils.Object.mergeDeep(playerConfig.session, this._player.config.session);
    Object.keys(this._player.config.plugins).forEach(name => {
      playerConfig.plugins[name] = {};
    });
    addKalturaPoster(playerConfig.sources, mediaConfig.sources, this._player.dimensions);
    addKalturaParams(this._player, playerConfig);
    this._uiWrapper.setSeekbarConfig(mediaConfig, this._player.config.ui);
    this._player.configure(playerConfig);
  }

  get Event(): Object {
    return {
      get: () => ({
        Core: CoreEventType,
        UI: UIEventType,
        // For backward compatibility
        ...CoreEventType
      }),
      set: undefined
    };
  }

  _reset(mediaInfo: ProviderMediaInfoObject): void {
    this._player.reset();
    this._uiWrapper.resetErrorConfig(mediaInfo);
  }
}
