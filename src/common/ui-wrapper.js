// @flow
import {UIManager} from '@playkit-js/playkit-js-ui';
import {Env, Utils} from '@playkit-js/playkit-js';
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './utils/thumbs';
import {KalturaPlayer} from '../kaltura-player';

class UIWrapper {
  _uiManager: UIManager;
  _disabled: boolean = false;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    const config: UIOptionsObject = options.ui;
    if (config.disable) {
      this._disabled = true;
      appendPlayerViewToTargetContainer(config.targetId, player.getView());
    } else {
      this._uiManager = new UIManager(player, config);
      if (config.customPreset) {
        this._uiManager.buildCustomUI(config.customPreset);
      } else {
        this._uiManager.buildDefaultUI();
      }
      this._handleVr(options.plugins);
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

  _resetErrorState(): void {
    this.setConfig({hasError: false}, 'engine');
  }

  setSeekbarConfig(mediaConfig: ProviderMediaConfigObject, uiConfig: UIOptionsObject): void {
    const seekbarConfig = Utils.Object.getPropertyPath(uiConfig, 'components.seekbar');
    const previewThumbnailConfig = getPreviewThumbnailConfig(mediaConfig, seekbarConfig);
    this.setConfig(Utils.Object.mergeDeep({}, previewThumbnailConfig, seekbarConfig), 'seekbar');
  }

  setLoadingSpinnerState(show: boolean): void {
    this.setConfig({show: show}, 'loading');
  }

  _handleVr(config: PKPluginsConfigObject = {}): void {
    if (config.vr && !config.vr.disable) {
      this._setStereoConfig(config.vr);
    }
  }

  _setStereoConfig(vrConfig: Object): void {
    if (vrConfig.toggleStereo || (Env.device.type && vrConfig.toggleStereo !== false)) {
      // enable stereo mode by default for mobile device
      this.setConfig(Utils.Object.mergeDeep({}, {vrStereoMode: !!vrConfig.startInStereo}), 'vrStereo');
    }
  }
}

/**
 * Appends the player view to the target element in the dom.
 * @private
 * @param {string} targetId - The target id.
 * @param {HTMLElement} view - The player div element.
 * @returns {void}
 */
function appendPlayerViewToTargetContainer(targetId: string, view: HTMLElement): void {
  const targetContainer = document.getElementById(targetId);
  if (targetContainer) {
    targetContainer.appendChild(view);
  }
}

/**
 * Gets the preview thumbnail config for the ui seekbar component.
 * @private
 * @param {ProviderMediaConfigObject} mediaConfig - The provider media config.
 * @param {SeekbarConfig} seekbarConfig - The seek bar config.
 * @returns {SeekbarConfig} - The seekbar component config.
 */
function getPreviewThumbnailConfig(mediaConfig: ProviderMediaConfigObject, seekbarConfig: SeekbarConfig): SeekbarConfig {
  const previewThumbnailConfig: SeekbarConfig = {
    thumbsSprite: getThumbSlicesUrl(mediaConfig, seekbarConfig),
    thumbsWidth: DEFAULT_THUMBS_WIDTH,
    thumbsSlices: DEFAULT_THUMBS_SLICES
  };
  return previewThumbnailConfig;
}

export {UIWrapper};
