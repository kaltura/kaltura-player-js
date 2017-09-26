// @flow
import {Utils} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import LoggerFactory from './utils/logger'
import {addKalturaParams} from './utils/kaltura-params'
import {addKalturaPoster} from './utils/setup-helpers'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import {VERSION} from "./index";
import './assets/style.css'

export default class KalturaPlayer {
  _player: Player;
  _provider: OvpProvider;
  _uiManager: PlaykitUI;
  _logger: any;

  constructor(player: Player, targetId: string, config: Object) {
    this._player = player;
    this._logger = LoggerFactory.getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new PlaykitUI(this._player, {targetId: targetId});
    this._provider = new OvpProvider(VERSION, config.partnerId, config.ks, config.env);
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
        addKalturaPoster(data.metadata, dimensions.width, dimensions.height);
        addKalturaParams(data.sources, this._player);
        Utils.Object.mergeDeep(data.plugins, this._player.config.plugins);
        Utils.Object.mergeDeep(data.session, this._player.config.session);
        evaluatePluginsConfig(data);
        this._player.configure(data);
      });
  }
}
