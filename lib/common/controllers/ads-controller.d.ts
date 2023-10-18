import { KalturaPlayer as Player } from '../../kaltura-player';
import { Ad } from '../ads';
import { AdBreak } from '../ads';
import { EventManager, FakeEvent, FakeEventTarget, BaseMiddleware } from '@playkit-js/playkit-js';
import { PrebidManager } from '../ads/prebid-manager';
import { AdLayoutMiddleware } from '../ads/ad-layout-middleware';
import { KPAdBreakObject, KPAdObject, KPAdPod } from '../../types/ads/advertising';
import { IAdsController } from '../../types/ads/ads-controller';
import { IAdsPluginController } from '../../types/ads/ads-plugin-controller';
interface RunTimeAdBreakObject extends KPAdBreakObject {
  played: boolean;
  loadedPromise: Promise<any>;
}
/**
 * @class AdsController
 * @param {Player} player - The player.
 * @param {IAdsController} adsPluginController - The controller of the current ads plugin instance.
 */
declare class AdsController extends FakeEventTarget implements IAdsController {
  static _logger: any;
  _player: Player;
  _adsPluginControllers: Array<IAdsPluginController>;
  _allAdsCompleted: boolean;
  _eventManager: EventManager;
  _liveEventManager: EventManager;
  _adBreaksLayout: Array<number | string>;
  _adBreak: AdBreak | undefined;
  _ad: Ad | undefined;
  _adPlayed: boolean;
  _snapback: number;
  _configAdBreaks: Array<RunTimeAdBreakObject>;
  _adIsLoading: boolean;
  _isAdPlaying: boolean;
  _middleware: AdLayoutMiddleware;
  _prebidManager: PrebidManager;
  _liveSeeking: boolean;
  prerollReady: Promise<any>;
  constructor(player: Player, adsPluginControllers: Array<IAdsPluginController>);
  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether all ads completed.
   */
  get allAdsCompleted(): boolean;
  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether an ad is playing.
   */
  isAdPlaying(): boolean;
  /**
   * @instance
   * @memberof AdsController
   * @returns {boolean} - Whether we're in an ad break.
   */
  isAdBreak(): boolean;
  /**
   * @instance
   * @memberof AdsController
   * @returns {Array<number|string>} - The ad breaks layout (cue points).
   */
  getAdBreaksLayout(): Array<number | string>;
  /**
   * @instance
   * @memberof AdsController
   * @returns {?AdBreak} - Gets the current ad break data.
   */
  getAdBreak(): AdBreak | undefined;
  /**
   * @instance
   * @memberof AdsController
   * @returns {?Ad} - Gets the current ad data.
   */
  getAd(): Ad | undefined;
  /**
   * Skip on an ad.
   * @instance
   * @memberof AdsController
   * @returns {void}
   */
  skipAd(): void;
  /**
   * Play an ad on demand.
   * @param {KPAdPod} adPod - The ad pod play.
   * @instance
   * @memberof AdsController
   * @returns {void}
   */
  playAdNow(adPod: KPAdPod): void;
  getMiddleware(): BaseMiddleware;
  _init(): void;
  _initMembers(): void;
  _addBindings(): void;
  _handleConfiguredAdBreaks(): void;
  _validateOneTimeConfig(adBreak: KPAdBreakObject): void;
  _dispatchAdManifestLoaded(): void;
  _handlePrebidAdConfig(): void;
  _getPrebidAds(ad: KPAdObject): Promise<any>;
  _handleConfiguredPreroll(): void;
  _handleEveryAndPercentage(): void;
  _attachLiveSeekedHandler(): void;
  _pushNextAdsForLive(iterator: Array<RunTimeAdBreakObject>, calcPositionCallback: Function): void;
  _handleConfiguredMidrolls(): void;
  _handleReturnToLive(adBreaks: Array<RunTimeAdBreakObject>): void;
  _playAdBreak(adBreak: RunTimeAdBreakObject): void;
  _onAdManifestLoaded(event: FakeEvent): void;
  _onAdBreakStart(event: FakeEvent): void;
  _onAdLoaded(): void;
  _onAdStarted(event: FakeEvent): void;
  _onAdBreakEnd(): void;
  _onAdsCompleted(): void;
  _onAdError(event: FakeEvent): void;
  _isBumper(controller: IAdsPluginController): boolean;
  _onEnded(): void;
  _onPlaybackEnded(): void;
  _handleConfiguredPostroll(): void;
  _reset(): void;
  _destroy(): void;
  _mergeAdBreaks(adBreaks: Array<RunTimeAdBreakObject>): RunTimeAdBreakObject | undefined;
}
export { AdsController };
//# sourceMappingURL=ads-controller.d.ts.map
