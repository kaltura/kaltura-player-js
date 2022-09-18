// @flow
import {Utils, ThumbnailInfo, MediaType, EventManager} from '@playkit-js/playkit-js';
import evaluate from './utils/evaluate';

const DefaultThumbnailConfig: Object = {
  thumbsWidth: 164,
  thumbsHeight: 92,
  thumbsSlices: 100
};

const THUMBNAIL_REGEX = /.*\/p\/\d+\/(?:[a-zA-Z]+\/\d+\/)*thumbnail\/entry_id\/\w+\/.*\d+/;
const THUMBNAIL_SERVICE_TEMPLATE: string = '{{thumbnailUrl}}/width/{{thumbsWidth}}/vid_slices/{{thumbsSlices}}';

class ThumbnailManager {
  _player: KalturaPlayer;
  _thumbnailConfig: ?KPThumbnailConfig;
  _eventManager: EventManager;
  _thumbsHeight: number;

  constructor(player: KalturaPlayer, uiConfig: KPUIOptionsObject, mediaConfig: KPMediaConfig) {
    this._player = player;
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

  destroy() {
    this._eventManager.destroy();
  }

  getThumbnail(time: number): ?ThumbnailInfo {
    if (this._isUsingKalturaThumbnail()) {
      return this._convertKalturaThumbnailToThumbnailInfo(time);
    }
    return this._player._localPlayer.getThumbnail(time);
  }

  getKalturaThumbnailConfig(): ?KPThumbnailConfig {
    return this._thumbnailConfig;
  }

  _isUsingKalturaThumbnail = (): boolean => {
    return !!(this._thumbnailConfig && this._thumbnailConfig.thumbsSprite);
  };

  _convertKalturaThumbnailToThumbnailInfo = (time: number): ?ThumbnailInfo => {
    if (this._thumbnailConfig) {
      const {thumbsSprite, thumbsWidth, thumbsSlices} = this._thumbnailConfig;
      const duration = this._player.duration / thumbsSlices;
      const thumbnailInfo = {
        x: Math.floor(time / duration) * thumbsWidth,
        y: 0,
        url: thumbsSprite,
        height: this._thumbsHeight,
        width: thumbsWidth
      };
      return new ThumbnailInfo(thumbnailInfo);
    }
  };

  _buildKalturaThumbnailConfig = (uiConfig: KPUIOptionsObject, mediaConfig: KPMediaConfig): ?KPThumbnailConfig => {
    const seekbarConfig = Utils.Object.getPropertyPath(uiConfig, 'components.seekbar');
    const posterUrl = mediaConfig.sources && mediaConfig.sources.poster;
    const isVod = mediaConfig.sources && mediaConfig.sources.type === MediaType.VOD;
    const ks = this._player.shouldAddKs(mediaConfig) ? mediaConfig.session?.ks : '';
    const thumbnailConfig = Utils.Object.mergeDeep(DefaultThumbnailConfig, seekbarConfig);
    const thumbsSprite = isVod ? this._getThumbSlicesUrl(posterUrl, ks, thumbnailConfig) : '';
    return {
      thumbsSprite,
      ...thumbnailConfig
    };
  };

  _getThumbSlicesUrl = (posterUrl: string | Array<Object>, ks: ?string, thumbnailConfig: Object): string => {
    if (typeof posterUrl === 'string') {
      if (THUMBNAIL_REGEX.test(posterUrl)) {
        try {
          const model: Object = {
            thumbnailUrl: posterUrl,
            ...thumbnailConfig
          };
          const url = evaluate(THUMBNAIL_SERVICE_TEMPLATE, model);
          return ks ? url + `/ks/${ks}` : url;
        } catch (e) {
          return '';
        }
      }
    }
    return '';
  };
}

export {ThumbnailManager, THUMBNAIL_REGEX, DefaultThumbnailConfig};
