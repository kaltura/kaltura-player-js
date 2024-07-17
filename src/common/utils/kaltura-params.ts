import { PKSourcesConfigObject, PlayerStreamTypes, StreamType, Utils } from '@playkit-js/playkit-js';
import { getServerUIConf } from './setup-helpers';
import { KalturaPlayer } from '../../kaltura-player';
import { PartialKPOptionsObject } from '../../types';
import { SessionIdGenerator } from './session-id-generator';

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const DRM_SESSION_ID = 'sessionId=';
const REFERRER = 'referrer=';
const UICONF_ID = 'uiConfId=';
const CLIENT_TAG = 'clientTag=html5:v';
const UDRM_DOMAIN = 'kaltura.com';
const CUSTOM_DATA = 'custom_data=';
const SIGNATURE = 'signature=';
const SEEK_FROM = 'seekFrom=';
const CLIP_TO = 'clipTo=';

declare global {
  interface Window {
    originalRequestReferrer?: string;
  }
}

/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function handleSessionId(player: KalturaPlayer, playerConfig: PartialKPOptionsObject): void {
  if (player.config.session && player.config.session.id) {
    // on change media
    updateSessionId(player, playerConfig);
  } else {
    // on first playback
    addSessionId(playerConfig);
    if (player?.playlist?.items?.length && playerConfig.sources?.id) {
      player.sessionIdCache?.set(playerConfig.sources.id, playerConfig.session!.id as string);
    }
  }
}

/**
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addSessionId(playerConfig: PartialKPOptionsObject): void {
  setSessionId(playerConfig, SessionIdGenerator.next());
}

/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function updateSessionId(player: KalturaPlayer, playerConfig: PartialKPOptionsObject): void {
  const entryId = playerConfig.sources?.id;

  if (!player?.playlist?.items?.length) {
    setSessionId(playerConfig, SessionIdGenerator.next());
  } else if (entryId) {
    if (player.sessionIdCache?.get(entryId)) {
      setSessionId(playerConfig, player.sessionIdCache?.get(entryId));
    } else {
      const sessionId = SessionIdGenerator.next();
      player.sessionIdCache?.set(entryId, sessionId);
      setSessionId(playerConfig, sessionId);
    }
  }
}

/**
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @param {string} sessionId - the session id
 * @return {void}
 * @private
 */
function setSessionId(playerConfig: PartialKPOptionsObject, sessionId: string): void {
  playerConfig.session = playerConfig.session || {};
  playerConfig.session.id = sessionId;
}

/**
 * @param {string} url - url
 * @param {string} sessionId - session id
 * @param {string} paramName - optional param name of the session id
 * @return {string} - the url with the new sessionId
 * @private
 */
