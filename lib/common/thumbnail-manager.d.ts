import { ThumbnailInfo, EventManager } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../kaltura-player';
import { KPThumbnailConfig } from '../types/thumbnail-config';
import { UiConfig } from '../types/ui-config';
import { KPMediaConfig } from '../types/media-config';
import { Poster } from '../types/provider/poster';
declare const DefaultThumbnailConfig: Object;
declare const THUMBNAIL_REGEX: RegExp;
declare class ThumbnailManager {
  _player: KalturaPlayer;
  _thumbnailConfig: KPThumbnailConfig;
  _eventManager: EventManager;
  _thumbsHeight: number | undefined;
  constructor(player: KalturaPlayer, uiConfig: UiConfig, mediaConfig: KPMediaConfig);
  destroy(): void;
  getThumbnail(time: number): ThumbnailInfo;
  getKalturaThumbnailConfig(): KPThumbnailConfig;
  _isUsingKalturaThumbnail: () => boolean;
  _convertKalturaThumbnailToThumbnailInfo: (time: number) => ThumbnailInfo;
  _buildKalturaThumbnailConfig: (uiConfig: UiConfig, mediaConfig: KPMediaConfig) => KPThumbnailConfig;
  _getThumbSlicesUrl: (posterUrl: string | Poster[], ks: string | undefined, thumbnailConfig: Object) => string;
}
export { ThumbnailManager, THUMBNAIL_REGEX, DefaultThumbnailConfig };
//# sourceMappingURL=thumbnail-manager.d.ts.map
