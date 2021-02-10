// @flow
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../kaltura-player';

const TIMEOUT_LOAD_PREBID = 2000;
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
  _player: KalturaPlayer;
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
  _bidPromise: DeferredPromise;

  constructor(player: KalturaPlayer) {
    this._bidPromise = Utils.Object.defer();
    this._player = player;

    const prebidConfig = this._player.config.prebid;
    this._bidPromise.catch(() => {
      this._player.configure({plugins: {ima: {adTagUrl: prebidConfig.fallbackAd}}});
    });

    if (prebidConfig && !prebidConfig.disable && prebidConfig.adUnit) {
      if (window.pbjs && window.pbjs.que) {
        this._prebid = window.pbjs;
        this._prebid.que = window.pbjs.que;
        this._load(prebidConfig);
      } else {
        //interval to test if prebid loaded to page
        const prebidLoadedCheck = setInterval(() => {
          //handle loading only after prebid exist on the page
          if (window.pbjs) {
            clearTimeout(rejectPackageTimer);
            clearInterval(prebidLoadedCheck);
            this._prebid = window.pbjs || {};
            this._prebid.que = window.pbjs.que || [];
            this._load(prebidConfig);
          }
        }, TIMEOUT_LOAD_PREBID / 4);

        // timeout to handle reject for prebid which didn't load to page after timeout
        const rejectPackageTimer = setTimeout(() => {
          this._bidPromise.reject(`prebid  didn't load to page after ${TIMEOUT_LOAD_PREBID}`);
          clearInterval(prebidLoadedCheck);
        }, TIMEOUT_LOAD_PREBID);
      }
    } else {
      this._bidPromise.reject(`prebid incorrect config`);
    }
  }

  /**
   * load the prebid
   * @private
   * @param {Object} config - The prebid config.
   * @returns {void}
   * @memberof PrebidManager
   */
  _load(config: Object): void {
    this._prebid.que.push(() => {
      this._prebid.addAdUnits(config.adUnit);

      if (config.options) {
        this._prebid.setConfig(config.options);
      }

      const loadAdTagTimer = setTimeout(() => this._bidPromise.reject(`prebid  didn't load the ad in ${config.timeout}`), config.timeout);
      this._prebid.requestBids({
        bidsBackHandler: bids => {
          KalturaPlayer._logger.debug('returned bids', bids);
          let requestParams = {adUnit: config.adUnit};
          if (config.params) {
            requestParams.params = config.params;
          }
          const VASTUrl = this._prebid.adServers.dfp.buildVideoUrl(requestParams);
          this._player.configure({plugins: {ima: {adTagUrl: VASTUrl}}});
          this._bidPromise.resolve();
          clearTimeout(loadAdTagTimer);
        }
      });
    });
  }

  get bidPromise(): Promise<*> {
    return this._bidPromise;
  }
}

export {PrebidManager};
