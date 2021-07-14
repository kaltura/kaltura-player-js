// @flow
import {Utils, ThumbnailInfo, MediaType} from '@playkit-js/playkit-js';
import evaluate from './utils/evaluate';

const DefaultThumbnailConfig: Object = {
  thumbsWidth: 164,
  thumbsHeight: 92,
  thumbsSlices: 100
};

const THUMBNAIL_REGEX = /.*\/p\/\d+\/(?:[a-zA-Z]+\/\d+\/)*thumbnail\/entry_id\/\w+\/.*\d+/;
const THUMBNAIL_SERVICE_TEMPLATE: string = '{{thumbnailUrl}}/width/{{thumbsWidth}}/vid_slices/{{thumbsSlices}}/ks/{{ks}}';

class ThumbnailManager {
  _player: Player;
  _thumbnailConfig: ?KPThumbnailConfig;

  constructor(player: Player, uiConfig: KPUIOptionsObject, mediaConfig: KPMediaConfig) {
    this._player = player;
    this._thumbnailConfig = this._buildKalturaThumbnailConfig(uiConfig, mediaConfig);
  }

  getThumbnail(time: number): ?ThumbnailInfo {
    if (this._isUsingKalturaThumbnail()) {
      return this._convertKalturaThumbnailToThumbnailInfo(time);
    }
    return this._player.getThumbnail(time);
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
      const thumbsHeight = Math.floor((thumbsWidth * this._player.videoHeight) / this._player.videoWidth);
      const duration = this._player.duration / thumbsSlices;
      const thumbnailInfo = {
        x: Math.floor(time / duration) * thumbsWidth,
        y: thumbsHeight,
        url: thumbsSprite,
        height: thumbsHeight,
        width: thumbsWidth
      };
      return new ThumbnailInfo(thumbnailInfo);
    }
  };

  _buildKalturaThumbnailConfig = (uiConfig: KPUIOptionsObject, mediaConfig: KPMediaConfig): ?KPThumbnailConfig => {
    const seekbarConfig = Utils.Object.getPropertyPath(uiConfig, 'components.seekbar');
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
