// @flow
import {Utils, Error, FakeEvent} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import getLogger from './utils/logger'
import {addKalturaParams} from './utils/kaltura-params'
import {addKalturaPoster, setUISeekbarConfig} from './utils/setup-helpers'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import './assets/style.css'

export default class KalturaPlayer {
  _player: Player;
  _provider: OvpProvider;
  _uiManager: PlaykitUI;
  _logger: any;

  constructor(player: Player, targetId: string, playerConfig: Object, providerConfig: Object) {
    this._player = player;
    this._logger = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new PlaykitUI(this._player, {targetId: targetId, logLevel: playerConfig.logLevel});
    this._provider = new OvpProvider(__VERSION__, providerConfig.partnerId, providerConfig.ks, providerConfig.env, playerConfig.logLevel);
    this._uiManager.buildDefaultUI();
    return {
      loadMedia: this.loadMedia.bind(this)
    }
  }

  loadMedia(entryId: string, uiConfId: ?number): Promise<*> {
    this._logger.debug('loadMedia', {entryId: entryId, uiConfId: uiConfId});
    this._uiManager.setConfig({entryId: entryId}, "errorOverlay");
    return this._provider.getConfig(entryId, uiConfId)
      .then((data) => {
        const dimensions = this._player.dimensions;
        setUISeekbarConfig(data, this._uiManager);
        addKalturaPoster(data.metadata, dimensions.width, dimensions.height);
        addKalturaParams(data.sources, this._player);
        Utils.Object.mergeDeep(data.plugins, this._player.config.plugins);
        Utils.Object.mergeDeep(data.session, this._player.config.session);
        evaluatePluginsConfig(data);
        this._player.configure(data);
      }).catch(e => {
        this._player.dispatchEvent(new FakeEvent(this._player.Event.ERROR, new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e)));
      });
  }
}
