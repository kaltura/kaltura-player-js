// @flow
import {Utils} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import LoggerFactory from './utils/logger'
import {addKalturaParams} from './utils/kaltura-params'
import {addKalturaPoster} from './utils/setup-helpers'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import './assets/style.css'


let Provider: any;
if (__PLAYER_TYPE__ === "ott") {
  Provider = require('playkit-js-providers/dist/ottProvider').OttProvider;
}
else {
  Provider = require('playkit-js-providers/dist/ovpProvider').OvpProvider;
}

export default class KalturaPlayer {
  _player: Player;
  _provider: OvpProvider;
  _uiManager: PlaykitUI;
  _logger: any;


  constructor(player: Player, targetId: string, config: Object) {
    this._player = player;
    this._logger = LoggerFactory.getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
    this._uiManager = new PlaykitUI(this._player, {targetId: targetId});
    if (__PLAYER_TYPE__ === "ott") {
      this._provider = new Provider({
        pVersion: __VERSION__,
        partnerID: config.partnerId,
        ks: config.ks,
        config: config.env
      });
    }
    else {
      this._provider = new Provider({
        pVersion: __VERSION__,
        partnerID: config.partnerId,
        ks: config.ks,
        config: config.env,
        loadUiConf: config.loadUiConf
      });
    }

    this._uiManager.buildDefaultUI();
    return {
      loadMedia: this.loadMedia.bind(this)
    }
  }

  loadMedia(entryId: string, uiConfId: ?number, options: ?Object): Promise<*> {
    if (__PLAYER_TYPE__ === "ott") {
      this._logger.debug('loadOttMedia', {
        assetId: entryId,
        type: options.type,
        contextType: options.contextType,
        protocol: options.protocol,
        fileIds: options.fileIds,
        uiConfId: uiConfId
      });

      return this._provider.getConfig({
        assetId: options.assetId,
        type: options.type,
        contextType: options.contextType,
        protocol: options.protocol,
        fileIds: options.fileIds,
        uiConfId: options.uiConfId
      })
        .then((data) => {
          this.loadMediaCallBack(data);
        });
    }
    else {
      this._logger.debug('loadMedia', {entryId: entryId, uiConfId: uiConfId});
      return this._provider.getConfig({entryId: entryId, uiConfId: uiConfId})
        .then((data) => {
          this.loadMediaCallBack(data);
        });
    }
  }

  loadMediaCallBack(data: object): Promise<*> {
    const dimensions = this._player.dimensions;
    addKalturaPoster(data.metadata, dimensions.width, dimensions.height);
    addKalturaParams(data.sources, this._player);
    Utils.Object.mergeDeep(data.plugins, this._player.config.plugins);
    Utils.Object.mergeDeep(data.session, this._player.config.session);
    evaluatePluginsConfig(data);
    this._player.configure(data);
  }
}
