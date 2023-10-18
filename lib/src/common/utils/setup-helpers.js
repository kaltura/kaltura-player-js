'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.KALTURA_PLAYER_START_TIME_QS =
  exports.getServerUIConf =
  exports.mergeProviderPluginsConfig =
  exports.hasImageSource =
  exports.hasYoutubeSource =
  exports.maybeSetStreamPriority =
  exports.getDefaultOptions =
  exports.checkNativeHlsSupport =
  exports.createKalturaPlayerContainer =
  exports.maybeApplyStartTimeQueryParam =
  exports.setLogOptions =
  exports.validateProviderConfig =
  exports.validateConfig =
  exports.attachToFirstClick =
  exports.setStorageTextStyle =
  exports.applyCastSupport =
  exports.applyStorageSupport =
  exports.setStorageConfig =
  exports.printKalturaPlayerVersionToLog =
  exports.supportLegacyOptions =
  exports.printSetupMessages =
    void 0;
// @ts-ignore
var player_defaults_1 = require('player-defaults');
var playkit_js_1 = require('@playkit-js/playkit-js');
var validation_error_1 = require('./validation-error');
var storage_manager_1 = require('../storage/storage-manager');
var kaltura_params_1 = require('./kaltura-params');
var viewability_manager_1 = require('./viewability-manager');
var setupMessages = [];
var CONTAINER_CLASS_NAME = 'kaltura-player-container';
var KALTURA_PLAYER_DEBUG_QS = 'debugKalturaPlayer';
var KALTURA_PLAYER_START_TIME_QS = 'kalturaStartTime';
exports.KALTURA_PLAYER_START_TIME_QS = KALTURA_PLAYER_START_TIME_QS;
var KAVA_DEFAULT_PARTNER = 2504201;
var KAVA_DEFAULT_IMPRESSION = 'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId='.concat(
  KAVA_DEFAULT_PARTNER,
  '&entryId=1_3bwzbc9o&&eventIndex=1&position=0'
);
/**
 * Validate the initial user config.
 * @private
 * @param {PartialKPOptionsObject} options - partial kaltura player options.
 * @returns {void}
 */
function validateConfig(options) {
  if (!options) {
    throw new Error(validation_error_1.ValidationErrorType.INITIAL_CONFIG_REQUIRED);
  }
  validateTargetId(options.targetId);
}
exports.validateConfig = validateConfig;
/**
 * Validate the user input for target id.
 * @private
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId) {
  if (!targetId) {
    throw new Error(validation_error_1.ValidationErrorType.TARGET_ID_REQUIRED);
  }
  var targetIdElement = document.getElementById(targetId);
  if (!targetIdElement) {
    throw new Error(validation_error_1.ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + targetId);
  }
  if (targetIdElement.getElementsByClassName(CONTAINER_CLASS_NAME).length > 0) {
    throw new Error(validation_error_1.ValidationErrorType.TARGET_ID_ALREADY_USED + targetId);
  }
}
/**
 * @param {string} url - url
 * @param {string} productVersion - product version
 * @return {string} - the url with the product version appended in the query params
 * @private
 */
function addProductVersion(url, productVersion) {
  if (productVersion) {
    url += '&clientVer='.concat(productVersion);
  }
  return url;
}
/**
 * Validate the initial user input for the provider options.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function validateProviderConfig(options) {
  var _a;
  var providerOptions = options.provider;
  var productVersion = (_a = getServerUIConf()) === null || _a === void 0 ? void 0 : _a.productVersion;
  if (!providerOptions.partnerId || providerOptions.partnerId === KAVA_DEFAULT_PARTNER) {
    //create source object as a 'hack' to be able to use utility functions on url
    var source = {
      url: KAVA_DEFAULT_IMPRESSION,
      mimetype: ''
    };
    source.url = addProductVersion(source.url, productVersion);
    source.url = (0, kaltura_params_1.addReferrer)(source.url);
    source.url = (0, kaltura_params_1.addClientTag)(source.url, productVersion);
    source.url = (0, kaltura_params_1.updateSessionIdInUrl)(source.url, playkit_js_1.Utils.Generator.guid() + ':' + playkit_js_1.Utils.Generator.guid());
    navigator.sendBeacon && navigator.sendBeacon(source.url);
  }
}
exports.validateProviderConfig = validateProviderConfig;
/**
 * Creates the player container dom element.
 * @private
 * @param {string} targetId - The div id which the player will append to.
 * @returns {string} - The player container id.
 */
