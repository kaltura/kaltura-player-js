// @flow
import {Utils,PLAYER_EVENTS} from 'playkit-js'
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
    this._playerIsReadyToPlay = false;
    this._targetObj = document.getElementById( targetId );
    this._player = player;
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new PlaykitUI(this._player, {targetId: targetId, logLevel: playerConfig.logLevel});
    const forceTouchUI = playerConfig.ui ? playerConfig.ui.forceTouchUI : false;
    setUITouchConfig(forceTouchUI, this._uiManager);
    this._provider = new OvpProvider(__VERSION__, providerConfig.partnerId, providerConfig.ks, providerConfig.env, playerConfig.logLevel);
    this._uiManager.buildDefaultUI();
    return {
      loadMedia: this.loadMedia.bind( this )
    }
  }

  loadMedia( entryId: string , uiConfId: ?number ): Promise<*> {
    this._logger.debug( 'loadMedia' , {entryId: entryId , uiConfId: uiConfId} );
    return this._provider.getConfig( entryId , uiConfId )
      .then( ( data ) => {
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

  configurePlayer( config: Object ) {
    if (Utils.Object.getPropertyPath( this._player.config,"playback.playWhenVisibile")) {
      this._player.configure( {
        playback:{autoplay: false ,
        preload: "none" }
      } );

      if ( !this._visibilityManager ) {
        let loadCallback = (visibilityRatio: number) => {
          if (!this._playerIsReadyToPlay) {
            this._player.configure(config);
            this._player.load();
            this._playerIsReadyToPlay = true;
          }
        };

        let playCallback = (visibilityRatio: number) => {
          if ( this._playerIsReadyToPlay ) {
            this._player.play();
          } else {
            this._player.configure( config );
            this._player.play();
            this._playerIsReadyToPlay = true;
          }
        };

        let pauseCallback = (visibilityRatio: number) => {
          if ( this._playerIsReadyToPlay ) {
            this._player.pause();
          } else {
            this._player.configure( config );
          }
        };

        let visibilityChanged = (visibilityRatio: number) => {
          //TODO - dispatch event
        };

        this._visibilityManager = new VisibilityManager(this._player.config.playback.visiblityRatio);
        this._visibilityManager.addEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_CHANGE,visibilityChanged.bind(this));
        this._visibilityManager.addEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_PLAY,playCallback.bind(this));
        this._visibilityManager.addEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_LOAD,loadCallback.bind(this));

        if (Utils.Object.getPropertyPath(this._player.config,"playback.pauseWhenNotVisible")) {
          this._visibilityManager.addEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_PAUSE, pauseCallback.bind(this));
        }
        this._visibilityManager.attach( this._targetObj );
        this._player.addEventListener(PLAYER_EVENTS.PLAYER_DESTROY,()=> {
          this._visibilityManager.removeEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_CHANGE, visibilityChanged.bind(this));
          this._visibilityManager.removeEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_PLAY, playCallback.bind(this));
          this._visibilityManager.removeEventListener(VisibilityManager.VisbilityEvent.VISIBILITY_LOAD, loadCallback.bind(this));
          this._visibilityManager.detach();
        });
      } else {
        this._visibilityManager.reset();
      }

    } else {
      this._player.configure( config );
    }

  }
}
