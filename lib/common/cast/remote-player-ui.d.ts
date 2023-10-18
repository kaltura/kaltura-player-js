declare class UIPreset {}
/**
 * @class RemotePlayerUI
 */
declare class RemotePlayerUI {
  private _uis;
  /**
   * Playback UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  playbackUI(props: Object): any;
  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  idleUI(props: Object): any;
  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  adsUI(props: Object): any;
  /**
   * Live UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  liveUI(props: Object): any;
  /**
   * Error UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  errorUI(props: Object): any;
  /**
   * UI presets.
   * @type {Array<UIPreset>}
   * @instance
   * @memberof RemotePlayerUI
   */
  get uis(): UIPreset[];
}
export { RemotePlayerUI };
//# sourceMappingURL=remote-player-ui.d.ts.map