function createKalturaPlayerContainer(targetId) {
  var el = document.createElement('div');
  el.id = playkit_js_1.Utils.Generator.uniqueId(5);
  el.className = CONTAINER_CLASS_NAME;
  el.setAttribute('tabindex', '-1');
  var parentNode = document.getElementById(targetId);
  if (parentNode && el) {
    parentNode.appendChild(el);
  }
  return el.id;
}
exports.createKalturaPlayerContainer = createKalturaPlayerContainer;
/**
 * Sets the storage config on the player config if certain conditions are met.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function setStorageConfig(options) {
  if (!options.disableUserCache && storage_manager_1.default.isLocalStorageAvailable() && storage_manager_1.default.hasStorage()) {
    playkit_js_1.Utils.Object.mergeDeep(options, storage_manager_1.default.getStorageConfig());
  }
}
exports.setStorageConfig = setStorageConfig;
/**
 * Applies cache support if it's supported by the environment.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyStorageSupport(player) {
  if (storage_manager_1.default.isLocalStorageAvailable()) {
    storage_manager_1.default.attach(player);
  }
}
exports.applyStorageSupport = applyStorageSupport;
/**
 * Loads the registered remote players.
 * @private
 * @param {KalturaPlayerConfig} defaultOptions - The kaltura player options.
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyCastSupport(defaultOptions, player) {
  if (defaultOptions.cast) {
    // @ts-ignore
    player.remotePlayerManager.load(defaultOptions.cast, player);
  }
}
exports.applyCastSupport = applyCastSupport;
/**
 * Sets the player text style from storage.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function setStorageTextStyle(player) {
  // @ts-ignore
  if (!player.config.disableUserCache && storage_manager_1.default.isLocalStorageAvailable()) {
    var textStyleObj = storage_manager_1.default.getPlayerTextStyle();
    if (textStyleObj) {
      // @ts-ignore
      player.textStyle = playkit_js_1.Utils.Object.mergeDeep(new playkit_js_1.TextStyle(), textStyleObj);
    }
  }
}
exports.setStorageTextStyle = setStorageTextStyle;
/**
 * Call to setCapabilities on the first UI_CLICKED event
 * @private
 * @param {Player} player - The Kaltura player.
 * @returns {void}
 */
function attachToFirstClick(player) {
  if (playkit_js_1.Env.isIOS || playkit_js_1.Env.isIPadOS) {
    var onUIClicked_1 = function () {
      // @ts-ignore
      player.removeEventListener(player.Event.UI.UI_CLICKED, onUIClicked_1);
      (0, playkit_js_1.setCapabilities)(playkit_js_1.EngineType.HTML5, {
        autoplay: true
      });
    };
    var onSourceSelected_1 = function () {
      // @ts-ignore
      player.removeEventListener(player.Event.SOURCE_SELECTED, onSourceSelected_1);
      // @ts-ignore
      player.addEventListener(player.Event.UI.UI_CLICKED, onUIClicked_1);
    };
    // @ts-ignore
    player.addEventListener(player.Event.SOURCE_SELECTED, onSourceSelected_1);
  }
}
exports.attachToFirstClick = attachToFirstClick;
/**
 * check the player debug mode according to config or URL query string params
 * @private
 * @returns {boolean} - if to set debug mode or not
 */
