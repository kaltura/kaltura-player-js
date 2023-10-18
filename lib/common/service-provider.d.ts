import { EventManager } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../kaltura-player';
/**
 * @class ServiceProvider
 */
declare class ServiceProvider {
  static _logger: any;
  _servicesRegistry: Map<string, any>;
  _eventManager: EventManager;
  /**
   * @constructor
   * @param {KalturaPlayer} player - The player.
   */
  constructor(player: KalturaPlayer);
  /**
   * @param {string} name - the service name
   * @param {Object} service - the service object
   * @returns {void}
   */
  register(name: string, service: any): void;
  /**
   *
   * @param {string} name - the service name
   * @returns {Object} - the service object
   */
  get(name: string): any | void;
  /**
   *
   * @param {string} name - the service name
   * @returns {boolean} - if the service exist
   */
  has(name: string): boolean;
  /**
   * @returns {void}
   */
  reset(): void;
  /**
   * @returns {void}
   */
  destroy(): void;
}
export { ServiceProvider };
//# sourceMappingURL=service-provider.d.ts.map
