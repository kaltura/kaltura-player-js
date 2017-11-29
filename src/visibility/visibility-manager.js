// @flow
import {Utils,Player,FakeEventTarget,FakeEvent} from 'playkit-js'


class VisibilityManager extends FakeEventTarget {
  static VisbilityEvent: { [key: string]: string } = {
    VISIBILITY_CHANGE: 'visibilityChange',
    VISIBILITY_LOAD: 'visibilityLoad',
    VISIBILITY_PLAY: 'visibilityPlay',
    VISIBILITY_PAUSE: 'visibilityPause'
  };
  _visibilityObserver: any;
  _el: HTMLDivElement;
  _player: Player;
  _waitingForPlaybackUponVisibility: boolean;
  _visbilityRatio: number;
  _playerIsVisible: boolean;
  _lastvisiblePct: number;


  constructor(visbiltiyRatio: number) {
    super();
    let _observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: [0, 0.2, 0.3, 0.4, 0.45, 0.5, 0.65, 0.75, 0.9, 1.0]
    };
    this._waitingForPlaybackUponVisibility = true;
    this._visbilityRatio = 0.5;
    if (visbiltiyRatio && visbiltiyRatio >= 0 && visbiltiyRatio <= 1) {
      this._visbilityRatio = visbiltiyRatio;
    }
    this._visibilityObserver = new IntersectionObserver(this._intersectionCallback.bind(this), _observerOptions);
  }

  attach(htmlObject: any) {
    this._visibilityObserver.observe(htmlObject);
  }

  detach() {
    this._visibilityObserver.disconnect();
  }


  _intersectionCallback(entries: any): void {
    let visiblePct = entries[0].intersectionRatio;
    let visibleDiff = visiblePct - this._lastvisiblePct;
    this._playerIsVisible = visiblePct >= this._visbilityRatio;
    this.dispatchEvent(new FakeEvent(VisibilityManager.VisbilityEvent.VISIBILITY_CHANGE, {visibilityRatio: visiblePct}));

    if (this._waitingForPlaybackUponVisibility && visibleDiff > 0.05 && !this._playerIsVisible) {
      this.dispatchEvent(new FakeEvent(VisibilityManager.VisbilityEvent.VISIBILITY_LOAD, {visibilityRatio: visiblePct}));
    }

    if (this._waitingForPlaybackUponVisibility && this._playerIsVisible) {
      this._waitingForPlaybackUponVisibility = false;
      this.dispatchEvent(new FakeEvent(VisibilityManager.VisbilityEvent.VISIBILITY_PLAY, {visibilityRatio: visiblePct}));
    }

    if (!this._playerIsVisible && !this._waitingForPlaybackUponVisibility) {
      this._waitingForPlaybackUponVisibility = true;
      this.dispatchEvent(new FakeEvent(VisibilityManager.VisbilityEvent.VISIBILITY_PAUSE, {visibilityRatio: visiblePct}));

    }

    this._lastvisiblePct = visiblePct;
  }

  reset() {
    this._waitingForPlaybackUponVisibility = true;
  }
}
export default VisibilityManager;
