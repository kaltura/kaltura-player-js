// @flow
import {UIManager, Components} from '@playkit-js/playkit-js-ui';
import {Env, getLogger, Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../kaltura-player';

/**
 * The logger of the UIWrapper class.
 * @private
 * @const
 */
class UIWrapper {
  static _logger = getLogger('UIWrapper');
  _uiManager: UIManager;
  _disabled: boolean = false;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    const config: KPUIOptionsObject = options.ui;
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
      get: (uiw: UIWrapper, prop: string) => {
        if (this._disabled) return () => undefined;
        // $FlowFixMe
        return uiw[prop];
      }
    });
  }

  destroy(): void {
    this._uiManager.destroy();
  }

  reset(): void {
    this._resetErrorState();
  }

  setConfig(config: Object, componentAlias?: string): void {
    this._uiManager.setConfig(config, componentAlias);
  }

  /**
   * Add a component dynamically
   *
   * @param {KPUIAddComponent} component - The component to add
   * @returns {Function} - Removal function
   */
  addComponent(component: KPUIAddComponent): Function {
    return this._uiManager.addComponent(component);
  }

  /**
   * Remove a component dynamically
   *
   * @param {KPUIRemoveComponent} component - The component to remove
   * @returns {Function} - Undo removal function
   */
  removeComponent(component: KPUIRemoveComponent): Function {
    let replaceComponent: KPUIAddComponent = {
      label: `Remove_${component.removeComponent}`,
      get: Components.Remove,
      presets: component.presets,
      area: component.area || (component: any).container, // supporting also "container" prop for backward compatibility
      replaceComponent: component.removeComponent
    };
    return this._uiManager.addComponent(replaceComponent);
  }
  
  setLoadingSpinnerState(show: boolean): void {
    this.setConfig({show: show}, 'loading');
  }

  _resetErrorState(): void {
    this.setConfig({hasError: false}, 'engine');
  }

  _handleExternalCSS(config: KPUIOptionsObject): void {
    if (config.css) {
      Utils.Dom.loadStyleSheetAsync(config.css).then(
        () => {
          UIWrapper._logger.debug(`external css was loaded successfully`);
        },
        () => {
          UIWrapper._logger.error(`external css failed to load`);
        }
      );
    }
  }

  _handleVr(config: KPPluginsConfigObject = {}): void {
    if (config.vr && !config.vr.disable) {
      this._setStereoConfig(config.vr);
    }
  }

  _setStereoConfig(vrConfig: Object): void {
    if (vrConfig.toggleStereo || ((Env.isMobile || Env.isTablet) && vrConfig.toggleStereo !== false)) {
      // enable stereo mode by default for mobile device
      this.setConfig(Utils.Object.mergeDeep({}, {vrStereoMode: !!vrConfig.startInStereo}), 'vrStereo');
    }
  }
}

export {UIWrapper};
