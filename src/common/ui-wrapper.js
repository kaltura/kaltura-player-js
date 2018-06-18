// @flow
import {UIManager} from 'playkit-js-ui'
import {Env, Utils} from 'playkit-js'
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './utils/thumbs'

class UIWrapper {
  _uiManager: UIManager;
  _disabled: boolean = false;

  constructor(player: Player, config: UIOptionsObject) {
    if (config.disable) {
      this._disabled = true;
      appendPlayerViewToTargetContainer(config.targetId, player.getView());
    } else {
      this._uiManager = new UIManager(player, config);
      if (config.customPreset) {
        this._uiManager.buildCustomUI(config.customPreset)
      } else {
        this._uiManager.buildDefaultUI();
      }
    }
  }

  setConfig(config: Object, componentAlias?: string): void {
    if (this._disabled) return;
    this._uiManager.setConfig(config, componentAlias);
  }

  setErrorPresetConfig(mediaInfo: ProviderMediaInfoObject): void {
    if (this._disabled) return;
    this.setConfig({mediaInfo: mediaInfo}, 'error');
  }

  setSeekbarConfig(mediaConfig: ProviderMediaConfigObject): void {
    if (this._disabled) return;
    const seekbarConfig = Utils.Object.getPropertyPath(this._uiManager, 'config.components.seekbar');
    const previewThumbnailConfig = getPreviewThumbnailConfig(mediaConfig, seekbarConfig);
    this.setConfig(Utils.Object.mergeDeep({}, previewThumbnailConfig, seekbarConfig), 'seekbar');
  }

  handleVr(config: KalturaPlayerOptionsObject): void {
    if (this._disabled) return;
    if (Utils.Object.getPropertyPath(config, 'plugins.vr')) {
      this._setFullscreenConfig();
      this._setStereoConfig(config)
    }
  }

  _setFullscreenConfig(): void {
    const fullscreenConfig = Utils.Object.getPropertyPath(this._uiManager, 'config.components.fullscreen');
    this.setConfig(Utils.Object.mergeDeep({}, {inBrowserFullscreenForIOS: true}, fullscreenConfig), 'fullscreen');
  }

  _setStereoConfig(config: KalturaPlayerOptionsObject): void {
    if (Env.device.type || config.plugins.vr.enableStereo) {
      this.setConfig(Utils.Object.mergeDeep({}, {stereoMode: !!(config.plugins.vr.startInStereo)}), 'stereo');
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
