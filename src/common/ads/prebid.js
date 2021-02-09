// @flow
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../kaltura-player';

/**
 * Controller for ima plugin.
 * @class ImaAdsController
 * @param {Ima} context - The ima plugin context.
 */
class PrebidManager {
  _prebid: any;
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
    this._prebid = window.pbjs;
    this._prebid.que = window.pbjs.que;

    const prebidConfig = this._player.config.prebid;
    if (prebidConfig && prebidConfig.adUnit) {
      if (!this._prebid || !this._prebid.que) {
        const prebidLoadChecker = setInterval(() => {
          if (window.pbjs) {
            clearInterval(prebidLoadChecker);
            this._prebid = window.pbjs || {};
            this._prebid.que = window.pbjs.que || [];
            this._load(prebidConfig);
          }
        }, prebidConfig.timeout / 1000);
        setTimeout(() => clearInterval(prebidLoadChecker), prebidConfig.timeout);
      } else {
        this._load(prebidConfig);
      }
    }
    console.error('!!!', prebidConfig);
  }

  /**
   * load the prebid
   * @private
   * @param {Object} config - The prebid config.
   * @returns {void}
   * @memberof prebidController
   */
  _load(config: Object): void {
    // this._prebid.que.push(() => {
    //   // configure prebid to use prebid cache and prebid server
    //   // make sure to add your own accountId to your s2sConfig object
    //
    //   var videoAdUnit = {
    //     code: 'video1',
    //     mediaTypes: {
    //       video: {
    //         playerSize: [640, 480],
    //         context: 'instream',
    //         mimes: ['video/mp4'],
    //         protocols: [1, 2, 3, 4, 5, 6, 7, 8],
    //         playbackmethod: [2]
    //       }
    //     },
    //     bids: [
    //       {
    //         bidder: 'appnexus',
    //         params: {
    //           placementId: 13232361, // Add your own placement id here
    //
    //           video: {
    //             skippable: true,
    //             playback_method: ['auto_play_sound_off']
    //           }
    //         }
    //       }
    //     ]
    //   };
    //
    //   console.error('!!!', videoAdUnit);
    //   console.error('!!!', config.adUnit);
    //
    //   this._prebid.setConfig({
    //     cache: {
    //       url: 'https://prebid.adnxs.com/pbc/v1/cache'
    //     },
    //     debug: true,
    //     enableSendAllBids: true,
    //     s2sConfig: {
    //       endpoint: 'http://prebid.adnxs.com/pbs/v1/openrtb2/auction',
    //       enabled: true,
    //       accountId: 'c9d412ee-3cc6-4b66-9326-9f49d528f13e',
    //       bidders: ['appnexus']
    //     }
    //   });
    //
    //   this._prebid.addAdUnits(videoAdUnit); // add your ad units to the bid request
    //
    //   this._prebid.requestBids({
    //     bidsBackHandler: bids => {
    //       console.error('got some bids');
    //       console.error(bids);
    //       var videoUrl = this._prebid.adServers.dfp.buildVideoUrl({
    //         adUnit: videoAdUnit,
    //         params: {
    //           iu: '/19968336/prebid_cache_video_adunit',
    //           cust_params: {
    //             section: 'blog',
    //             anotherKey: 'anotherValue'
    //           },
    //           output: 'vast'
    //         }
    //       });
    //       console.error(videoUrl);
    //       this._bidPromise.resolve(videoUrl);
    //     }
    //   });
    // });

    this._prebid.que.push(() => {
      this._prebid.addAdUnits(config.adUnit);

      if (config.options) {
        this._prebid.setConfig(config.options);
      }

      const timer = setTimeout(() => this._bidPromise.reject(), config.timeout);
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
          clearTimeout(timer);
        }
      });
    });
  }

  get bidPromise(): Promise<*> {
    return this._bidPromise;
  }
}

export {PrebidManager};
