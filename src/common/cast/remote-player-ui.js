// @flow
import {Presets} from '@playkit-js/playkit-js-ui';

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
    return Presets.playbackUI(props);
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  idleUI(props: Object): any {
    return Presets.idleUI(props);
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  adsUI(props: Object): any {
    return Presets.adsUI(props);
  }

  /**
   * Live UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  liveUI(props: Object): any {
    return Presets.liveUI(props);
  }

  /**
   * Error UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  errorUI(props: Object): any {
    return Presets.errorUI(props);
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
