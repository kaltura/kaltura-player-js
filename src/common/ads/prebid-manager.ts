import { DeferredPromise, getLogger, Utils } from '@playkit-js/playkit-js';
import { KPAdPrebidConfig, KPPrebidConfig } from '../../types';

const AD_REQUEST_TIMEOUT = 4000;

declare global {
  interface Window {
    pbjs?: {
      que?: any;
    };
  }
}

/**
 * Manager for prebid lib.
 * @class PrebidManager
 * @param {PrebidManager} context - The prebid lib context.
 */
class PrebidManager {
  private static _logger: any = getLogger('PrebidManager');
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  private _config: KPPrebidConfig | undefined;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  private _prebid: any = null;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  private _loadPromise: DeferredPromise;

  constructor(config?: KPPrebidConfig) {
    this._loadPromise = Utils.Object.defer();
    this._loadPromise.catch(() =>
      PrebidManager._logger.warn('Prebid SDK failed to load')
    );
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

  private _isPrebidSDKLibLoaded(): boolean {
    return window.pbjs && window.pbjs.que;
  }

  private _loadPrebidSDKLib(libUrl: string): Promise<any> {
    return this._isPrebidSDKLibLoaded()
      ? Promise.resolve()
      : Utils.Dom.loadScriptAsync(libUrl);
  }

  private _load(config: KPAdPrebidConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this._loadPromise
        .then(() => {
          const loadAdTagTimer = setTimeout(
            reject,
            config.timeout || AD_REQUEST_TIMEOUT
          );
          this._prebid.que.push(() => {
            this._prebid.addAdUnits(config.adUnit);
            if (config.options) {
              this._prebid.setConfig(config.options);
            }
            this._prebid.requestBids({
              bidsBackHandler: (bids) => {
                PrebidManager._logger.debug('returned bids', bids);
                clearTimeout(loadAdTagTimer);
                if (config.params) {
                  const requestParams: any = {};
                  if (config.adUnit) {
                    requestParams.adUnit = config.adUnit;
                  }
                  requestParams.params = config.params;
                  const VASTUrl =
                    this._prebid.adServers.dfp.buildVideoUrl(requestParams);
                  resolve([{ vastUrl: VASTUrl }]);
                } else {
                  try {
                    const code = config.adUnit.code || Object.keys(bids)[0];
                    const adBids = bids[code].bids;
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
  public load(config: KPAdPrebidConfig): Promise<any> {
    return this._load(config || this._config);
  }
}

export { PrebidManager };
