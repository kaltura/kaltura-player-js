import { UIManager, Components } from '@playkit-js/playkit-js-ui';
import { Env, getLogger, Utils } from '@playkit-js/playkit-js';
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
class UIWrapper {
  private static _logger = getLogger('UIWrapper');
  private _uiManager: UIManager;
  private readonly _disabled: boolean = false;
  private _player: KalturaPlayer;

  constructor(player: KalturaPlayer, options: KalturaPlayerConfig) {
    this._player = player;
    const config: UiConfig = options.ui;
    if (config.disable) {
      this._disabled = true;
      const targetContainer = document.getElementById(config.targetId);
      if (targetContainer) {
        targetContainer.appendChild(player.getView());
      }
    } else {
      this._uiManager = new UIManager(player, config);
      if (config.customPreset) {
        this._uiManager.buildCustomUI(config.customPreset);
      } else {
        this._uiManager.buildDefaultUI();
      }
      this._handleVr(options.plugins);
      this._handleExternalCSS(config);
    }
    return new Proxy(this, {
      get: (uiw: UIWrapper, prop: string): UIWrapper | (() => undefined) => {
        if (this._disabled) return () => undefined;
        // $FlowFixMe
        return uiw[prop];
      }
    });
  }

  public destroy(): void {
    this._uiManager.destroy();
  }

  public reset(): void {
    this._resetErrorState();
  }

  public setConfig(config: any, componentAlias?: string): void {
    this._uiManager.setConfig(config, componentAlias);
  }

  /**
   * Add a component dynamically
   *
   * @param {KPUIAddComponent} component - The component to add
   * @returns {Function} - Removal function
   */
  public addComponent(component: KPUIAddComponent): () => void {
    return this._uiManager.addComponent(component);
  }

  /**
   * Remove a component dynamically
   *
   * @param {KPUIRemoveComponent} component - The component to remove
   * @returns {Function} - Undo removal function
   */
  public removeComponent(component: KPUIRemoveComponent): () => void {
    const replaceComponent: KPUIAddComponent = {
      label: `Remove_${component.removeComponent}`,
      get: Components.Remove,
      presets: component.presets,
      area: (component.area || component.container) as string, // supporting also "container" prop for backward compatibility
      replaceComponent: component.removeComponent
    };
    return this._uiManager.addComponent(replaceComponent);
  }

  public get store(): any {
    return this._uiManager.store;
  }

  /**
   * Deprecated - left for backward compatibility - use instead registerService in KalturaPlayer
   * @param {string} name - the manager name
   * @param {Object} manager - the manager object
   * @returns {void}
   */
  public registerManager(name: string, manager: any): void {
    this._player.registerService(name, manager);
  }

  /**
   * Deprecated - left for backward compatibility - use instead getService in KalturaPlayer
   * @param {string} name - the manager name
   * @returns {Object} - the manager object
   */
  public getManager(name: string): any | void {
    return this._player.getService(name);
  }

  /**
   * Deprecated - left for backward compatibility - use instead hasService in KalturaPlayer
   * @param {string} name - the manager name
   * @returns {boolean} - if the manager exist
   */
  public hasManager(name: string): boolean {
    return this._player.hasService(name);
  }

  public setLoadingSpinnerState(show: boolean): void {
    this.setConfig({ show: show }, 'loading');
  }

  private _resetErrorState(): void {
    this.setConfig({ hasError: false }, 'engine');
  }

  private _handleExternalCSS(config: UiConfig): void {
    if (config.css) {
      Utils.Dom.loadStyleSheetAsync(config.css).then(
        () => {
          UIWrapper._logger.debug('external css was loaded successfully');
        },
        () => {
          UIWrapper._logger.error('external css failed to load');
        }
      );
    }
  }

  private _handleVr(config: PluginsConfig = {}): void {
    if (config.vr && !config.vr['disable']) {
      this._setStereoConfig(config.vr);
    }
  }

  private _setStereoConfig(vrConfig: any): void {
    if (vrConfig.toggleStereo || ((Env.isMobile || Env.isTablet) && vrConfig.toggleStereo !== false)) {
      // enable stereo mode by default for mobile device
      this.setConfig(Utils.Object.mergeDeep({}, { vrStereoMode: !!vrConfig.startInStereo }), 'vrStereo');
    }
  }
}

export { UIWrapper };