function isDebugMode() {
  var isDebugMode = false;
  if (window.DEBUG_KALTURA_PLAYER === true) {
    isDebugMode = true;
  } else {
    isDebugMode = getUrlParameter(KALTURA_PLAYER_DEBUG_QS) === '';
  }
  return isDebugMode;
}
/**
 * get the parameter for start time
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeApplyStartTimeQueryParam(options) {
  var startTime = parseFloat(getUrlParameter(KALTURA_PLAYER_START_TIME_QS));
  if (!isNaN(startTime)) {
    playkit_js_1.Utils.Object.createPropertyPath(options, 'sources.startTime', startTime);
  }
}
exports.maybeApplyStartTimeQueryParam = maybeApplyStartTimeQueryParam;
/**
 * set the logger
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function setLogOptions(options) {
  if (!playkit_js_1.Utils.Object.getPropertyPath(options, 'ui.log')) {
    playkit_js_1.Utils.Object.createPropertyPath(options, 'ui.log', {});
  }
  if (!playkit_js_1.Utils.Object.getPropertyPath(options, 'provider.log')) {
    playkit_js_1.Utils.Object.createPropertyPath(options, 'provider.log', {});
  }
  if (!playkit_js_1.Utils.Object.getPropertyPath(options, 'log')) {
    playkit_js_1.Utils.Object.createPropertyPath(options, 'log', {});
  }
  if (options.log && typeof options.log.handler === 'function') {
    (0, playkit_js_1.setLogHandler)(options.log.handler);
    // $FlowFixMe
    // @ts-ignore
    options.ui.log.handler = options.provider.log.handler = options.log.handler;
  }
  var logLevelObj = playkit_js_1.LogLevel.ERROR;
  if (options.log && isDebugMode()) {
    logLevelObj = playkit_js_1.LogLevel.DEBUG;
    options.log.level = playkit_js_1.LogLevel.DEBUG.name;
  } else if (options.log && options.log.level && playkit_js_1.LogLevel[options.log.level]) {
    logLevelObj = playkit_js_1.LogLevel[options.log.level];
  }
  // $FlowFixMe
  // @ts-ignore
  options.ui.log.level = options.provider.log.level = logLevelObj.name;
  (0, playkit_js_1.setLogLevel)(logLevelObj);
}
exports.setLogOptions = setLogOptions;
/**
 * gets the url query string parameter
 * @private
 * @param {string} name - name of query string param
 * @returns {?string} - value of the query string param or null if doesn't exist
 */
