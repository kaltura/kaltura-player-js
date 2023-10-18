import { UIManager } from '@playkit-js/playkit-js-ui';
import { KalturaPlayer } from '../kaltura-player';
import { UiConfig } from '../types/ui-config';
import { KalturaPlayerConfig } from '../types/kaltura-player-options';
import { KPUIAddComponent, KPUIRemoveComponent } from '../types/ui-component';
import { PluginsConfig } from '../types/plugins-config';
/**
 * The logger of the UIWrapper class.
 * @private
 * @const
 */
declare class UIWrapper {
  static _logger: any;
  _uiManager: UIManager;
  _disabled: boolean;
  _player: KalturaPlayer;
  constructor(player: KalturaPlayer, options: KalturaPlayerConfig);
  destroy(): void;
  reset(): void;
  setConfig(config: Object, componentAlias?: string): void;
  /**
   * Add a component dynamically
   *
   * @param {KPUIAddComponent} component - The component to add
   * @returns {Function} - Removal function
   */
  addComponent(component: KPUIAddComponent): Function;
  /**
   * Remove a component dynamically
   *
   * @param {KPUIRemoveComponent} component - The component to remove
   * @returns {Function} - Undo removal function
   */
  removeComponent(component: KPUIRemoveComponent): Function;
  get store(): Object;
  /**
   * Deprecated - left for backward compatibility - use instead registerService in KalturaPlayer
   * @param {string} name - the manager name
   * @param {Object} manager - the manager object
   * @returns {void}
   */
  registerManager(name: string, manager: Object): void;
  /**
   * Deprecated - left for backward compatibility - use instead getService in KalturaPlayer
   * @param {string} name - the manager name
   * @returns {Object} - the manager object
   */
  getManager(name: string): Object | void;
  /**
   * Deprecated - left for backward compatibility - use instead hasService in KalturaPlayer
   * @param {string} name - the manager name
   * @returns {boolean} - if the manager exist
   */
  hasManager(name: string): boolean;
  setLoadingSpinnerState(show: boolean): void;
  _resetErrorState(): void;
  _handleExternalCSS(config: UiConfig): void;
  _handleVr(config?: PluginsConfig): void;
  _setStereoConfig(vrConfig: any): void;
}
export { UIWrapper };
//# sourceMappingURL=ui-wrapper.d.ts.map
