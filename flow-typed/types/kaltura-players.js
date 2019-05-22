import {KalturaPlayer} from '../../src/kaltura-player';

/**
 * @type {Object.<string, KalturaPlayer>}
 * @name KalturaPlayers
 * @description a map of player instances by player ids
*/
type _KalturaPlayers = {[id: string]: KalturaPlayer};
declare type KalturaPlayers = _KalturaPlayers;

type ExternalPresetComponent = {
  presets?: Array<string>,
  container: string,
  componentName?: string,
  component: Function,
  position?: string,
  context?: any
};
