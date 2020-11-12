//@flow
import {Error, EventManager, FakeEvent, Utils, getLogger} from '@playkit-js/playkit-js';

/** The BasePlugin responsible to implement the plugin interface.
 * Contains several default implementations.
 * Other plugins should extend this class.
 * @classdesc
 */
export class BasePlugin implements IPlugin {
  logger: any;
  /**
   * The runtime configuration of the plugin.
   * @member
   */
  config: Object;
  /**
   * The name of the plugin.
   * @member
   */
  name: string;
  /**
   * The logger of the plugin.
   * @member
   */
  /**
   * Reference to the actual player.
   * @member
   */
  player: Object;
  /**
   * The event manager of the plugin.
   * @member
   */
  eventManager: EventManager;
  /**
   * The default configuration of the plugin.
   * Inherited plugins should override this property.
   * @type {Object}
   * @static
   * @member
   */
  static defaultConfig: Object = {};

  /**
   * Factory method to create the actual plugin.
   * @param {string} name - The plugin name
   * @param {Object} player - The player reference
   * @param {Object} config - The plugin configuration
   * @returns {BasePlugin} - New runtime plugin instance
   * @static
   * @public
   */
  static createPlugin(name: string, player: Object, config: Object = {}): BasePlugin {
    return new this(name, player, config);
  }

  /**
   * Returns under what conditions the plugin is valid.
   * Plugin must implement this method.
   * @returns {boolean} - Whether the plugin is valid and can be initiated. Default implementation is true
   * @static
   * @public
   * @abstract
   */
  static isValid(): boolean {
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
  constructor(name: string, player: Object, config: Object) {
    this.name = name;
    this.player = player;
    this.eventManager = new EventManager();
    this.logger = getLogger(Utils.String.capitlize(this.name));
    this.config = {};
    Utils.Object.mergeDeep(this.config, this.constructor.defaultConfig, config);
  }

  /**
   * Getter for the configuration of the plugin.
   * @param {string} attr - The key in the plugin configuration (optional).
   * @returns {*} - If attribute is provided, returns its value. Else, Returns the config of the plugin.
   * @public
   */
  getConfig(attr?: string): any {
    if (attr) {
      return Utils.Object.copyDeep(this.config[attr]);
    }
    return Utils.Object.copyDeep(this.config);
  }

  /**
   * Getter for the load ready promise of the plugin.
   * @returns {Promise<*>} - returns a resolved promise unless the plugin overrides this ready getter.
   * @public
   */
  get loadReady(): Promise<*> {
    return Promise.resolve();
  }

  /**
   * Getter for the play ready promise of the plugin.
   * @returns {Promise<*>} - returns a resolved promise unless the plugin overrides this ready getter.
   * @public
   */
  get playReady(): Promise<*> {
    return Promise.resolve();
  }

  /**
   * Updates the config of the plugin.
   * @param {Object} update - The updated configuration.
   * @public
   * @returns {void}
   */
  updateConfig(update: Object): void {
    Utils.Object.mergeDeep(this.config, update);
  }

  /**
   * Runs the loadMedia logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  loadMedia(): void {}

  /**
   * Runs the destroy logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  destroy(): void {
    this.eventManager.destroy();
  }

  /**
   * Runs the reset logic of the plugin.
   * plugin must implement this method.
   * @public
   * @virtual
   * @returns {void}
   */
  reset(): void {}

  /**
   * Getter for the plugin's name.
   * @returns {string} - The name of the plugin.
   * @public
   */
  getName(): string {
    return this.name;
  }

  /**
   * Dispatch an event via the plugin.
   * @param {string} name - The event name.
   * @param {any} payload - The event payload.
   * @returns {void}
   */
  dispatchEvent(name: string, payload: any): void {
    this.logger.debug('Fire event: ' + name, payload);
    this.player.dispatchEvent(new FakeEvent(name, payload));
  }
}
