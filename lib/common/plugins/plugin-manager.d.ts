import { BasePlugin } from './index';
/**
 * The logger of the PluginManager class.
 * @private
 * @const
 */
/** The PluginManager responsible for register plugins definitions and store plugins instances.
 * @classdesc
 */
export declare class PluginManager {
  static _logger: any;
  /**
   * The registry of the plugins.
   * Maps plugin's name to his class.
   * @type {Map}
   * @static
   * @private
   */
  static _registry: Map<string, any>;
  /**
   * The active plugins in the player.
   * Maps plugin's name to his instance.
   * @type {Object}
   * @private
   */
  _plugins: {
    [name: string]: BasePlugin;
  };
  /**
   * Is disabled plugin map.
   * Maps plugin's name to a boolean.
   * false means the plugin is disable. true or plugin name doesn't exist in the map means the plugin is not disable.
   * @type {Map}
   * @private
   */
  _isDisabledPluginMap: Map<string, boolean>;
  /**
   * Writes the plugin in the registry.
   * Maps: plugin name -> plugin class.
   * @param {string} name - The plugin name
   * @param {Function} handler - The plugin class
   * @returns {boolean} - If the registration request succeeded
   * @static
   * @public
   */
  static register(name: string, handler: Function): boolean;
  /**
   * Removes the plugin from the registry.
   * @param {string} name - The plugin name
   * @static
   * @public
   * @returns {void}
   */
  static unRegister(name: string): void;
  /**
   * Creates and store new instance of the plugin in case isValid() of the plugin returns true.
   * @param {string} name - The plugin name
   * @param {Object} player - The player reference
   * @param {Object} [config={}] - The plugin configuration
   * @returns {boolean} - Whether the plugin load was successful
   * @public
   */
  load(name: string, player: Object, config?: any): boolean;
  /**
   * Iterates over all the plugins and calls loadMedia().
   * @public
   * @returns {void}
   */
  loadMedia(): void;
  /**
   * Iterates over all the plugins and calls destroy().
   * @public
   * @returns {void}
   */
  destroy(): void;
  /**
   * Iterates over all the plugins and calls reset() method of the plugin's impl.
   * @public
   * @returns {void}
   */
  reset(): void;
  /**
   * Returns the plugin's instance.
   * @param {string} name - The plugin name.
   * @returns {BasePlugin} - The plugin instance.
   * @public
   */
  get(name: string): BasePlugin | undefined;
  /**
   * Returns all plugins.
   * @returns {Object} - All plugins.
   * @public
   */
  getAll(): {
    [name: string]: BasePlugin;
  };
}
/**
 * Export the register method.
 * @type {function}
 * @constant
 */
declare const registerPlugin: typeof PluginManager.register;
export { registerPlugin };
//# sourceMappingURL=plugin-manager.d.ts.map
