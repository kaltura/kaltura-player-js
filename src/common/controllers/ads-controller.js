//@flow
import {KalturaPlayer as Player} from '../../kaltura-player';
import {Ad} from '../ads';
import {AdBreak} from '../ads';
import {
  Error,
  EventManager,
  AdEventType,
  FakeEvent,
  FakeEventTarget,
  Html5EventType,
  CustomEventType,
  getLogger,
  BaseMiddleware,
  Utils
} from '@playkit-js/playkit-js';
import {PrebidManager} from '../ads/prebid-manager';
import {AdLayoutMiddleware} from '../ads/ad-layout-middleware';

declare type RunTimeAdBreakObject = KPAdBreakObject & {
  played: boolean,
  loadedPromise: Promise<*>
};

/**
 * @class AdsController
 * @param {Player} player - The player.
 * @param {IAdsController} adsPluginController - The controller of the current ads plugin instance.
 */
class AdsController extends FakeEventTarget implements IAdsController {
  static _logger: any = getLogger('AdsController');

  _player: Player;
  _adsPluginControllers: Array<IAdsPluginController>;
  _allAdsCompleted: boolean;
  _eventManager: EventManager;
  _liveEventManager: EventManager;
  _adBreaksLayout: Array<number | string>;
  _adBreak: ?AdBreak;
  _ad: ?Ad;
  _adPlayed: boolean;
  _snapback: number;
  _configAdBreaks: Array<RunTimeAdBreakObject>;
  _adIsLoading: boolean;
  _isAdPlaying: boolean;
  _middleware: AdLayoutMiddleware;
  _prebidManager: PrebidManager;
  prerollReady: Promise<*>;

