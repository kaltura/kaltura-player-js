import { EventManager, Utils } from '@playkit-js/playkit-js';
import { ViewabilityConfig } from '../../types/visibility-config';
/**
 * A service class to observe viewability of elements in the view port.
 */
declare class ViewabilityManager {
  _observer: IntersectionObserver;
  _targetsObserved: Utils.MultiMap<HTMLElement, _TargetObserveredBinding>;
  _config: ViewabilityConfig;
  _eventManager: EventManager;
  _visibilityTabChangeEventName: string;
  _visibilityTabHiddenAttr: string;
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
  constructor(viewabilityConfig: ViewabilityConfig);
  _intersectionChangedHandler(entries: Array<IntersectionObserverEntry>): void;
  _handleTabVisibilityChange(): void;
  _initTabVisibility(): void;
  /**
   * @param {HTMLElement} target - the targeted element to check its visibility
   * @param {Function} listener - the callback to be invoked when visibility is changed (and when starting to observe). The callback is called with a boolean param representing the visibility state
   * @param {?number} optionalThreshold - a number between 0 to 100 that represents the minimum visible percentage considered as visible
   * @returns {void}
   */
  observe(target: HTMLElement, listener: ListenerType, optionalThreshold?: number): void;
  /**
   * Remove the listener from the target
   * @param {HTMLElement} target - the targeted element to remove the listener
   * @param {Function} listener - the callback function to be removed
   * @returns {void}
   */
  unObserve(target: HTMLElement, listener: ListenerType): void;
  /**
   * cleans all memory allocations.
   * @override
   */
  destroy(): void;
}
declare const ViewabilityType: {
  [type: string]: string;
};
type ListenerType = (visible: boolean, reason: string) => any;
declare class _TargetObserveredBinding {
  lastVisible: boolean;
  lastIntersectionRatio: number;
  threshold: number;
  listener: ListenerType;
  constructor(threshold: number, listener: ListenerType);
}
declare const VISIBILITY_CHANGE: string;
declare const DEFAULT_OBSERVED_THRESHOLDS: Array<number>;
declare const DEFAULT_PLAYER_THRESHOLD: number;
export { ViewabilityManager, VISIBILITY_CHANGE, ViewabilityType, DEFAULT_OBSERVED_THRESHOLDS, DEFAULT_PLAYER_THRESHOLD };
//# sourceMappingURL=viewability-manager.d.ts.map