function updateSessionIdInUrl(player: KalturaPlayer | null, url: string, sessionId?: string, paramName: string = PLAY_SESSION_ID): string {
  if (sessionId) {
    const sessionIdInUrlRegex = new RegExp(paramName + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
    const sessionIdInUrl = sessionIdInUrlRegex.exec(url);
    // this url has session id (has already been played)
    if (sessionIdInUrl && sessionIdInUrl[1]) {
      // session id should be the same for the same entry
      if (!player?.playlist?.items?.length) {
        url = url.replace(sessionIdInUrl[1], sessionId);
      }
    } else {
      url += getQueryStringParamDelimiter(url) + paramName + sessionId;
    }
  }
  return url;
}

/**
 * @return {string} - The referrer
 * @private
 */
function getReferrer(): string {
  let referrer;
  try {
    referrer = window.parent.document.URL;
  } catch (e) {
    // unfriendly iframe

    // try to get it from originalReferrer supplied by backend
    // or fallback to document referrer
    referrer = window.originalRequestReferrer || document.referrer;
  }
  return referrer;
}

function isInUnfriendlyIframe(): boolean {
  try {
    // window.parent.document.URL cannot be accessed in unfriendly iframe
    return window.parent.document.URL !== window.parent.document.URL;
  } catch {
    return true;
  }
}

/**
 * @param {string} url - url
 * @return {string} - the url with the referrer appended in the query params
 * @private
 */
function addReferrer(url: string): string {
  if (url.indexOf(REFERRER) === -1) {
    const referrer = btoa(getReferrer().substr(0, 1000));
    url += getQueryStringParamDelimiter(url) + REFERRER + referrer;
  }
  return url;
}

/**
 * @param {string} url - url
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {string} - the url with the uiconf id appended in the query params
 * @private
 */
function addUIConfId(url: string, playerConfig: PartialKPOptionsObject): string {
  const uiConfId = Utils.Object.getPropertyPath(playerConfig, 'provider.uiConfId');
  if (url.indexOf(UICONF_ID) === -1 && typeof uiConfId === 'number') {
    url += getQueryStringParamDelimiter(url) + UICONF_ID + uiConfId;
  }
  return url;
}

/**
 * @param {string} url - url
 * @return {string} - returns the next param delimiter (? or &) according to the current url structure
 * @private
 */
function getQueryStringParamDelimiter(url: string): string {
  return url.indexOf('?') === -1 ? '?' : '&';
}

/**
 * @param {string} url - url
 * @param {string} productVersion - product version
 * @return {string} - the url with the client tag appended in the query params
 * @private
 */
function addClientTag(url: string, productVersion?: string): string {
  if (url.indexOf(CLIENT_TAG) === -1) {
    url += getQueryStringParamDelimiter(url) + CLIENT_TAG + (productVersion || __VERSION__);
  }
  return url;
}

/**
 * @param {string} url - url
 * @param {PKSourcesConfigObject} sources - sources
 * @return {string} - the url with the seekFrom and clipTo appended in the query params
 * @private
 */
function addStartAndEndTime(url: string, sources: PKSourcesConfigObject): string {
  const seekFrom = Utils.Object.getPropertyPath(sources, 'seekFrom');
  const clipTo = Utils.Object.getPropertyPath(sources, 'clipTo');
  if (typeof seekFrom === 'number' && url.indexOf(SEEK_FROM) === -1) {
    url += getQueryStringParamDelimiter(url) + SEEK_FROM + seekFrom * 1000;
  }
  if (typeof clipTo === 'number' && url.indexOf(CLIP_TO) === -1) {
    url += getQueryStringParamDelimiter(url) + CLIP_TO + clipTo * 1000;
  }
  return url;
}

/**
 * Adding Kaltura specific params to player config and player sources.
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addKalturaParams(player: KalturaPlayer, playerConfig: PartialKPOptionsObject): void {
  handleSessionId(player, playerConfig);
  const sources: PKSourcesConfigObject = playerConfig.sources!;
  const sessionId = playerConfig.session && playerConfig.session.id;
  const productVersion = getServerUIConf()?.productVersion;
  Object.values(StreamType).forEach((key: PlayerStreamTypes) => {
    if (sources[key]) {
      sources[key].forEach((source) => {
        if (
          typeof source.url === 'string' &&
          source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1 &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          !source.localSource
        ) {
          source.url = updateSessionIdInUrl(player, source.url, sessionId);
          source.url = addReferrer(source.url);
          source.url = addClientTag(source.url, productVersion);
          source.url = addStartAndEndTime(source.url, sources);
        }
        if (source['drmData'] && source['drmData'].length) {
          source['drmData'].forEach((drmData) => {
            if (typeof drmData.licenseUrl === 'string' && [UDRM_DOMAIN, CUSTOM_DATA, SIGNATURE].every((t) => drmData.licenseUrl.includes(t))) {
              drmData.licenseUrl = updateSessionIdInUrl(player, drmData.licenseUrl, sessionId, DRM_SESSION_ID);
              drmData.licenseUrl = addClientTag(drmData.licenseUrl, productVersion);
              drmData.licenseUrl = addReferrer(drmData.licenseUrl);
              drmData.licenseUrl = addUIConfId(drmData.licenseUrl, playerConfig);
            }
          });
        }
      });
    }
  });
}

export {
  addKalturaParams,
  handleSessionId,
  updateSessionIdInUrl,
  getReferrer,
  addReferrer,
  addClientTag,
  addUIConfId,
  isInUnfriendlyIframe,
  addStartAndEndTime
};
