'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @ts-nocheck
var storage_wrapper_1 = require('./storage-wrapper');
var playkit_js_1 = require('@playkit-js/playkit-js');
var StorageManager = /** @class */ (function () {
  function StorageManager() {}
  /**
   * @static
   * @private
   * @returns {boolean} - Whether local storage is implemented in the current browser.
   */
  StorageManager.isLocalStorageAvailable = function () {
    return storage_wrapper_1.default.isLocalStorageAvailable();
  };
  /**
   * Attaches the player listeners to the local storage wrapper.
   * @private
   * @param {Player} player - The player reference.
   * @static
   * @returns {void}
   */
  StorageManager.attach = function (player) {
    StorageManager._logger.debug('Attach local storage');
    var eventManager = new playkit_js_1.EventManager();
    eventManager.listen(player, player.Event.UI.USER_CLICKED_MUTE, function () {
      if (!player.isCasting()) {
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.MUTED, player.muted);
      }
    });
    eventManager.listen(player, player.Event.UI.USER_CLICKED_UNMUTE, function () {
      if (!player.isCasting()) {
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.MUTED, player.muted);
      }
    });
    eventManager.listen(player, player.Event.UI.USER_CHANGED_VOLUME, function () {
      if (!player.isCasting()) {
        if (player.volume > 0) {
          storage_wrapper_1.default.setItem(StorageManager.StorageKeys.MUTED, false);
        } else {
          storage_wrapper_1.default.setItem(StorageManager.StorageKeys.MUTED, true);
        }
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.VOLUME, player.volume);
      }
    });
    eventManager.listen(player, player.Event.UI.USER_SELECTED_AUDIO_TRACK, function (event) {
      var audioTrack = event.payload.audioTrack;
      storage_wrapper_1.default.setItem(StorageManager.StorageKeys.AUDIO_LANG, audioTrack.language);
    });
    eventManager.listen(player, player.Event.UI.USER_SELECTED_CAPTION_TRACK, function (event) {
      var textTrack = event.payload.captionTrack;
      if (textTrack.language !== 'off') {
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.TEXT_LANG, textTrack.language);
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.CAPTIONS_DISPLAY, true);
      } else {
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.CAPTIONS_DISPLAY, false);
      }
    });
    var onToggleCaptions = function () {
      eventManager.listenOnce(player, player.Event.TEXT_TRACK_CHANGED, function (event) {
        var selectedTextTrack = event.payload.selectedTextTrack;
        if (selectedTextTrack.language !== 'off') {
          storage_wrapper_1.default.setItem(StorageManager.StorageKeys.TEXT_LANG, selectedTextTrack.language);
          storage_wrapper_1.default.setItem(StorageManager.StorageKeys.CAPTIONS_DISPLAY, true);
        } else {
          storage_wrapper_1.default.setItem(StorageManager.StorageKeys.CAPTIONS_DISPLAY, false);
        }
      });
    };
    eventManager.listen(player, player.Event.UI.USER_SHOWED_CAPTIONS, onToggleCaptions);
    eventManager.listen(player, player.Event.UI.USER_HID_CAPTIONS, onToggleCaptions);
    eventManager.listen(player, player.Event.UI.USER_SELECTED_CAPTIONS_STYLE, function (event) {
      try {
        var textStyle = JSON.stringify(event.payload.captionsStyle);
        storage_wrapper_1.default.setItem(StorageManager.StorageKeys.TEXT_STYLE, textStyle);
      } catch (e) {
        StorageManager._logger.error(e.message);
      }
    });
    eventManager.listen(player, player.Event.PLAYER_DESTROY, function () {
      return eventManager.destroy();
    });
  };
  /**
   * Gets the player text style from storage.
   * @private
   * @static
   * @returns {?Object} - The stored text style object
   */
  StorageManager.getPlayerTextStyle = function () {
    return storage_wrapper_1.default.getItem(StorageManager.StorageKeys.TEXT_STYLE);
  };
  /**
   * Checks if we have previous storage.
   * @private
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  StorageManager.hasStorage = function () {
    var storageSize = storage_wrapper_1.default.size;
    var hasStorage = storageSize !== 0;
    if (hasStorage) {
      StorageManager._logger.debug('Storage found with size of ', storageSize);
    } else {
      StorageManager._logger.debug('No storage found');
    }
    return hasStorage;
  };
  /**
   * Gets the storage in the structure of the player configuration.
   * @private
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  StorageManager.getStorageConfig = function () {
    var values = StorageManager._getExistingValues();
    var storageConfig = StorageManager._buildStorageConfig(values);
    StorageManager._logger.debug('Gets storage config', storageConfig);
    return storageConfig;
  };
  StorageManager._getExistingValues = function () {
    var obj = {};
    Object.keys(StorageManager.StorageKeys).forEach(function (key) {
      var value = StorageManager.StorageKeys[key];
      var item = storage_wrapper_1.default.getItem(value);
      if (item != null) {
        obj[value] = item;
      }
    });
    return obj;
  };
  StorageManager._buildStorageConfig = function (values) {
    var storageConfig = playkit_js_1.Utils.Object.mergeDeep({}, values);
    delete storageConfig.textStyle;
    return {
      playback: storageConfig
    };
  };
  StorageManager.StorageKeys = {
    MUTED: 'muted',
    VOLUME: 'volume',
    AUDIO_LANG: 'audioLanguage',
    TEXT_LANG: 'textLanguage',
    CAPTIONS_DISPLAY: 'captionsDisplay',
    TEXT_STYLE: 'textStyle'
  };
  StorageManager._logger = (0, playkit_js_1.getLogger)('StorageManager');
  return StorageManager;
})();
exports.default = StorageManager;
//# sourceMappingURL=storage-manager.js.map
