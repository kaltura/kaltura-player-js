// @flow
import {Utils, ThumbnailInfo, MediaType} from '@playkit-js/playkit-js';
import evaluate from './utils/evaluate';

const DefaultThumbnailConfig: Object = {
  thumbsWidth: 164,
  thumbsHeight: 92,
  thumbsSlices: 100
};

const THUMBNAIL_REGEX = /.*\/p\/\d+\/(?:[a-zA-Z]+\/\d+\/)*thumbnail\/entry_id\/\w+\/.*\d+/;
const THUMBNAIL_SERVICE_TEMPLATE: string = '{{thumbnailUrl}}/width/{{thumbsWidth}}/height/{{thumbsHeight}}/vid_slices/{{thumbsSlices}}/ks/{{ks}}';

class ThumbnailManager {
  _player: Player;
  _thumbnailConfig: ?SeekbarConfig;

  constructor(mediaConfig: KPMediaConfig, player: Player) {
    this._player = player;
    this._thumbnailConfig = this._buildKalturaThumbnailConfig(mediaConfig);
  }

  getThumbnail(time: number): ?ThumbnailInfo {
    if (this._isUsingKalturaThumbnail()) {
      return this._convertKalturaThumbnailToThumbnailInfo(time);
    }
    return this._player.getThumbnail(time);
  }

  getKalturaThumbnailConfig(): ?SeekbarConfig {
    return this._thumbnailConfig;
  }

  _isUsingKalturaThumbnail = (): boolean => {
    return !!(this._thumbnailConfig && this._thumbnailConfig.thumbsSprite);
  };

  _convertKalturaThumbnailToThumbnailInfo = (time: number): ?ThumbnailInfo => {
    if (this._thumbnailConfig) {
      const {thumbsSprite, thumbsWidth, thumbsHeight, thumbsSlices} = this._thumbnailConfig;
      const thumbnailInfo = new ThumbnailInfo();
      const duration = this._player.duration / thumbsSlices;
      thumbnailInfo.x = Math.floor(time / duration) * thumbsWidth;
      thumbnailInfo.y = thumbsHeight;
      thumbnailInfo.url = thumbsSprite;
      thumbnailInfo.height = thumbsHeight;
      thumbnailInfo.width = thumbsWidth;
      return thumbnailInfo;
    }
  };

  _buildKalturaThumbnailConfig = (mediaConfig: KPMediaConfig): ?SeekbarConfig => {
    const seekbarConfig = Utils.Object.getPropertyPath(this._player.config.ui, 'components.seekbar');
    const posterUrl = mediaConfig.sources && mediaConfig.sources.poster;
    const isVod = mediaConfig.sources && mediaConfig.sources.type === MediaType.VOD;
    const ks = mediaConfig.session && mediaConfig.session.ks;
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
            ks,
            ...thumbnailConfig
          };
          return evaluate(THUMBNAIL_SERVICE_TEMPLATE, model);
        } catch (e) {
          return '';
        }
      }
    }
    return '';
  };
}

export {ThumbnailManager, THUMBNAIL_REGEX, DefaultThumbnailConfig};
