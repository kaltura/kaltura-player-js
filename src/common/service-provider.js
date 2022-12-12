//@flow
import {getLogger, EventManager} from '@playkit-js/playkit-js';

/**
 * @class ServiceProvider
 */
class ServiceProvider {
  static _logger: any;
  _servicesRegistry: Map<string, Object> = new Map();
  _eventManager: EventManager;

  /**
   * @constructor
   * @param {KalturaPlayer} player - The player.
   */
  constructor(player: KalturaPlayer) {
    ServiceProvider._logger = getLogger('ServiceProvider');
    this._eventManager = new EventManager();
    this._eventManager.listen(player, player.Event.Core.PLAYER_RESET, () => this.reset());
  }

  /**
   * @param {string} name - the service name
   * @param {Object} service - the service object
   * @returns {void}
   */
  register(name: string, service: Object): void {
    if (this._servicesRegistry.has(name)) {
      ServiceProvider._logger.debug(`${name} service already exists`);
    } else {
      this._servicesRegistry.set(name, service);
      ServiceProvider._logger.debug(`${name} service registered`);
    }
  }

  /**
   *
   * @param {string} name - the service name
   * @returns {Object} - the service object
   */
  get(name: string): Object | void {
    return this._servicesRegistry.get(name);
  }

  /**
   *
   * @param {string} name - the service name
   * @returns {boolean} - if the service exist
   */
  has(name: string): boolean {
    return this._servicesRegistry.has(name);
  }

  /**
   * @returns {void}
   */
  reset() {
    this._servicesRegistry.forEach(service => typeof service.reset === 'function' && service.reset());
  }

  /**
   * @returns {void}
   */
  destroy() {
    this._servicesRegistry.forEach(service => typeof service.destroy === 'function' && service.destroy());
    this._eventManager.removeAll();
    this._servicesRegistry.clear();
  }
}

export {ServiceProvider};
