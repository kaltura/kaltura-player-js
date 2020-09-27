//@flow
import {BasePlugin} from '.';
import {Error, getLogger} from '@playkit-js/playkit-js';

/**
 * The logger of the PluginManager class.
 * @private
 * @const
 */

/** The PluginManager responsible for register plugins definitions and store plugins instances.
 * @classdesc
 */
export class PluginManager {
  static _logger = getLogger('PluginManager');
  /**
   * The registry of the plugins.
   * Maps plugin's name to his class.
   * @type {Map}
   * @static
   * @private
   */
  static _registry: Map<string, Function> = new Map();
  /**
   * The active plugins in the player.
   * Maps plugin's name to his instance.
   * @type {Object}
   * @private
   */
  _plugins: {[name: string]: BasePlugin} = {};
  /**
   * Is disabled plugin map.
   * Maps plugin's name to a boolean.
   * false means the plugin is disable. true or plugin name doesn't exist in the map means the plugin is not disable.
   * @type {Map}
   * @private
   */
  _isDisabledPluginMap: Map<string, boolean> = new Map();

  /**
   * Writes the plugin in the registry.
   * Maps: plugin name -> plugin class.
   * @param {string} name - The plugin name
   * @param {Function} handler - The plugin class
   * @returns {boolean} - If the registration request succeeded
   * @static
   * @public
   */
  static register(name: string, handler: Function): boolean {
    if (typeof handler !== 'function' || handler.prototype instanceof BasePlugin === false) {
      PluginManager._logger.error(`Plugin <${name}> registration failed, either plugin is not an instance of BasePlugin or plugin handler is not a function`);
      return false;
    }
    if (!PluginManager._registry.has(name)) {
      PluginManager._registry.set(name, handler);
      PluginManager._logger.debug(`Plugin <${name}> has been registered successfully`);
      return true;
    }
    PluginManager._logger.debug(`Plugin <${name}> is already registered, do not register again`);
    return false;
  }

  /**
   * Removes the plugin from the registry.
   * @param {string} name - The plugin name
   * @static
   * @public
   * @returns {void}
   */
  static unRegister(name: string): void {
    if (PluginManager._registry.has(name)) {
      PluginManager._registry.delete(name);
      PluginManager._logger.debug(`Unregistered <${name}> plugin.`);
    }
  }

  /**
   * Creates and store new instance of the plugin in case isValid() of the plugin returns true.
   * @param {string} name - The plugin name
   * @param {Object} player - The player reference
   * @param {Object} [config={}] - The plugin configuration
   * @returns {boolean} - Whether the plugin load was successful
   * @public
   */
  load(name: string, player: Object, config: Object = {}): boolean {
    if (!PluginManager._registry.has(name)) {
      PluginManager._logger.warn(`Plugin <${name}> loading failed, plugin is not registered`);
      throw new Error(Error.Severity.RECOVERABLE, Error.Category.PLAYER, Error.Code.RUNTIME_ERROR_NOT_REGISTERED_PLUGIN, name);
    }
    let pluginClass = PluginManager._registry.get(name);
    if (typeof config.disable === 'boolean') {
      this._isDisabledPluginMap.set(name, config.disable);
    }
    const isDisablePlugin = !!this._isDisabledPluginMap.get(name);
    const isValidPlugin = pluginClass ? pluginClass.isValid() : false;
    if (pluginClass && isValidPlugin && !isDisablePlugin) {
      try {
        this._plugins[name] = pluginClass.createPlugin(name, player, config);
      } catch (e) {
        throw new Error(Error.Severity.RECOVERABLE, Error.Category.PLAYER, Error.Code.PLUGIN_LOAD_FAILED, e);
      }
      this._isDisabledPluginMap.set(name, false);
      PluginManager._logger.debug(`Plugin <${name}> has been loaded`);
      return true;
    }
    PluginManager._logger.debug(`Plugin <${name}> isn't loaded, isValid()=${isValidPlugin.toString()}, disabled=${isDisablePlugin.toString()}`);
    return false;
  }

  /**
   * Iterates over all the plugins and calls loadMedia().
   * @public
   * @returns {void}
   */
  loadMedia(): void {
    Object.keys(this._plugins).forEach(k => this._plugins[k].loadMedia());
  }

  /**
   * Iterates over all the plugins and calls destroy().
   * @public
   * @returns {void}
   */
  destroy(): void {
    Object.keys(this._plugins).forEach(k => {
      this._plugins[k].destroy();
      delete this._plugins[k];
    });
  }

  /**
   * Iterates over all the plugins and calls reset() method of the plugin's impl.
   * @public
   * @returns {void}
   */
  reset(): void {
    Object.keys(this._plugins).forEach(k => this._plugins[k].reset());
  }

  /**
   * Returns the plugin's instance.
   * @param {string} name - The plugin name.
   * @returns {BasePlugin} - The plugin instance.
   * @public
   */
  get(name: string): ?BasePlugin {
    return this._plugins[name];
  }

  /**
   * Returns all plugins.
   * @returns {Object} - All plugins.
   * @public
   */
  getAll(): {[name: string]: BasePlugin} {
    return this._plugins;
  }
}

/**
 * Export the register method.
 * @type {function}
 * @constant
 */
const registerPlugin = PluginManager.register;
export {registerPlugin};
