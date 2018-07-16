// @flow
import {Presets} from 'playkit-js-ui';

class RemotePlayerUI {
  _uis: Array<UIPreset> = [
    {template: props => this.idleUI(props), condition: state => state.engine.isIdle},
    {template: props => this.errorUI(props), condition: state => state.engine.hasError},
    {template: props => this.adsUI(props), condition: state => state.engine.adBreak},
    {template: props => this.liveUI(props), condition: state => state.engine.isLive},
    {template: props => this.playbackUI(props)}
  ];

  playbackUI(props: Object): any {
    return Presets.playbackUI(props);
  }

  idleUI(props: Object): any {
    return Presets.idleUI(props);
  }

  adsUI(props: Object): any {
    return Presets.adsUI(props);
  }

  liveUI(props: Object): any {
    return Presets.liveUI(props);
  }

  errorUI(props: Object): any {
    return Presets.errorUI(props);
  }

  get uis(): Array<UIPreset> {
    return this._uis;
  }
}

export {RemotePlayerUI};
