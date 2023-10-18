import { KPAdPrebidConfig, KPPrebidConfig } from '../../types/ads/prebid-config';
import { DefferedPromise } from '../../types/utils/deffered-promise';
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
declare class PrebidManager {
  static _logger: any;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _config: KPPrebidConfig | undefined;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _prebid: any;
  /**
   * @member
   * @private
   * @memberof PrebidManager
   */
  _loadPromise: DefferedPromise;
  constructor(config?: KPPrebidConfig);
  _isPrebidSDKLibLoaded(): boolean;
  _loadPrebidSDKLib(libUrl: string): Promise<any>;
  _load(config: KPAdPrebidConfig): Promise<any>;
  /**
   * load the prebid
   * @public
   * @param {KPAdPrebidConfig} config - The prebid config.
   * @returns {void}
   * @memberof PrebidManager
   */
  load(config: KPAdPrebidConfig): Promise<any>;
}
export { PrebidManager };
//# sourceMappingURL=prebid-manager.d.ts.map
