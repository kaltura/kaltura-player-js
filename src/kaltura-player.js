// @flow
import {Utils} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import getLogger from './utils/logger'
import {addKalturaParams} from './utils/kaltura-params'
import {addKalturaPoster, setUISeekbarConfig, setUITouchConfig} from './utils/setup-helpers'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import './assets/style.css'
import VisibilityManager from "./visibility/visibility-manager";

export default class KalturaPlayer {
  _player: Player;
  _provider: OvpProvider;
  _uiManager: PlaykitUI;
  _targetObj: any;
  _logger: any;
  _playerIsReadyToPlay: boolean;
  _visibilityManager: VisibilityManager;

  constructor(player: Player, targetId: string, playerConfig: Object = {}, providerConfig: Object) {
    this._player = player;
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new PlaykitUI(this._player, {targetId: targetId, logLevel: playerConfig.logLevel});
    const forceTouchUI = playerConfig.ui ? playerConfig.ui.forceTouchUI : false;
    setUITouchConfig(forceTouchUI, this._uiManager);
    this._provider = new OvpProvider(__VERSION__, providerConfig.partnerId, providerConfig.ks, providerConfig.env, playerConfig.logLevel);
    this._uiManager.buildDefaultUI();
    return {
      loadMedia: this.loadMedia.bind(this)
    }
  }

  loadMedia(entryId: string, uiConfId: ?number): Promise<*> {
    this._logger.debug('loadMedia', {entryId: entryId, uiConfId: uiConfId});
    return this._provider.getConfig(entryId, uiConfId)
      .then((data) => {
        const dimensions = this._player.dimensions;
        setUISeekbarConfig(data, this._uiManager);
        addKalturaPoster(data.metadata, dimensions.width, dimensions.height);
        addKalturaParams(data.sources, this._player);
        Utils.Object.mergeDeep(data.plugins, this._player.config.plugins);
        Utils.Object.mergeDeep(data.session, this._player.config.session);
        evaluatePluginsConfig(data);
        this.configurePlayer(data);
      });
  }

  configurePlayer(config: Object){
    if (this._player.config && this._player.config.playback && this._player.config.playback.playWhenVisibile){
      this._player.config.playback.autoplay = false;
      this._player.config.playback.preload = "none";
      if (!this._visibilityManager) {
        this._visibilityManager = new VisibilityManager();
        let [loadPromise , playPromise] = this._visibilityManager.attach( this._targetObj );
        loadPromise.then( result => {
          this._player.configure( config );
          this._player.load();
          this._playerIsReadyToPlay = true;

        } )

        playPromise.then( result => {
          this._player._config.playback.autoplay = true;
          if ( this._playerIsReadyToPlay ) {
            this._player._handleAutoPlay();
          } else {
            this._player.configure( config );
          }
        } )
      } else {
        this._visibilityManager.reset();
      }

    } else {
      this._player.configure(config);
    }

  }
}
