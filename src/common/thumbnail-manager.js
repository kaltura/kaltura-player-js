// @flow
import {Utils, ThumbnailInfo, MediaType, EventManager} from '@playkit-js/playkit-js';
import evaluate from './utils/evaluate';
import {Html5EventType} from '@playkit-js/playkit-js/dist/playkit';

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
  _eventManager: EventManager;
  _origVideoHeight: number;
  _origVideoWidth: number;
  _origDuration: number;

  constructor(player: Player, uiConfig: KPUIOptionsObject, mediaConfig: KPMediaConfig) {
    this._player = player;
    this._thumbnailConfig = this._buildKalturaThumbnailConfig(uiConfig, mediaConfig);
    this._eventManager = new EventManager();

    this._eventManager.listenOnce(this._player, Html5EventType.LOADED_METADATA, () => {
      this._origVideoHeight = this._player.videoHeight;
      this._origVideoWidth = this._player.videoWidth;
      this._origDuration = this._player.duration;
    });
  }

  destroy() {
    this._eventManager.destroy();
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
      const videoHeight = this._player.videoHeight || this._origVideoHeight;
      const videoWidth = this._player.videoWidth || this._origVideoWidth;
      const thumbsHeight = Math.floor(thumbsWidth * (videoHeight / videoWidth));
      const duration = (this._player.duration || this._origDuration) / thumbsSlices;
      const thumbnailInfo = {
        x: Math.floor(time / duration) * thumbsWidth,
        y: 0,
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
