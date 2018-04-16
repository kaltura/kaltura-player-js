// @flow
import {UIManager} from 'playkit-js-ui'
import {getPreviewThumbnailConfig} from 'poster-and-thumbs'

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
    this._uiManager.setConfig({mediaInfo: mediaInfo}, 'error');
  }

  setSeekbarConfig(mediaConfig: Object): void {
    if (this._disabled) return;
    const seekbarConfig = getPreviewThumbnailConfig(this._uiManager, mediaConfig);
    if (seekbarConfig) {
      this._uiManager.setConfig(seekbarConfig, 'seekbar');
    }
  }

  setLoadingSpinnerState(show: boolean): void {
    if (this._disabled) return;
    this._uiManager.setConfig({show: show}, 'loading');
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

export {UIWrapper};