  constructor(player: Player, adsPluginControllers: Array<IAdsPluginController>) {
    super();
    this._player = player;
    this._eventManager = new EventManager();
    this._liveEventManager = new EventManager();
    this._adsPluginControllers = adsPluginControllers;
    this._prebidManager = new PrebidManager(this._player.config.advertising && this._player.config.advertising.prebid);
    this._init();
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether all ads completed.
   */
  get allAdsCompleted(): boolean {
    return this._allAdsCompleted;
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether an ad is playing.
   */
  isAdPlaying(): boolean {
    return this.isAdBreak() && this._isAdPlaying;
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether we're in an ad break.
   */
  isAdBreak(): boolean {
    return !!this._adBreak;
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {Array<number|string>} - The ad breaks layout (cue points).
   */
  getAdBreaksLayout(): Array<number | string> {
    return this._adBreaksLayout;
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {?AdBreak} - Gets the current ad break data.
   */
  getAdBreak(): ?AdBreak {
    return this._adBreak;
  }

  /**
   * @instance
   * @memberof AdsController
   * @returns {?Ad} - Gets the current ad data.
   */
  getAd(): ?Ad {
    return this._ad;
  }

  /**
   * Skip on an ad.
   * @instance
   * @memberof AdsController
   * @returns {void}
   */
  skipAd(): void {
    const activeController = this._adsPluginControllers.find(controller => controller.active);
    activeController && activeController.skipAd();
  }

  /**
   * Play an ad on demand.
   * @param {KPAdPod} adPod - The ad pod play.
   * @instance
   * @memberof AdsController
   * @returns {void}
   */
  playAdNow(adPod: KPAdPod): void {
    if (this.isAdBreak()) {
      AdsController._logger.warn('Tried to call playAdNow during an ad break');
    } else {
      const loadPrebidAd = Promise.all(adPod.map(ad => this._getPrebidAds(ad)));
      this._playAdBreak({
        position: this._player.currentTime || 0,
        ads: adPod,
        played: false,
        loadedPromise: loadPrebidAd
      });
    }
  }

  getMiddleware(): BaseMiddleware {
    return this._middleware ? this._middleware : (this._middleware = new AdLayoutMiddleware(this));
  }

  _init(): void {
    this._initMembers();
    this._addBindings();
  }

  _initMembers(): void {
    this._allAdsCompleted = true;
    this._adBreaksLayout = [];
    this._adBreak = null;
    this._ad = null;
    this._adPlayed = false;
    this._snapback = 0;
    this._adIsLoading = false;
    this._isAdPlaying = false;
  }

  _addBindings(): void {
    this._eventManager.listen(this._player, CustomEventType.SOURCE_SELECTED, () => this._handleConfiguredAdBreaks());
    this._eventManager.listen(this._player, AdEventType.AD_MANIFEST_LOADED, event => this._onAdManifestLoaded(event));
    this._eventManager.listen(this._player, AdEventType.AD_BREAK_START, event => this._onAdBreakStart(event));
    this._eventManager.listen(this._player, AdEventType.AD_LOADED, () => this._onAdLoaded());
    this._eventManager.listen(this._player, AdEventType.AD_STARTED, event => this._onAdStarted(event));
    this._eventManager.listen(this._player, AdEventType.AD_COMPLETED, () => (this._isAdPlaying = false));
    this._eventManager.listen(this._player, AdEventType.AD_BREAK_END, () => this._onAdBreakEnd());
    this._eventManager.listen(this._player, AdEventType.ADS_COMPLETED, () => this._onAdsCompleted());
    this._eventManager.listen(this._player, AdEventType.AD_ERROR, event => this._onAdError(event));
    this._eventManager.listen(this._player, CustomEventType.PLAYER_RESET, () => this._reset());
    this._eventManager.listen(this._player, CustomEventType.PLAYER_DESTROY, () => this._destroy());
    this._eventManager.listenOnce(this._player, Html5EventType.ENDED, () => this._onEnded());
    this._eventManager.listenOnce(this._player, CustomEventType.PLAYBACK_ENDED, () => this._onPlaybackEnded());
    this._eventManager.listen(this._player, AdEventType.AD_RESUMED, () => (this._isAdPlaying = true));
    this._eventManager.listen(this._player, AdEventType.AD_PAUSED, () => (this._isAdPlaying = false));
  }

  _handleConfiguredAdBreaks(): void {
    const playAdsAfterTime = this._player.config.advertising.playAdsAfterTime || this._player.config.sources.startTime;
    this._configAdBreaks = this._player.config.advertising.adBreaks
      .filter(
        adBreak =>
          (typeof adBreak.every === 'number' || typeof adBreak.position === 'number' || typeof adBreak.percentage === 'number') && adBreak.ads.length
      )
      .map(adBreak => {
        this._validateOneTimeConfig(adBreak);
        let position = adBreak.position;
        adBreak.percentage === 0 && (position = 0);
        adBreak.percentage === 100 && (position = -1);
        adBreak.every && (position = adBreak.every);
        return {
          position,
          percentage: adBreak.percentage,
          every: adBreak.every,
          ads: adBreak.ads.slice(),
          played: -1 < position && position <= playAdsAfterTime
        };
      });
    if (this._configAdBreaks.length) {
      this._dispatchAdManifestLoaded();
      this._handlePrebidAdConfig();
      this._handleConfiguredPreroll();
      this._eventManager.listenOnce(this._player, Html5EventType.DURATION_CHANGE, () => {
        this._player.isLive()
          ? this._eventManager.listenOnce(this._player, Html5EventType.SEEKING, () => this._handleLiveEvery())
          : this._handleEveryAndPercentage();
        this._configAdBreaks.sort((a, b) => a.position - b.position);
        if (this._configAdBreaks.some(adBreak => adBreak.position > 0)) {
          this._handleConfiguredMidrolls();
        }
      });
    } else {
      this.prerollReady = Promise.resolve();
    }
  }

  _validateOneTimeConfig(adBreak: KPAdBreakObject): void {
    if (typeof adBreak.position === 'number') {
      if (typeof adBreak.percentage === 'number') {
        AdsController._logger.warn(`Validate ad break - ignore percentage ${adBreak.percentage} as position ${adBreak.position} configured`);
        delete adBreak.percentage;
      }
      if (typeof adBreak.every === 'number') {
        AdsController._logger.warn(`Validate ad break - ignore every ${adBreak.every} as position ${adBreak.position} configured`);
        delete adBreak.every;
      }
    }
    if (typeof adBreak.percentage === 'number' && typeof adBreak.every === 'number') {
      AdsController._logger.warn(`Validate ad break - ignore every ${adBreak.every} as percentage ${adBreak.percentage} configured`);
      delete adBreak.every;
    }
  }

  _dispatchAdManifestLoaded(): void {
    const adBreaksPosition = Array.from(
      new Set(
        this._configAdBreaks.map(
          adBreak =>
            (adBreak.every && adBreak.every + 's') || (typeof adBreak.percentage === 'number' && adBreak.percentage + '%') || adBreak.position
        )
      )
    );
    AdsController._logger.debug(AdEventType.AD_MANIFEST_LOADED, adBreaksPosition);
    this._player.dispatchEvent(new FakeEvent(AdEventType.AD_MANIFEST_LOADED, {adBreaksPosition}));
    if (this._player.ui.hasManager('timeline') && this._player.config.advertising.showAdBreakCuePoint) {
      adBreaksPosition.forEach(position => {
        // $FlowFixMe
        this._player.ui.getManager('timeline').addCuePoint({
          time: position !== -1 ? position : Infinity,
          ...this._player.config.advertising.adBreakCuePointStyle
        });
      });
    }
  }

  _handlePrebidAdConfig(): void {
    this._prebidManager &&
      this._configAdBreaks
        .filter(adBreak => !adBreak.played)
        .map(adBreak => {
          const loadPrebidAd = Promise.all(adBreak.ads.map(ad => this._getPrebidAds(ad)));
          adBreak.loadedPromise = loadPrebidAd;
          loadPrebidAd.then(ads => (adBreak.ads = ads));
        });
  }

  _getPrebidAds(ad: KPAdObject): Promise<*> {
    return new Promise(resolve => {
      if (ad.prebid && this._prebidManager) {
        const prebidConfig = Utils.Object.mergeDeep({}, ad.prebid, this._player.config.advertising.prebid);
        const promiseLoad = this._prebidManager.load(prebidConfig);
        promiseLoad
          .then(bids => {
            const vastUrls = bids.map(bid => bid && bid.vastUrl);
            ad.url = vastUrls.concat(ad.url);
            resolve(ad);
          })
          .catch(() => {
            resolve(ad);
          });
      } else {
        resolve(ad);
      }
    });
  }

  _handleConfiguredPreroll(): void {
    const prerolls = this._configAdBreaks.filter(adBreak => adBreak.position === 0 && !adBreak.played);
    const mergedPreroll = this._mergeAdBreaks(prerolls);
    this.prerollReady = mergedPreroll && mergedPreroll.loadedPromise ? mergedPreroll.loadedPromise : Promise.resolve();
    mergedPreroll && this._playAdBreak(mergedPreroll);
  }

  _handleEveryAndPercentage(): void {
    this._configAdBreaks.forEach(adBreak => {
      if (this._player.duration && adBreak.every) {
        let currentPosition = 2 * adBreak.every;
        while (currentPosition <= this._player.duration) {
          this._configAdBreaks.push({
            position: currentPosition,
            ads: adBreak.ads,
            played: false,
            loadedPromise: Promise.resolve()
          });
          currentPosition += adBreak.every;
        }
      } else if (this._player.duration && adBreak.percentage && !adBreak.position) {
        adBreak.position = Math.floor((this._player.duration * adBreak.percentage) / 100);
      }
    });
  }

  _handleLiveEvery(): void {
    const liveConfigAdBreaks = [];
    this._configAdBreaks.forEach(adBreak => {
      const {every, ads} = adBreak;
      if (every && this._player.duration) {
        const position = this._player.currentTime + every;
        liveConfigAdBreaks.push({
          every,
          position,
          ads,
          played: false,
          loadedPromise: Promise.resolve()
        });
      }
    });
    if (liveConfigAdBreaks.length) {
      this._configAdBreaks = liveConfigAdBreaks;
    }
  }

  _handleConfiguredMidrolls(): void {
    this._eventManager.listen(this._player, Html5EventType.TIME_UPDATE, () => {
      if (!this._player.paused) {
        const adBreaks = this._configAdBreaks.filter(
          adBreak => !adBreak.played && this._player.currentTime && adBreak.position <= this._player.currentTime && adBreak.position > this._snapback
        );
        if (adBreaks.length) {
          const maxPosition = adBreaks[adBreaks.length - 1].position;
          const lastAdBreaks = adBreaks.filter(adBreak => adBreak.position === maxPosition);
          this._snapback = maxPosition;
          AdsController._logger.debug(`Set snapback value ${this._snapback}`);
          const mergedAdBreak = this._mergeAdBreaks(lastAdBreaks);
          if (this._player.isLive()) {
            const returnToLive = !this._player.isDvr() || (this._player.isOnLiveEdge() && this._player.config.advertising.returnToLive);
            returnToLive ? this._handleReturnToLive(lastAdBreaks) : this._pushNextAdsForLive(lastAdBreaks);
          }
          mergedAdBreak && this._playAdBreak(mergedAdBreak);
        }
      }
    });
    this._eventManager.listen(this._player, Html5EventType.SEEKED, () => {
      const nextPlayedAdBreakIndex = this._configAdBreaks.findIndex(
        adBreak => adBreak.played && typeof this._player.currentTime === 'number' && this._player.currentTime < adBreak.position
      );
      if (nextPlayedAdBreakIndex > 0 && !this._configAdBreaks[nextPlayedAdBreakIndex - 1].played) {
        this._snapback = 0;
        AdsController._logger.debug('Reset snapback value');
      }
    });
  }

  _handleReturnToLive(adBreaks: Array<RunTimeAdBreakObject>) {
    this._liveEventManager.listenOnce(this._player, AdEventType.AD_ERROR, () => {
      this._pushNextAdsForLive(adBreaks);
      this._liveEventManager.removeAll();
    });
    this._liveEventManager.listenOnce(this._player, AdEventType.AD_BREAK_END, () => {
      this._liveEventManager.listenOnce(this._player, Html5EventType.SEEKED, () => {
        this._pushNextAdsForLive(adBreaks);
        this._liveEventManager.removeAll();
      });
      this._player.seekToLiveEdge();
    });
  }

  _pushNextAdsForLive(adBreaks: Array<RunTimeAdBreakObject>) {
    AdsController._logger.debug('Pushing next ads for live', adBreaks);
    const liveConfigAdBreaks = [];
    adBreaks.forEach(adBreak => {
      const {every, ads} = adBreak;
      const position = (this._player.isOnLiveEdge() ? this._player.currentTime : adBreak.position) + every;
      const nextAdBreak = {
        every,
        position,
        ads,
        played: false,
        loadedPromise: Promise.resolve()
      };
      AdsController._logger.debug('Pushing next ad for live', nextAdBreak);
      liveConfigAdBreaks.push(nextAdBreak);
    });
    this._configAdBreaks = liveConfigAdBreaks;
  }

  _playAdBreak(adBreak: RunTimeAdBreakObject): void {
    const adController = this._adsPluginControllers.find(controller => typeof controller.playAdNow === 'function');
    if (adController) {
      adBreak.played = true;
      this._adIsLoading = true;
      AdsController._logger.debug(`Playing ad break positioned in ${adBreak.position}`);
      // $FlowFixMe
      adBreak.loadedPromise.then(() => adController.playAdNow(adBreak.ads));
    } else {
      AdsController._logger.warn('No ads plugin registered');
    }
  }

  _onAdManifestLoaded(event: FakeEvent): void {
    this._adBreaksLayout = Array.from(new Set(this._adBreaksLayout.concat(event.payload.adBreaksPosition))).sort();
    this._allAdsCompleted = false;
  }

  _onAdBreakStart(event: FakeEvent): void {
    this._adBreak = event.payload.adBreak;
  }

  _onAdLoaded(): void {
    this._adIsLoading = false;
  }

  _onAdStarted(event: FakeEvent): void {
    this._ad = event.payload.ad;
    this._adPlayed = true;
    this._isAdPlaying = true;
  }

  _onAdBreakEnd(): void {
    this._adBreak = null;
    this._ad = null;
  }

  _onAdsCompleted(): void {
    if (this._adsPluginControllers.every(controller => controller.done) && this._configAdBreaks.every(adBreak => adBreak.played)) {
      this._allAdsCompleted = true;
      AdsController._logger.debug(AdEventType.ALL_ADS_COMPLETED);
      this.dispatchEvent(new FakeEvent(AdEventType.ALL_ADS_COMPLETED));
    }
  }

  _onAdError(event: FakeEvent): void {
    this._adIsLoading = false;
    if (event.payload.severity === Error.Severity.CRITICAL) {
      this._isAdPlaying = false;
      if (this._adsPluginControllers.every(controller => controller.done) && this._configAdBreaks.every(adBreak => adBreak.played)) {
        this._allAdsCompleted = true;
        if (this._adPlayed) {
          AdsController._logger.debug(AdEventType.ALL_ADS_COMPLETED);
          this.dispatchEvent(new FakeEvent(AdEventType.ALL_ADS_COMPLETED));
        }
      }
    }
  }

  _isBumper(controller: IAdsPluginController): boolean {
    return controller.name === 'bumper';
  }

  _onEnded(): void {
    if (this._adIsLoading) {
      return;
    }
    const bumperCtrl = this._adsPluginControllers.find(controller => this._isBumper(controller));
    const adCtrl = this._adsPluginControllers.find(controller => !this._isBumper(controller) && !controller.done);
    const bumperCompleted =
      bumperCtrl && typeof bumperCtrl.onPlaybackEnded === 'function' ? () => bumperCtrl.onPlaybackEnded() : () => Promise.resolve();
    const adCompleted = adCtrl && typeof adCtrl.onPlaybackEnded === 'function' ? () => adCtrl.onPlaybackEnded() : () => Promise.resolve();
    if (!(this._adBreaksLayout.includes(-1) || this._adBreaksLayout.includes('100%'))) {
      this._allAdsCompleted = true;
    }
    // $FlowFixMe
    bumperCompleted().finally(() => {
      // $FlowFixMe
      adCompleted().finally(() => this._handleConfiguredPostroll());
    });
  }

  _onPlaybackEnded(): void {
    this._configAdBreaks.forEach(adBreak => (adBreak.played = true));
  }

  _handleConfiguredPostroll(): void {
    const postrolls = this._configAdBreaks.filter(adBreak => !adBreak.played && adBreak.position === -1);
    if (postrolls.length) {
      const mergedPostroll = this._mergeAdBreaks(postrolls);
      mergedPostroll && this._playAdBreak(mergedPostroll);
    }
    this._configAdBreaks.forEach(adBreak => (adBreak.played = true));
  }

  _reset(): void {
    this._eventManager.removeAll();
    this._liveEventManager.removeAll();
    this._init();
  }

  _destroy(): void {
    this._adsPluginControllers = [];
    this._eventManager.destroy();
    this._liveEventManager.destroy();
  }

  _mergeAdBreaks(adBreaks: Array<RunTimeAdBreakObject>): ?RunTimeAdBreakObject {
    if (adBreaks.length) {
      adBreaks.forEach(adBreak => (adBreak.played = true));
      return {
        position: adBreaks[0].position,
        ads: adBreaks.reduce((result, adBreak) => result.concat(adBreak.ads), []),
        played: false,
        loadedPromise: Promise.all(adBreaks.map(adBreak => adBreak.loadedPromise))
      };
    }
  }
}

export {AdsController};
