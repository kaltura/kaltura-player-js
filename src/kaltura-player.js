// @flow
import {Utils} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import LoggerFactory from './utils/logger'
import {addKalturaParams} from './utils/kaltura-params'
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
    this._provider = new OvpProvider(config.partnerId, config.ks, config.env);
    this._uiManager.buildDefaultUI();
    return {
      loadMedia: this.loadMedia.bind(this)
    }
  }

  loadMedia(entryId: string, uiConfId: ?number): Promise<*> {
    this._logger.debug('loadMedia', {entryId: entryId, uiConfId: uiConfId});
    return this._provider.getConfig(entryId, uiConfId)
      .then((data) => {
        let playerConfig = {};
        const dimensions = this._player.dimensions;
        data.metadata.poster = getPosterRequestWithDimensions(data.metadata.poster, dimensions.width, dimensions.height);
        addKalturaParams(data.sources, this._player);
        Utils.Object.mergeDeep(playerConfig, this._player.config, data);
        this._player.configure(playerConfig);
      });
  }
}

/**
 *
 * @param url - the poster url
 * @param (number} width - the player width in px
 * @param {number} height - the player height in px
 * @returns {string}
 */
function getPosterRequestWithDimensions(url: string, width: number, height: number): string{
  return `${url}/height/${height}/width/${width}`;
}
