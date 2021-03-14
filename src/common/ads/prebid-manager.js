// @flow
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../kaltura-player';

const AD_REQUEST_TIMEOUT = 4000;

/**
 * Manager for prebid lib.
 * @class PrebidManager
 * @param {PrebidManager} context - The prebid lib context.
 */
class PrebidManager {
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _config: KPPrebidConfig;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _prebid: any = null;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _loadPromise: DeferredPromise;

  constructor(config: ?KPPrebidConfig) {
    this._loadPromise = Utils.Object.defer();
    this._loadPromise.catch(() => console.warn(`Prebid doesn't loaded`));
    if (config) {
      this._config = config;
      this._loadPrebidSDKLib(this._config.libUrl)
        .then(() => {
          if (this._isPrebidSDKLibLoaded()) {
            this._prebid = window.pbjs;
            this._loadPromise.resolve();
          } else {
            this._loadPromise.reject();
          }
        })
        .catch(() => {
          this._loadPromise.reject();
        });
    } else {
      this._loadPromise.reject();
    }
  }

  _isPrebidSDKLibLoaded(): boolean {
    return window.pbjs && window.pbjs.que;
  }

  _loadPrebidSDKLib(libUrl: string): Promise<*> {
    return this._isPrebidSDKLibLoaded() ? Promise.resolve() : Utils.Dom.loadScriptAsync(libUrl);
  }

  _load(config: KPAdPrebidConfig): Promise<*> {
    return new Promise((resolve, reject) => {
      this._loadPromise
        .then(() => {
          const loadAdTagTimer = setTimeout(reject, config.timeout || AD_REQUEST_TIMEOUT);
          this._prebid.que.push(() => {
            this._prebid.addAdUnits(config.adUnit);
            if (config.options) {
              this._prebid.setConfig(config.options);
            }
            this._prebid.requestBids({
              bidsBackHandler: bids => {
                KalturaPlayer._logger.debug('returned bids', bids);
                clearTimeout(loadAdTagTimer);
                if (config.params) {
                  let requestParams = {};
                  if (config.adUnit) {
                    requestParams.adUnit = config.adUnit;
                  }
                  requestParams.params = config.params;
                  const VASTUrl = this._prebid.adServers.dfp.buildVideoUrl(requestParams);
                  resolve([{vastUrl: VASTUrl}]);
                } else {
                  try {
                    const code = config.adUnit.code || Object.keys(bids)[0];
                    const adBids = bids[code].bids || [bids[0]];
                    resolve(adBids);
                  } catch (e) {
                    reject();
                  }
                }
              }
            });
          });
        })
        .catch(reject);
    });
  }

  /**
   * load the prebid
   * @public
   * @param {KPAdPrebidConfig} config - The prebid config.
   * @returns {void}
   * @memberof PrebidManager
   */
  load(config: KPAdPrebidConfig): Promise<*> {
    return this._load(config || this._config);
  }
}

export {PrebidManager};
