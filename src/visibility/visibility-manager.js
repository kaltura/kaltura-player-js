// @flow
import LoggerFactory from '../utils/logger'
import {Utils,Player} from 'playkit-js'


class VisibilityManager {

  _visibilityObserver: any;
  _el: HTMLDivElement;
  _player: Player;
  _loadPromise: ?Promise<*>;
  _playPromise: ?Promise<*>;
  _resolveLoad: any;
  _resolvePlay: any;
  _waitingForPlaybackUponVisibility: boolean;

  constructor() {
    let _observerOptions = {
      root: null ,
      rootMargin: "0px" ,
      threshold: [0 , 0.2 , 0.3 , 0.4 , 0.45 , 0.5 , 0.75 , 1.0]
    };
    this._waitingForPlaybackUponVisibility = true;

    this._visibilityObserver = new IntersectionObserver( this._intersectionCallback.bind( this ) , _observerOptions );

  }

  attach( htmlObject: any ): Array {
    this._visibilityObserver.observe( htmlObject );
    this._loadPromise = new Promise((resolve, reject) => {
      this._resolveLoad = resolve;
    });
    this._playPromise = new Promise((resolve, reject) => {
      this._resolvePlay = resolve;
    });
    return [this._loadPromise , this._playPromise];

  }


  _intersectionCallback( entries: any ): void {
    let visiblePct = entries[0].intersectionRatio;
    let visibleDiff = visiblePct - this._lastvisiblePct;
    this._playerIsVisible = visiblePct >= 0.5;    //TODO: Add to configuration
    //this.dispatchEvent( new FakeEvent( CustomEvents.PLAYER_VISIBILITY_CHANGE , {ratio: visiblePct} ) );
    if ( this._waitingForPlaybackUponVisibility && visibleDiff > 0.05 && !this._playerIsVisible ) {
      this._resolveLoad( visiblePct );
    }
    if ( this._waitingForPlaybackUponVisibility && this._playerIsVisible ) {
      this._waitingForPlaybackUponVisibility = false;
      this._resolvePlay( visiblePct );
    }

    this._lastvisiblePct = visiblePct;
  }

  reset(){
    this._waitingForPlaybackUponVisibility = true;
  }

}
export default VisibilityManager;
