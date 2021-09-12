//@flow
import {StreamType, Utils} from '@playkit-js/playkit-js';

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const DRM_SESSION_ID = 'sessionId=';
const REFERRER = 'referrer=';
const UICONF_ID = 'uiConfId=';
const CLIENT_TAG = 'clientTag=html5:v';
const UDRM_DOMAIN = 'kaltura.com';
const CUSTOM_DATA = 'custom_data=';
const SIGNATURE = 'signature=';

/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function handleSessionId(player: Player, playerConfig: PartialKPOptionsObject): void {
  if (player.config.session && player.config.session.id) {
    // on change media
    updateSessionId(player, playerConfig);
  } else {
    // on first playback
    addSessionId(playerConfig);
  }
}

/**
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addSessionId(playerConfig: PartialKPOptionsObject): void {
  let primaryGUID = Utils.Generator.guid();
  let secondGUID = Utils.Generator.guid();
  setSessionId(playerConfig, primaryGUID + ':' + secondGUID);
}

/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function updateSessionId(player: Player, playerConfig: PartialKPOptionsObject): void {
  let secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
  let secondGuidInSessionId = secondGuidInSessionIdRegex.exec(player.config.session.id);
  if (secondGuidInSessionId && secondGuidInSessionId[1]) {
    setSessionId(playerConfig, player.config.session.id.replace(secondGuidInSessionId[1], Utils.Generator.guid()));
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
function updateSessionIdInUrl(url: string, sessionId: ?string, paramName: string = PLAY_SESSION_ID): string {
  if (sessionId) {
    let sessionIdInUrlRegex = new RegExp(paramName + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
    let sessionIdInUrl = sessionIdInUrlRegex.exec(url);
    if (sessionIdInUrl && sessionIdInUrl[1]) {
      // this url has session id (has already been played)
      url = url.replace(sessionIdInUrl[1], sessionId);
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
    referrer = document.referrer;
  }
  return referrer;
}

/**
 * @param {string} url - url
 * @return {string} - the url with the referrer appended in the query params
 * @private
 */
function addReferrer(url: string): string {
  if (url.indexOf(REFERRER) === -1) {
    let referrer = btoa(getReferrer().substr(0, 1000));
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
function addClientTag(url: string, productVersion: ?string): string {
  if (url.indexOf(CLIENT_TAG) === -1) {
    url += getQueryStringParamDelimiter(url) + CLIENT_TAG + (productVersion || __VERSION__);
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
function addKalturaParams(player: Player, playerConfig: PartialKPOptionsObject): void {
  handleSessionId(player, playerConfig);
  const sources = playerConfig.sources;
  const sessionId = playerConfig.session && playerConfig.session.id;
  const productVersion = window.__kalturaplayerdata.productVersion;
  Object.values(StreamType).forEach(key => {
    // $FlowFixMe
    if (sources[key]) {
      sources[key].forEach(source => {
        if (typeof source.url === 'string' && source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1 && !source.localSource) {
          source.url = updateSessionIdInUrl(source.url, sessionId);
          source.url = addReferrer(source.url);
          source.url = addClientTag(source.url, productVersion);
        }
        if (source.drmData && source.drmData.length) {
          source.drmData.forEach(drmData => {
            if (typeof drmData.licenseUrl === 'string' && [UDRM_DOMAIN, CUSTOM_DATA, SIGNATURE].every(t => drmData.licenseUrl.includes(t))) {
              drmData.licenseUrl = updateSessionIdInUrl(drmData.licenseUrl, sessionId, DRM_SESSION_ID);
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

export {addKalturaParams, handleSessionId, updateSessionIdInUrl, getReferrer, addReferrer, addClientTag, addUIConfId};
