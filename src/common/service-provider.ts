import { getLogger, EventManager } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../kaltura-player';

/**
 * @class ServiceProvider
 */
class ServiceProvider {
  private static _logger: any;
  private _servicesRegistry: Map<string, any> = new Map();
  private _eventManager: EventManager;

  /**
   * @constructor
   * @param {KalturaPlayer} player - The player.
   */
  constructor(player: KalturaPlayer) {
    ServiceProvider._logger = getLogger('ServiceProvider');
    this._eventManager = new EventManager();
    this._eventManager.listen(player, player.Event.Core.PLAYER_RESET, () =>
      this.reset()
    );
  }

  /**
   * @param {string} name - the service name
   * @param {Object} service - the service object
   * @returns {void}
   */
  public register(name: string, service: any): void {
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
  public get(name: string): any | void {
    return this._servicesRegistry.get(name);
  }

  /**
   *
   * @param {string} name - the service name
   * @returns {boolean} - if the service exist
   */
  public has(name: string): boolean {
    return this._servicesRegistry.has(name);
  }

  /**
   * @returns {void}
   */
  public reset(): void {
    this._servicesRegistry.forEach(
      (service) => typeof service.reset === 'function' && service.reset()
    );
  }

  /**
   * @returns {void}
   */
  public destroy(): void {
    this._servicesRegistry.forEach(
      (service) => typeof service.destroy === 'function' && service.destroy()
    );
    this._eventManager.removeAll();
    this._servicesRegistry.clear();
  }
}

export { ServiceProvider };