function getUrlParameter(name) {
  var getUrlParamPolyfill = function (name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    var isExist = location.search.indexOf(name) > -1;
    return results === null ? (isExist ? '' : null) : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  var value;
  if (window.URLSearchParams) {
    var urlParams = new URLSearchParams(window.location.search);
    value = urlParams.get(name);
  } else {
    value = getUrlParamPolyfill(name);
  }
  return value;
}
/**
 * get the server UIConf
 * @private
 * @returns {Object} - The server UIConf
 */
function getServerUIConf() {
  return window.__kalturaplayerdata || {};
}
exports.getServerUIConf = getServerUIConf;
/**
 * Gets the default options after merging the user options with the uiConf options and the default internal options.
 * @private
 * @param {PartialKPOptionsObject} options - partial user kaltura player options.
 * @returns {KalturaPlayerConfig} - default kaltura player options.
 */
function getDefaultOptions(options) {
  var targetId = createKalturaPlayerContainer(options.targetId);
  var defaultOptions = {
    targetId: options.targetId,
    provider: {
      partnerId: options.provider.partnerId
    },
    ui: {
      targetId: targetId
    },
    plugins: {},
    advertising: {
      adBreaks: []
    },
    viewability: {
      observedThresholds: viewability_manager_1.DEFAULT_OBSERVED_THRESHOLDS,
      playerThreshold: viewability_manager_1.DEFAULT_PLAYER_THRESHOLD
    }
  };
  playkit_js_1.Utils.Object.mergeDeep(defaultOptions, options);
  if (!options.provider.ignoreServerConfig) {
    var serverUIConf = playkit_js_1.Utils.Object.copyDeep(getServerUIConf());
    delete serverUIConf.productVersion;
    defaultOptions = playkit_js_1.Utils.Object.mergeDeep({}, supportLegacyOptions(serverUIConf), defaultOptions);
  }
  checkNativeHlsSupport(defaultOptions);
  checkNativeTextTracksSupport(defaultOptions);
  (0, player_defaults_1.setDefaultAnalyticsPlugin)(defaultOptions);
  configureSmartTVDefaultOptions(defaultOptions);
  configureEdgeDRMDefaultOptions(defaultOptions);
  configureIMADefaultOptions(defaultOptions);
  configureDAIDefaultOptions(defaultOptions);
  configureBumperDefaultOptions(defaultOptions);
  maybeSetFullScreenConfig(defaultOptions);
  maybeSetCapabilitiesForIos(defaultOptions);
  return defaultOptions;
}
exports.getDefaultOptions = getDefaultOptions;
/**
 * Sets config option for native HLS playback
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function checkNativeHlsSupport(options) {
  if ((playkit_js_1.Env.isMacOS && playkit_js_1.Env.isSafari) || playkit_js_1.Env.isIOS) {
    var preferNativeHlsValue = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.preferNative.hls');
    if (typeof preferNativeHlsValue !== 'boolean') {
      playkit_js_1.Utils.Object.mergeDeep(options, {
        playback: {
          preferNative: {
            hls: true
          }
        }
      });
    }
  }
}
exports.checkNativeHlsSupport = checkNativeHlsSupport;
/**
 * Sets config option for native text track support
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function checkNativeTextTracksSupport(options) {
  if ((playkit_js_1.Env.isMacOS && playkit_js_1.Env.isSafari) || playkit_js_1.Env.isIOS) {
    var useNativeTextTrack = playkit_js_1.Utils.Object.getPropertyPath(options, 'text.useNativeTextTrack');
    if (typeof useNativeTextTrack !== 'boolean') {
      playkit_js_1.Utils.Object.mergeDeep(options, {
        text: {
          useNativeTextTrack: true
        }
      });
    }
  }
}
/**
 * Sets config option for Ads with MSE
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function _configureAdsWithMSE(options) {
  var playAdsWithMSE = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.playAdsWithMSE');
  if (typeof playAdsWithMSE !== 'boolean') {
    options = playkit_js_1.Utils.Object.createPropertyPath(options, 'playback.playAdsWithMSE', true);
  }
  var disableMediaPreloadIma = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.ima.disableMediaPreload');
  var disableMediaPreloadBumper = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.bumper.disableMediaPreload');
  if (options.plugins && options.plugins.ima && typeof disableMediaPreloadIma !== 'boolean') {
    options = playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.ima.disableMediaPreload', true);
  }
  if (options.plugins && options.plugins.bumper && typeof disableMediaPreloadBumper !== 'boolean') {
    options = playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.bumper.disableMediaPreload', true);
  }
}
/**
 * Sets config option for LG TV SDK 2 live which has problem with long duration buffer
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function _configureLGSDK2HlsLiveConfig(options) {
  var hlsLiveConfig = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.options.html5.hls.liveSyncDurationCount');
  //webos SDK 2 and less detect as safari browser greater version is chrome
  if (typeof hlsLiveConfig !== 'boolean' && playkit_js_1.Env.isSafari) {
    options = playkit_js_1.Utils.Object.createPropertyPath(options, 'playback.options.html5.hls.liveSyncDurationCount', 2);
  }
}
/**
 * Sets config option for smart TV
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureSmartTVDefaultOptions(options) {
  if (playkit_js_1.Env.isSmartTV) {
    //relevant for LG SDK 4 and HISENSE which doesn't support our check for autoplay with base64 source
    (0, playkit_js_1.setCapabilities)(playkit_js_1.EngineType.HTML5, {
      autoplay: true
    });
    _configureAdsWithMSE(options);
    _configureLGSDK2HlsLiveConfig(options);
    if (options.plugins && options.plugins.ima) {
      var imaForceReload = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.ima.forceReloadMediaAfterAds');
      var delayUntilSourceSelected = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.ima.delayInitUntilSourceSelected');
      if (typeof imaForceReload !== 'boolean') {
        options = playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.ima.forceReloadMediaAfterAds', true);
      }
      if (typeof delayUntilSourceSelected !== 'boolean') {
        options = playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.ima.delayInitUntilSourceSelected', true);
      }
    }
    if (options.plugins && options.plugins.youbora) {
      var playheadMonitorInterval = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.youbora.playheadMonitorInterval');
      if (typeof playheadMonitorInterval !== 'number') {
        options = playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.youbora.playheadMonitorInterval', 2000);
      }
    }
    var lowLatencyMode = playkit_js_1.Utils.Object.getPropertyPath(options, 'streaming.lowLatencyMode');
    if (typeof lowLatencyMode !== 'boolean') {
      options = playkit_js_1.Utils.Object.createPropertyPath(options, 'streaming.lowLatencyMode', false);
    }
  }
}
/**
 * prefer Playready in edge - from chromium version of edge Widevine is option as well
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureEdgeDRMDefaultOptions(options) {
  if (playkit_js_1.Env.browser.name === 'Edge') {
    var keySystem = playkit_js_1.Utils.Object.getPropertyPath(options, 'drm.keySystem');
    if (!keySystem) {
      if (playkit_js_1.Env.os.name === 'Windows') {
        options = playkit_js_1.Utils.Object.createPropertyPath(options, 'drm.keySystem', playkit_js_1.DrmScheme.PLAYREADY);
      } else {
        options = playkit_js_1.Utils.Object.createPropertyPath(options, 'drm.keySystem', playkit_js_1.DrmScheme.WIDEVINE);
      }
    }
  }
}
/**
 * Sets default config option for ima plugin
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureIMADefaultOptions(options) {
  // @ts-ignore
  if (playkit_js_1.Env.isIOS && options.plugins && options.plugins.ima && !options.plugins.ima.disable) {
    var playsinline = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.playsinline');
    var disableMediaPreloadIma = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.ima.disableMediaPreload');
    if (playsinline === false && typeof disableMediaPreloadIma !== 'boolean') {
      playkit_js_1.Utils.Object.createPropertyPath(options, 'plugins.ima.disableMediaPreload', true);
    }
  }
}
/**
 * Sets default config option for dai plugin
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureDAIDefaultOptions(options) {
  // @ts-ignore
  if (options.plugins && options.plugins.imadai && !options.plugins.imadai.disable) {
    var autoStartLoadConfig = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.options.html5.hls.autoStartLoad');
    if (typeof autoStartLoadConfig !== 'boolean') {
      playkit_js_1.Utils.Object.mergeDeep(options, {
        playback: {
          options: {
            html5: {
              hls: {
                autoStartLoad: false
              }
            }
          }
        }
      });
    }
  }
}
/**
 * Sets default config option for bumper plugin when ima-dai enabled
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureBumperDefaultOptions(options) {
  var bumperConfig = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.bumper');
  var daiConfig = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.imadai');
  if (bumperConfig) {
    var newBumperConfig = {};
    if (typeof bumperConfig.playOnMainVideoTag !== 'boolean' && (playkit_js_1.Env.isSmartTV || (playkit_js_1.Env.isIOS && options.playback && options.playback.playsinline === false))) {
      newBumperConfig['playOnMainVideoTag'] = true;
    }
    if (daiConfig && !daiConfig.disable) {
      if (!Array.isArray(bumperConfig.position)) {
        newBumperConfig['position'] = [0];
      }
      if (typeof bumperConfig.disableMediaPreload !== 'boolean') {
        newBumperConfig['disableMediaPreload'] = true;
      }
    }
    playkit_js_1.Utils.Object.mergeDeep(options, {
      plugins: {
        bumper: newBumperConfig
      }
    });
  }
}
/**
 * print kaltura version to log by configuration
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function printKalturaPlayerVersionToLog(options) {
  var playerVersion = playkit_js_1.Utils.Object.getPropertyPath(options, 'log.playerVersion');
  if (playerVersion !== false) {
    (0, playkit_js_1.setLogLevel)(playkit_js_1.LogLevel.INFO);
    (0, playkit_js_1.getLogger)().log('%c '.concat(__NAME__, ' ').concat(__VERSION__), 'color: #ff98f9;  font-size: large');
    (0, playkit_js_1.getLogger)().log('%c For more details see '.concat(__PACKAGE_URL__), 'color: #ff98f9;');
  }
}
exports.printKalturaPlayerVersionToLog = printKalturaPlayerVersionToLog;
/**
 * Transform options structure from legacy structure to new structure.
 * @private
 * @param {Object} options - The options with the legacy structure.
 * @return {PartialKPOptionsObject} - Partial options with the expected structure.
 */
function supportLegacyOptions(options) {
  var removePlayerEntry = function () {
    if (options.player) {
      setupMessages.push({
        level: 'warn',
        msg: 'Path config.player will be deprecated soon. Please update your config structure as describe here: '.concat(__CONFIG_DOCS_URL__)
      });
      var playerOptions = playkit_js_1.Utils.Object.copyDeep(options.player);
      delete options.player;
      playkit_js_1.Utils.Object.mergeDeep(options, playerOptions);
    }
  };
  var moveProp = function (propPath, targetPath) {
    if (playkit_js_1.Utils.Object.hasPropertyPath(options, propPath)) {
      setupMessages.push({
        level: 'warn',
        msg: 'Path config.player.'.concat(propPath, ' will be deprecated soon. Please update your config structure as describe here: ').concat(__CONFIG_DOCS_URL__)
      });
      if (!playkit_js_1.Utils.Object.hasPropertyPath(options, targetPath)) {
        var propValue = playkit_js_1.Utils.Object.getPropertyPath(options, propPath);
        var propObj = playkit_js_1.Utils.Object.createPropertyPath({}, targetPath, propValue);
        playkit_js_1.Utils.Object.mergeDeep(options, propObj);
        playkit_js_1.Utils.Object.deletePropertyPath(options, propPath);
      } else {
        playkit_js_1.Utils.Object.deletePropertyPath(options, propPath);
      }
    }
  };
  var moves = [
    ['duration', 'sources.duration'],
    ['type', 'sources.type'],
    ['dvr', 'sources.dvr'],
    ['id', 'sources.id'],
    ['name', 'metadata.name'],
    ['metadata.poster', 'sources.poster'],
    ['metadata', 'sources.metadata'],
    ['logLevel', 'log.level'],
    ['ui.components.fullscreen.inBrowserFullscreenForIOS', 'playback.inBrowserFullscreen'],
    ['playback.enableCEA708Captions', 'text.enableCEA708Captions'],
    ['playback.useNativeTextTrack', 'text.useNativeTextTrack'],
    ['playback.options.html5.dash.useShakaTextTrackDisplay', 'text.useShakaTextTrackDisplay'],
    ['playback.captionsTextTrack1Label', 'text.captionsTextTrack1Label'],
    ['playback.captionsTextTrack1LanguageCode', 'text.captionsTextTrack1LanguageCode'],
    ['playback.captionsTextTrack2Label', 'text.captionsTextTrack2Label'],
    ['playback.captionsTextTrack2LanguageCode', 'text.captionsTextTrack2LanguageCode'],
    ['plugins.visibility.threshold', 'viewability.playerThreshold'],
    ['plugins.visibility.floating', 'plugins.floating'],
    ['playback.startTime', 'sources.startTime']
  ];
  removePlayerEntry();
  moves.forEach(function (move) {
    return moveProp(move[0], move[1]);
  });
  return options;
}
exports.supportLegacyOptions = supportLegacyOptions;
/**
 * Prints early setup messages.
 * @private
 * @returns {void}
 */
function printSetupMessages() {
  // @ts-ignore
  setupMessages.forEach(function (msgObj) {
    return (0, playkit_js_1.getLogger)('KalturaPlayer:Setup')[msgObj.level](msgObj.msg);
  });
}
exports.printSetupMessages = printSetupMessages;
/**
 * Prints early setup messages.
 * @private
 * @param {Player} player - The player.
 * @param {string} engine - The player engine name.
 * @param {string} format - The player engine format.
 * @returns {PKPlaybackConfigObject} - The playback config.
 */
function addEngineToStreamPriority(player, engine, format) {
  // @ts-ignore
  var playbackConfig = player.config.playback;
  var hasYoutube = false;
  playbackConfig.streamPriority.forEach(function (sp) {
    if (sp.engine === engine) {
      hasYoutube = true;
    }
  });
  if (!hasYoutube) {
    playbackConfig.streamPriority.push({
      engine: engine,
      format: format
    });
  }
  return playbackConfig;
}
/**
 * set stream priority according to playerConfig
 * @param {Player} player - player
 * @param {PKSourcesConfigObject} sources - sources
 * @return {void}
 */
function maybeSetStreamPriority(player, sources) {
  if (sources && hasYoutubeSource(sources)) {
    return addEngineToStreamPriority(player, 'youtube', 'progressive');
  }
  if (sources && hasImageSource(sources)) {
    return addEngineToStreamPriority(player, 'image', 'image');
  }
  return null;
}
exports.maybeSetStreamPriority = maybeSetStreamPriority;
/**
 * returns true if sources contain youtube video source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain youtube source
 */
function hasYoutubeSource(sources) {
  var source = sources && sources.progressive;
  return !!(source && source[0] && source[0].mimetype === 'video/youtube');
}
exports.hasYoutubeSource = hasYoutubeSource;
/**
 * returns true if sources contain image source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain image source
 */
function hasImageSource(sources) {
  // const IMAGE_MIME_TYPES = /(^image)(\/)[a-zA-Z0-9_]*/;
  var source = sources && sources.image;
  // return !!(source && source[0] && source[0].mimetype.match(IMAGE_MIME_TYPES));
  return !!(source && source[0]);
}
exports.hasImageSource = hasImageSource;
/**
 * Maybe set inBrowserFullscreen config based on the plugins.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeSetFullScreenConfig(options) {
  var vrPlugin = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.vr');
  if (vrPlugin && !vrPlugin.disable) {
    var fullscreenConfig = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.inBrowserFullscreen');
    if (typeof fullscreenConfig !== 'boolean') {
      playkit_js_1.Utils.Object.mergeDeep(options, {
        playback: {
          inBrowserFullscreen: true
        }
      });
    }
  }
}
/**
 * Set the autoplay capability to false for native Ios player.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeSetCapabilitiesForIos(options) {
  if (playkit_js_1.Env.isIOS) {
    var playsinline = playkit_js_1.Utils.Object.getPropertyPath(options, 'playback.playsinline');
    var isAirPlayConfigured = playkit_js_1.Utils.Object.hasPropertyPath(options, 'plugins.airplay');
    var isPlaysinline = playsinline !== false;
    if (isAirPlayConfigured) {
      (0, playkit_js_1.setCapabilities)(playkit_js_1.EngineType.HTML5, {
        autoplay: false,
        mutedAutoPlay: isPlaysinline
      });
    } else if (playkit_js_1.Env.device.model === 'iPhone' && !isPlaysinline) {
      (0, playkit_js_1.setCapabilities)(playkit_js_1.EngineType.HTML5, {
        autoplay: false,
        mutedAutoPlay: false
      });
    }
  }
}
/**
 * Merge the provider plugins config (e.g. bumper) into the app config and returns it and the respective app config to restore in change media
 * @param {PluginsConfig} providerPluginsConfig - the provider plugins config
 * @param {KalturaPlayerConfig} appPluginsConfig - the entire app plugins config
 * @returns {Array<PluginsConfig>} - the merged plugins config and the partial respective app plugins config
 */
function mergeProviderPluginsConfig(providerPluginsConfig, appPluginsConfig) {
  var mergePluginConfig = {};
  var respectiveAppPluginsConfig = {};
  playkit_js_1.Utils.Object.isObject(providerPluginsConfig) &&
    Object.entries(providerPluginsConfig).forEach(function (_a) {
      var _b = __read(_a, 2),
        pluginName = _b[0],
        pluginConfig = _b[1];
      mergePluginConfig[pluginName] = {};
      respectiveAppPluginsConfig[pluginName] = {};
      Object.entries(pluginConfig).forEach(function (_a) {
        var _b = __read(_a, 2),
          key = _b[0],
          providerValue = _b[1];
        var appValue = playkit_js_1.Utils.Object.getPropertyPath(appPluginsConfig[pluginName], key);
        mergePluginConfig[pluginName][key] = appValue || providerValue;
        respectiveAppPluginsConfig[pluginName][key] = appValue;
      });
    });
  return [mergePluginConfig, respectiveAppPluginsConfig];
}
exports.mergeProviderPluginsConfig = mergeProviderPluginsConfig;
//# sourceMappingURL=setup-helpers.js.map
