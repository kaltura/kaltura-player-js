'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DEFAULT_PLAYER_THRESHOLD = exports.DEFAULT_OBSERVED_THRESHOLDS = exports.ViewabilityType = exports.VISIBILITY_CHANGE = exports.ViewabilityManager = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
/**
 * A service class to observe viewability of elements in the view port.
 */
var ViewabilityManager = /** @class */ (function () {
  /**
   * @param {number} viewabilityConfig - the configuration needed to create the manager
   * @constructor
   */
  function ViewabilityManager(viewabilityConfig) {
    viewabilityConfig.observedThresholds = viewabilityConfig.observedThresholds || DEFAULT_OBSERVED_THRESHOLDS;
    viewabilityConfig.playerThreshold = typeof viewabilityConfig.playerThreshold === 'number' ? viewabilityConfig.playerThreshold : DEFAULT_PLAYER_THRESHOLD;
    this._config = viewabilityConfig;
    this._eventManager = new playkit_js_1.EventManager();
    this._targetsObserved = new playkit_js_1.Utils.MultiMap();
    var options = {
      threshold: viewabilityConfig.observedThresholds.map(function (val) {
        return val / 100;
      })
    };
    this._observer = new window.IntersectionObserver(this._intersectionChangedHandler.bind(this), options);
    this._initTabVisibility();
  }
  ViewabilityManager.prototype._intersectionChangedHandler = function (entries) {
    var _this = this;
    entries.forEach(function (entry) {
      var targetObserveredBindings = _this._targetsObserved.get(entry.target);
      targetObserveredBindings.forEach(function (targetObservedBinding) {
        var visible = entry.intersectionRatio >= targetObservedBinding.threshold;
        targetObservedBinding.lastIntersectionRatio = entry.intersectionRatio;
        if (visible !== targetObservedBinding.lastVisible) {
          targetObservedBinding.lastVisible = visible;
          targetObservedBinding.listener(visible, ViewabilityType.VIEWPORT);
        }
      });
    });
  };
  ViewabilityManager.prototype._handleTabVisibilityChange = function () {
    var _this = this;
    this._isTabVisible = !document[this._visibilityTabHiddenAttr];
    this._targetsObserved.getAll().forEach(function (targetObservedBinding) {
      if (targetObservedBinding.lastVisible) {
        targetObservedBinding.listener(_this._isTabVisible, ViewabilityType.TAB);
      }
    });
  };
  ViewabilityManager.prototype._initTabVisibility = function () {
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      this._visibilityTabHiddenAttr = 'hidden';
      this._visibilityTabChangeEventName = 'visibilitychange';
    }
    if (this._visibilityTabHiddenAttr && this._visibilityTabChangeEventName) {
      this._eventManager.listen(document, this._visibilityTabChangeEventName, this._handleTabVisibilityChange.bind(this));
      this._isTabVisible = !document[this._visibilityTabHiddenAttr];
    }
  };
  /**
   * @param {HTMLElement} target - the targeted element to check its visibility
   * @param {Function} listener - the callback to be invoked when visibility is changed (and when starting to observe). The callback is called with a boolean param representing the visibility state
   * @param {?number} optionalThreshold - a number between 0 to 100 that represents the minimum visible percentage considered as visible
   * @returns {void}
   */
  ViewabilityManager.prototype.observe = function (target, listener, optionalThreshold) {
    if (!this._observer) return;
    var threshold = typeof optionalThreshold == 'number' ? optionalThreshold : this._config.playerThreshold;
    var newTargetObservedBinding = new _TargetObserveredBinding(threshold / 100, listener);
    if (!this._targetsObserved.has(target)) {
      this._observer.observe(target);
    } else {
      var lastIntersectionRatio = this._targetsObserved.get(target)[0].lastIntersectionRatio;
      // if observer has already fired the initial callback due to previous observing then we need to invoke it to the new observer manually
      if (lastIntersectionRatio !== undefined) {
        newTargetObservedBinding.lastIntersectionRatio = lastIntersectionRatio;
        newTargetObservedBinding.listener(this._isTabVisible && lastIntersectionRatio >= newTargetObservedBinding.threshold, ViewabilityType.VIEWPORT);
      }
    }
    this._targetsObserved.push(target, newTargetObservedBinding);
  };
  /**
   * Remove the listener from the target
   * @param {HTMLElement} target - the targeted element to remove the listener
   * @param {Function} listener - the callback function to be removed
   * @returns {void}
   */
  ViewabilityManager.prototype.unObserve = function (target, listener) {
    if (!this._observer) return;
    this._targetsObserved.remove(target, listener);
    if (!this._targetsObserved.has(target)) {
      this._observer.unobserve(target);
    }
  };
  /**
   * cleans all memory allocations.
   * @override
   */
  ViewabilityManager.prototype.destroy = function () {
    if (!this._observer) return;
    this._eventManager.destroy();
    this._observer.disconnect();
    this._targetsObserved.clear();
  };
  return ViewabilityManager;
})();
exports.ViewabilityManager = ViewabilityManager;
var ViewabilityType = {
  VIEWPORT: 'viewport',
  TAB: 'tab'
};
exports.ViewabilityType = ViewabilityType;
var _TargetObserveredBinding = /** @class */ (function () {
  function _TargetObserveredBinding(threshold, listener) {
    this.threshold = threshold;
    this.listener = listener;
  }
  return _TargetObserveredBinding;
})();
var VISIBILITY_CHANGE = 'visibilitychange';
exports.VISIBILITY_CHANGE = VISIBILITY_CHANGE;
var DEFAULT_OBSERVED_THRESHOLDS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
exports.DEFAULT_OBSERVED_THRESHOLDS = DEFAULT_OBSERVED_THRESHOLDS;
var DEFAULT_PLAYER_THRESHOLD = 50;
exports.DEFAULT_PLAYER_THRESHOLD = DEFAULT_PLAYER_THRESHOLD;
//# sourceMappingURL=viewability-manager.js.map
