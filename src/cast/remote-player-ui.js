// @flow
import {UI} from '../ui-wrapper';

/**
 * @class RemotePlayerUI
 */
class RemotePlayerUI {
  _uis: Array<UIPreset> = [
    {template: props => this.idleUI(props), condition: state => state.engine.isIdle},
    {template: props => this.errorUI(props), condition: state => state.engine.hasError},
    {template: props => this.adsUI(props), condition: state => state.engine.adBreak},
    {template: props => this.liveUI(props), condition: state => state.engine.isLive},
    {template: props => this.playbackUI(props)}
  ];

  /**
   * Playback UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  playbackUI(props: Object): any {
    if (UI) {
      return UI.Presets.playbackUI(props);
    }
    return null;
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  idleUI(props: Object): any {
    if (UI) {
      return UI.Presets.idleUI(props);
    }
    return null;
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  adsUI(props: Object): any {
    if (UI) {
      return UI.Presets.adsUI(props);
    }
    return null;
  }

  /**
   * Live UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  liveUI(props: Object): any {
    if (UI) {
      return UI.Presets.liveUI(props);
    }
    return null;
  }

  /**
   * Error UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  errorUI(props: Object): any {
    if (UI) {
      return UI.Presets.errorUI(props);
    }
    return null;
  }

  /**
   * UI presets.
   * @type {Array<UIPreset>}
   * @instance
   * @memberof RemotePlayerUI
   */
  get uis(): Array<UIPreset> {
    return this._uis;
  }
}

export {RemotePlayerUI};
