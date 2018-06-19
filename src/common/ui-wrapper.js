// @flow
import {UIManager} from 'playkit-js-ui'
import {Utils} from 'playkit-js'
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './utils/thumbs'

class UIWrapper {
  _targetId: string;
  _uiManager: UIManager;
  _disabled: boolean = false;

  constructor(player: Player, config: UIOptionsObject) {
    this._targetId = config.targetId;
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

  destroy(): void {
    if (!this._disabled) {
      this._uiManager.destroy();
    }
    const targetContainer = document.getElementById(this._targetId);
    if (targetContainer && targetContainer.parentNode) {
      targetContainer.parentNode.removeChild(targetContainer);
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
