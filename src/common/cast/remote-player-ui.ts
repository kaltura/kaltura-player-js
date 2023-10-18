import { Presets } from '@playkit-js/playkit-js-ui';

// TODO - should come from UI
class UIPreset {}

/**
 * @class RemotePlayerUI
 */
class RemotePlayerUI {
  private _uis: Array<UIPreset> = [
    {
      template: (props): any => this.idleUI(props),
      condition: (state): boolean => state.engine.isIdle
    },
    {
      template: (props): any => this.errorUI(props),
      condition: (state): boolean => state.engine.hasError
    },
    {
      template: (props): any => this.adsUI(props),
      condition: (state): boolean => state.engine.adBreak
    },
    {
      template: (props): any => this.liveUI(props),
      condition: (state): boolean => state.engine.isLive
    },
    { template: (props): any => this.playbackUI(props) }
  ];

  /**
   * Playback UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  public playbackUI(props: any): any {
    return Presets.playbackUI(props);
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  public idleUI(props: any): any {
    return Presets.idleUI(props);
  }

  /**
   * Idle UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  public adsUI(props: any): any {
    return Presets.adsUI(props);
  }

  /**
   * Live UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  public liveUI(props: any): any {
    return Presets.liveUI(props);
  }

  /**
   * Error UI of the remote player.
   * @param {Object} props - UI creation parameters.
   * @returns {React$Element<any>} - Component.
   * @instance
   * @memberof RemotePlayerUI
   */
  public errorUI(props: any): any {
    return Presets.errorUI(props);
  }

  /**
   * UI presets.
   * @type {Array<UIPreset>}
   * @instance
   * @memberof RemotePlayerUI
   */
  public get uis(): UIPreset[] {
    return this._uis;
  }
}

export { RemotePlayerUI };
