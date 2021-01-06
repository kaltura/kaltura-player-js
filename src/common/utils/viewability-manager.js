//@flow
import {EventManager, Utils} from '@playkit-js/playkit-js';

/**
 * A service class to observe viewability of elements in the view port.
 */
class ViewabilityManager {
  _observer: window.IntersectionObserver;
  _targetsObserved: Utils.MultiMap<HTMLElement, _TargetObserveredBinding>;
  _viewabilityConfig: KPViewabilityConfigObject;
  _eventManager: EventManager;

  /**
   * Whether the player browser tab is active or not
   * @type {boolean}
   * @private
   */
  _isTabVisible: boolean;

  /**
   * @param {number} viewabilityConfig - the configuration needed to create the manager
   * @constructor
   */
  constructor(viewabilityConfig: KPViewabilityConfigObject) {
    this._viewabilityConfig = viewabilityConfig;
    this._eventManager = new EventManager();
    this._targetsObserved = new Utils.MultiMap<HTMLElement, _TargetObserveredBinding>();
    const options = {
      threshold: viewabilityConfig.observedThresholds.map((val: number) => {
        return val / 100;
      })
    };
    this._observer = new window.IntersectionObserver(this._intersectionChangedHandler.bind(this), options);
    this._initTabVisibility();
  }

  _intersectionChangedHandler(entries: Array<window.IntersectionObserverEntry>) {
    entries.forEach((entry: window.IntersectionObserverEntry) => {
      const targetObserveredBindings: Array<_TargetObserveredBinding> = this._targetsObserved.get(entry.target);
      targetObserveredBindings.forEach((targetObservedBinding: _TargetObserveredBinding) => {
        const visible = entry.intersectionRatio >= targetObservedBinding.threshold;
        if (visible !== targetObservedBinding.lastVisible) {
          targetObservedBinding.listener(visible, ViewabilityType.VIEWPORT);
        }
        targetObservedBinding.lastVisible = visible;
        targetObservedBinding.lastIntersectionRatio = entry.intersectionRatio;
      });
    });
  }

  _handleTabVisibilityChange() {
    this._isTabVisible = !document[this._visibilityTabHiddenAttr];
    this._targetsObserved.getAll().forEach((targetObservedBinding: _TargetObserveredBinding) => {
      if (targetObservedBinding.lastVisible) {
        targetObservedBinding.listener(this._isTabVisible, ViewabilityType.TAB);
      }
    });
  }

  _initTabVisibility(): void {
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      this._visibilityTabHiddenAttr = 'hidden';
      this._visibilityTabChangeEventName = 'visibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
      this._visibilityTabHiddenAttr = 'msHidden';
      this._visibilityTabChangeEventName = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      this._visibilityTabHiddenAttr = 'webkitHidden';
      this._visibilityTabChangeEventName = 'webkitvisibilitychange';
    }

    if (this._visibilityTabHiddenAttr && this._visibilityTabChangeEventName) {
      this._eventManager.listen(document, this._visibilityTabChangeEventName, this._handleTabVisibilityChange.bind(this));
      this._isTabVisible = !document[this._visibilityTabHiddenAttr];
    }
  }

  /**
   * @param {HTMLElement} target - the targeted element to check its visibility
   * @param {Function} listener - the callback to be invoked when visibility is changed (and when starting to observe). The callback is called with a boolean param representing the visibility state
   * @param {?number} threshold - a number between 0 to 100 that represents the minimum visible percentage considered as visible
   * @returns {void}
   */
  observe(target: HTMLElement, listener: ListenerType, threshold: ?number): void {
    threshold = threshold !== undefined ? threshold : this._viewabilityConfig.playerThreshold;
    const newTargetObservedBinding = new _TargetObserveredBinding(threshold / 100, listener);
    if (!this._targetsObserved.has(target)) {
      this._observer.observe(target);
    } else {
      const lastIntersectionRatio = this._targetsObserved.get(target)[0].lastIntersectionRatio;
      // if observer has already fired the initial callback due to previous observing then we need to invoke it to the new observer manually
      if (lastIntersectionRatio !== undefined) {
        newTargetObservedBinding.lastIntersectionRatio = lastIntersectionRatio;
        newTargetObservedBinding.listener(
          this._isTabVisible && lastIntersectionRatio >= newTargetObservedBinding.threshold,
          VisibilityChangeReason.VIEWPORT
        );
      }
    }
    this._targetsObserved.push(target, newTargetObservedBinding);
  }

  /**
   * Remove the listener from the target
   * @param {HTMLElement} target - the targeted element to remove the listener
   * @param {Function} listener - the callback function to be removed
   * @returns {void}
   */
  unObserve(target: HTMLElement, listener: ListenerType): void {
    this._targetsObserved.remove(target, listener);
    if (!this._targetsObserved.has(target)) {
      this._observer.unobserve(target);
    }
  }
  /**
   * cleans all memory allocations.
   * @override
   */
  destroy() {
    this._eventManager.destroy();
    this._observer.disconnect();
    this._targetsObserved.clear();
  }
}

const ViewabilityType: {[type: string]: string} = {
  VIEWPORT: 'viewport',
  TAB: 'tab'
};

type ListenerType = (visible: boolean, reason: string) => any;

class _TargetObserveredBinding {
  lastVisible: boolean;
  lastIntersectionRatio: boolean;
  threshold: number;
  listener: ListenerType;

  constructor(threshold: number, listener: ListenerType) {
    this.threshold = threshold;
    this.listener = listener;
  }
}
const VISIBILITY_CHANGE = 'visibilitychange';
export {ViewabilityManager, VISIBILITY_CHANGE, ViewabilityType};
