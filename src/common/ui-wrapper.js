// @flow
import {UIManager} from 'playkit-js-ui';
import {Env, Utils} from 'playkit-js';
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './utils/thumbs';

class UIWrapper {
  _uiManager: UIManager;
  _disabled: boolean = false;

  constructor(player: Player, options: KalturaPlayerOptionsObject) {
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
  }

  setConfig(config: Object, componentAlias?: string): void {
    if (this._disabled) return;
    this._uiManager.setConfig(config, componentAlias);
  }

  resetErrorConfig(mediaInfo: ProviderMediaInfoObject): void {
    if (this._disabled) return;
    this._setErrorPresetConfig(mediaInfo);
    this._resetErrorState();
  }

  _setErrorPresetConfig(mediaInfo: ProviderMediaInfoObject): void {
    this.setConfig({mediaInfo: mediaInfo}, 'error');
  }

  _resetErrorState(): void {
    this.setConfig({hasError: false}, 'engine');
  }

  setSeekbarConfig(mediaConfig: ProviderMediaConfigObject, uiConfig: UIOptionsObject): void {
    if (this._disabled) return;
    const seekbarConfig = Utils.Object.getPropertyPath(uiConfig, 'components.seekbar');
    const previewThumbnailConfig = getPreviewThumbnailConfig(mediaConfig, seekbarConfig);
    this.setConfig(Utils.Object.mergeDeep({}, previewThumbnailConfig, seekbarConfig), 'seekbar');
  }

  _handleVr(config: PKPluginsConfigObject = {}): void {
    if (config.vr && !config.vr.disable) {
      this._setFullscreenConfig();
      this._setStereoConfig(config.vr);
    }
  }

  _setFullscreenConfig(): void {
    const fullscreenConfig = Utils.Object.getPropertyPath(this._uiManager, 'config.components.fullscreen');
    this.setConfig(Utils.Object.mergeDeep({}, {inBrowserFullscreenForIOS: true}, fullscreenConfig), 'fullscreen');
  }

  _setStereoConfig(vrConfig: Object): void {
    if (vrConfig.toggleStereo || (Env.device.type && vrConfig.toggleStereo !== false)) {
      // enable stereo mode by default for mobile device
      this.setConfig(Utils.Object.mergeDeep({}, {vrStereoMode: !!vrConfig.startInStereo}), 'vrStereo');
    }
  }

  setLoadingSpinnerState(show: boolean): void {
    if (this._disabled) return;
    this.setConfig({show: show}, 'loading');
  }
}

/**
 * Appends the player view to the target element in the dom.
 * @param {string} targetId - The target id.
 * @param {HTMLDivElement} view - The player div element.
 * @returns {void}
 */
function appendPlayerViewToTargetContainer(targetId: string, view: HTMLDivElement): void {
  const targetContainer = document.getElementById(targetId);
  if (targetContainer) {
    targetContainer.appendChild(view);
  }
}

/**
 * Gets the preview thumbnail config for the ui seekbar component.
 * @param {ProviderMediaConfigObject} mediaConfig - The provider media config.
 * @param {SeekbarConfig} seekbarConfig - The seek bar config.
 * @returns {?Object} - The seekbar component config.
 */
function getPreviewThumbnailConfig(mediaConfig: ProviderMediaConfigObject, seekbarConfig: SeekbarConfig): ?Object {
  const mediaConfigPoster = mediaConfig.sources && mediaConfig.sources.poster;
  if (typeof mediaConfigPoster === 'string') {
    const regex = /.*\/p\/(\d+)\/.*\/thumbnail\/entry_id\/(\w+)\/.*\d+/;
    if (regex.test(mediaConfigPoster)) {
      return {
        thumbsSprite: getThumbSlicesUrl(mediaConfig, seekbarConfig),
        thumbsWidth: DEFAULT_THUMBS_WIDTH,
        thumbsSlices: DEFAULT_THUMBS_SLICES
      };
    }
  }
}

export {UIWrapper};
