import { Error, EventManager, FakeEvent, Utils, getLogger } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';

/** The BasePlugin responsible to implement the plugin interface.
 * Contains several default implementations.
 * Other plugins should extend this class.
 * @classdesc
 */
export class BasePlugin {
  protected logger: any;
  /**
   * The runtime configuration of the plugin.
   * @member
   */
  protected config: any;
  /**
   * The name of the plugin.
   * @member
   */
  public name: string;
  /**
   * The logger of the plugin.
   * @member
   */
  /**
   * Reference to the actual player.
   * @member
   */
  protected player: KalturaPlayer;
  /**
   * The event manager of the plugin.
   * @member
   */
  protected eventManager: EventManager;
  /**
   * The default configuration of the plugin.
   * Inherited plugins should override this property.
   * @type {Object}
   * @static
   * @member
   */
  protected static defaultConfig: any = {};
  /**
   * The display name of the plugin.
   * Inherited plugins should override this property.
   * @type {string}
   * @static
   * @member
   */
  public displayName!: string;
  /**
   * The svg icon metadata of the plugin.
   * Inherited plugins should override this property.
   * @type {svgUrl: string, viewBox: string}
   * @static
   * @member
   */
  public symbol!: { svgUrl: string; viewBox: string };

  /**
   * Returns under what conditions the plugin is valid.
   * Plugin must implement this method.
   * @returns {boolean} - Whether the plugin is valid and can be initiated. Default implementation is true
   * @static
   * @public
   * @abstract
   */
  public static isValid(): boolean {
    throw new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED, 'isValid()');
  }

  /**
   * constructor
   * @param {string} name - The plugin name
   * @param {Object} player - The player reference
   * @param {Object} config - The plugin configuration
   * @constructor
   * @private
   */
  constructor(name: string, player: KalturaPlayer, config: any = {}) {
    this.name = name;
    this.player = player;
    this.eventManager = new EventManager();
    this.logger = getLogger(Utils.String.capitlize(this.name));
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.config = { ...this.constructor.defaultConfig, ...config };
  }

  /**
   * Getter for the configuration of the plugin.
   * @param {string} attr - The key in the plugin configuration (optional).
   * @returns {*} - If attribute is provided, returns its value. Else, Returns the config of the plugin.
   * @public
   */
  public getConfig(attr?: string): any {
    if (attr) {
      return Utils.Object.copyDeep(this.config[attr]);
    }
    return Utils.Object.copyDeep(this.config);
  }

  /**
   * Getter for the ready promise of the plugin.
   * @returns {Promise<*>} - returns a resolved promise unless the plugin overrides this ready getter.
   * @public
   */
  protected get ready(): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Updates the config of the plugin.
   * @param {Object} update - The updated configuration.
   * @public
   * @returns {void}
   */
  public updateConfig(update: any): void {
    Utils.Object.mergeDeep(this.config, update);
  }

  /**
   * Runs the loadMedia logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  public loadMedia(): void {}

  /**
   * should to overridden by a plugin which open overlay once activated
   * @public
   * @virtual
   * @returns {void}
   */
  public open(): void {
    throw new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED, 'showOverlay()');
  }

  /**
   * Runs the destroy logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  public destroy(): void {
    this.eventManager.destroy();
  }

  /**
   * Runs the reset logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  public reset(): void {}

  /**
   * Getter for the plugin's name.
   * @returns {string} - The name of the plugin.
   * @public
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Dispatch an event via the plugin.
   * @param {string} name - The event name.
   * @param {any} payload - The event payload.
   * @returns {void}
   */
  public dispatchEvent(name: string, payload?: any): void {
    this.logger.debug('Fire event: ' + name, payload);
    this.player.dispatchEvent(new FakeEvent(name, payload));
  }
}
