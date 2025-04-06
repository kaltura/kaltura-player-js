import { Utils, ThumbnailInfo, MediaType, EventManager } from '@playkit-js/playkit-js';
import { Poster } from '@playkit-js/playkit-js-providers/types';
import evaluate from './utils/evaluate';
import { KalturaPlayer } from '../kaltura-player';
import { KPThumbnailConfig, UiConfig, KPMediaConfig } from '../types';

const DefaultThumbnailConfig: any = {
  thumbsWidth: 164,
  thumbsHeight: 92,
  thumbsSlices: 100
};

type ClipData = {
  seekFrom: number | undefined;
  clipTo: number | undefined;
};

const THUMBNAIL_REGEX = /.*\/p\/\d+\/(?:[a-zA-Z]+\/\d+\/)*thumbnail\/entry_id\/\w+\/.*\d+/;
const THUMBNAIL_SERVICE_TEMPLATE: string = '{{thumbnailUrl}}/width/{{thumbsWidth}}/vid_slices/{{thumbsSlices}}';

class ThumbnailManager {
  private _player: KalturaPlayer;
  private _thumbnailConfig: KPThumbnailConfig;
  private _eventManager: EventManager;
  private _thumbsHeight!: number;
  private _clipData: ClipData;

  constructor(player: KalturaPlayer, uiConfig: UiConfig, mediaConfig: KPMediaConfig) {
    this._player = player;
    this._clipData = this._buildClipData(mediaConfig);
    this._thumbnailConfig = this._buildKalturaThumbnailConfig(uiConfig, mediaConfig);
    this._eventManager = new EventManager();
    if (this._isUsingKalturaThumbnail()) {
      const img = new Image();
      this._eventManager.listenOnce(img, 'load', () => {
        this._thumbsHeight = img.naturalHeight;
      });
      img.src = this._thumbnailConfig?.thumbsSprite || '';
    }
  }

  private _buildClipData(mediaConfig: KPMediaConfig): ClipData {
    return {
      // @ts-expect-error - seekFrom does not exist on KPMediaConfig
      seekFrom: mediaConfig.sources.seekFrom || Utils.Object.getPropertyPath(this._player.config.sources, 'seekFrom'),
      // @ts-expect-error - clipTo does not exist on KPMediaConfig
      clipTo: mediaConfig.sources.clipTo || Utils.Object.getPropertyPath(this._player.config.sources, 'clipTo')
    };
  }

  public destroy(): void {
    this._eventManager.destroy();
  }

  public getThumbnail(time: number): ThumbnailInfo | null {
    if (this._isUsingKalturaThumbnail()) {
      return this._convertKalturaThumbnailToThumbnailInfo(time);
    }
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this._player._localPlayer.getThumbnail(time);
  }

  public getKalturaThumbnailConfig(): KPThumbnailConfig {
    return this._thumbnailConfig;
  }

  private _isUsingKalturaThumbnail = (): boolean => {
    return !!(this._thumbnailConfig && this._thumbnailConfig.thumbsSprite);
  };

  private _convertKalturaThumbnailToThumbnailInfo = (time: number): ThumbnailInfo | null => {
    if (this._thumbnailConfig) {
      const { thumbsSprite, thumbsWidth, thumbsSlices } = this._thumbnailConfig;
      const duration = this._player.duration! / thumbsSlices;
      const thumbnailInfo = {
        x: Math.floor(time / duration) * thumbsWidth,
        y: 0,
        url: thumbsSprite,
        height: this._thumbsHeight,
        width: thumbsWidth
      };
      return new ThumbnailInfo(thumbnailInfo);
    }
    return null;
  };

  private _buildKalturaThumbnailConfig = (uiConfig: UiConfig, mediaConfig: KPMediaConfig): KPThumbnailConfig => {
    const seekbarConfig = Utils.Object.getPropertyPath(uiConfig, 'components.seekbar');
    const rawThumbnailUrl = mediaConfig.sources?.rawThumbnailUrl;
    const isVod = mediaConfig.sources?.type === MediaType.VOD;
    const ks = this._player.shouldAddKs(mediaConfig) ? mediaConfig.session?.ks : '';
    const thumbnailConfig = Utils.Object.mergeDeep(DefaultThumbnailConfig, seekbarConfig);
    const thumbsSprite = isVod ? this._getThumbSlicesUrl(rawThumbnailUrl, ks, thumbnailConfig) : '';
    return {
      thumbsSprite,
      ...thumbnailConfig
    };
  };

  private _maybeCutThumbnail = (baseUrl: string): string => {
    const { seekFrom, clipTo } = this._clipData;
    let url = baseUrl;
    if (typeof seekFrom === 'number') {
      url += `/start_sec/${seekFrom}`;
    }
    if (typeof clipTo === 'number') {
      url += `/end_sec/${clipTo}`;
    }
    return url;
  };

  private _getThumbSlicesUrl = (posterUrl: string | Poster[] | undefined, ks: string | undefined, thumbnailConfig: any): string => {
    if (typeof posterUrl === 'string') {
      if (THUMBNAIL_REGEX.test(posterUrl)) {
        try {
          const model: any = {
            thumbnailUrl: posterUrl,
            ...thumbnailConfig
          };
          const baseUrl = evaluate(THUMBNAIL_SERVICE_TEMPLATE, model);
          const url = this._maybeCutThumbnail(baseUrl);
          return ks ? url + `/ks/${ks}` : url;
        } catch (e) {
          return '';
        }
      }
    }
    return '';
  };
}

export { ThumbnailManager, THUMBNAIL_REGEX, DefaultThumbnailConfig };
