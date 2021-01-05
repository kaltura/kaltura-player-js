//@flow
import {Utils} from '@playkit-js/playkit-js';

/**
 * A service class to observe viewability of elements in the view port.
 */
class ViewabilityManager {
  _observer: window.IntersectionObserver;
  _targetsObserved: Utils.MultiMap<HTMLElement, _TargetObserveredBinding>;
  _viewabilityConfig: KPViewabilityConfigObject;

  /**
   * @param {number} viewabilityConfig - the configuration needed to create the manager
   * @constructor
   */
  constructor(viewabilityConfig: KPViewabilityConfigObject) {
    this._viewabilityConfig = viewabilityConfig;
    this._targetsObserved = new Utils.MultiMap<HTMLElement, _TargetObserveredBinding>();
    const options = {
      threshold: viewabilityConfig.observedThresholds.map((val: number) => {
        return val / 100;
      })
    };
    this._observer = new window.IntersectionObserver(this._intersectionChangedHandler.bind(this), options);
  }

  _intersectionChangedHandler(entries: Array<window.IntersectionObserverEntry>) {
    entries.forEach((entry: window.IntersectionObserverEntry) => {
      const targetObserveredBindings: Array<_TargetObserveredBinding> = this._targetsObserved.get(entry.target);
      targetObserveredBindings.forEach((targetObservedBinding: _TargetObserveredBinding) => {
        const visible = entry.intersectionRatio >= targetObservedBinding.threshold;
        if (visible !== targetObservedBinding.lastVisible) {
          targetObservedBinding.listener(visible);
        }
        targetObservedBinding.lastVisible = visible;
        targetObservedBinding.lastIntersectionRatio = entry.intersectionRatio;
      });
    });
  }

  /**
   * @param {HTMLElement} target - the targeted element to check its visibility
   * @param {Function} listener - the callback to be invoked when visibility is changed (and when starting to observe). The callback is called with a boolean param representing the visibility state
   * @param {?number} threshold - a number between 0 to 100 that represents the minimum visible percentage considered as visible
   * @returns {void}
   */
  observe(target: HTMLElement, listener: Function, threshold: ?number): void {
    threshold = threshold !== undefined ? threshold : this._viewabilityConfig.playerThreshold;
    const newTargetObservedBinding = new _TargetObserveredBinding(threshold / 100, listener);
    if (!this._targetsObserved.has(target)) {
      this._observer.observe(target);
    } else {
      const lastIntersectionRatio = this._targetsObserved.get(target)[0].lastIntersectionRatio;
      // if observer has already fired the initial callback due to previous observing then we need to invoke it to the new observer manually
      if (lastIntersectionRatio !== undefined) {
        newTargetObservedBinding.lastIntersectionRatio = lastIntersectionRatio;
        newTargetObservedBinding.listener(lastIntersectionRatio >= newTargetObservedBinding.threshold);
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
  unObserve(target: HTMLElement, listener: Function): void {
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
    this._observer.disconnect();
    this._targetsObserved.clear();
  }
}

type ListenerType = (visible: boolean) => any;

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
export {ViewabilityManager};
