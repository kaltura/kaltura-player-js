// @flow
import {UIManager} from 'playkit-js-ui'

/**
 * Sets the media info on error component to the "retry" functionality.
 * @param {UIManager} uiManager - The ui manager.
 * @param {ProviderMediaInfoObject} mediaInfo - The media info.
 * @returns {void}
 */
function setUIErrorOverlayConfig(uiManager: UIManager, mediaInfo: ProviderMediaInfoObject): void {
  uiManager.setConfig({
    mediaInfo: mediaInfo
  }, 'error');
}

/**
 * Sets the loading spinner state.
 * @param {UIManager} uiManager - The ui manager.
 * @param {boolean} show - The spinner state.
 * @returns {void}
 */
function setUILoadingSpinnerState(uiManager: UIManager, show: boolean): void {
  uiManager.setConfig({
    show: show
  }, 'loading');
}

export {setUIErrorOverlayConfig, setUILoadingSpinnerState};
