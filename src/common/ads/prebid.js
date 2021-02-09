// @flow
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../kaltura-player';

const TIMEOUT_LOAD_PREBID = 2000;
/**
 * Controller for ima plugin.
 * @class ImaAdsController
 * @param {Ima} context - The ima plugin context.
 */
class PrebidManager {
  _prebid: any = null;
  _bidPromise: DeferredPromise;

  /**
   * @member
   * @private
   * @memberof prebidController
   */
  _player: KalturaPlayer;

  constructor(player: KalturaPlayer) {
    this._bidPromise = Utils.Object.defer();
    this._player = player;

    const prebidConfig = this._player.config.prebid;
    if (prebidConfig && prebidConfig.adUnit) {
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
          this._bidPromise.reject();
          clearInterval(prebidLoadedCheck);
        }, TIMEOUT_LOAD_PREBID);
      }
    }
  }

  /**
   * load the prebid
   * @private
   * @param {Object} config - The prebid config.
   * @returns {void}
   * @memberof prebidController
   */
  _load(config: Object): void {
    this._prebid.que.push(() => {
      this._prebid.addAdUnits(config.adUnit);

      if (config.options) {
        this._prebid.setConfig(config.options);
      }

      const loadAdTagTimer = setTimeout(() => this._bidPromise.reject(), config.timeout);
      this._prebid.requestBids({
        bidsBackHandler: bids => {
          KalturaPlayer._logger.debug('returned bids', bids);
          let requestParams = {adUnit: config.adUnit};
          if (config.params) {
            requestParams.params = config.params;
          }
          const VASTUrl = this._prebid.adServers.dfp.buildVideoUrl(requestParams);
          this._player._configureOrLoadPlugins({ima: {adTagUrl: VASTUrl}});
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
