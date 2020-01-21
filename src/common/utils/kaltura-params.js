//@flow
import {StreamType, Utils} from '@playkit-js/playkit-js';

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const DRM_SESSION_ID = 'sessionId=';
const REFERRER = 'referrer=';
const UICONF_ID = 'uiConfId=';
const CLIENT_TAG = 'clientTag=html5:v';
const UDRM_DOMAIN = 'udrm.kaltura';

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
function updateSessionIdInUrl(url: string, sessionId: ?string, paramName: ?string = PLAY_SESSION_ID): string {
  if (sessionId) {
    let sessionIdInUrlRegex = new RegExp(paramName + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
    let sessionIdInUrl = sessionIdInUrlRegex.exec(url);
    if (sessionIdInUrl && sessionIdInUrl[1]) {
      // this url has session id (has already been played)
      url = url.replace(sessionIdInUrl[1], sessionId);
    } else {
      let delimiter = url.indexOf('?') === -1 ? '?' : '&';
      url += delimiter + paramName + sessionId;
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
    let delimiter = url.indexOf('?') === -1 ? '?' : '&';
    let referrer = btoa(getReferrer().substr(0, 1000));
    url += delimiter + REFERRER + referrer;
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
  if (url.indexOf(UICONF_ID) === -1 && typeof playerConfig.session.uiConfId === 'number') {
    let delimiter = url.indexOf('?') === -1 ? '?' : '&';
    url += delimiter + UICONF_ID + playerConfig.session.uiConfId;
  }
  return url;
}

/**
 * @param {string} url - url
 * @return {string} - the url with the client tag appended in the query params
 * @private
 */
function addClientTag(url: string): string {
  if (url.indexOf(CLIENT_TAG) === -1) {
    let delimiter = url.indexOf('?') === -1 ? '?' : '&';
    url += delimiter + CLIENT_TAG + __VERSION__;
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
  Object.values(StreamType).forEach(key => {
    // $FlowFixMe
    if (sources[key]) {
      sources[key].forEach(source => {
        if (typeof source.url === 'string' && source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1 && !source.localSource) {
          source.url = updateSessionIdInUrl(source.url, playerConfig.session && playerConfig.session.id);
          source.url = addReferrer(source.url);
          source.url = addClientTag(source.url);
        }
        if (source.drmData && source.drmData.length) {
          source.drmData.forEach(drmData => {
            if (typeof drmData.licenseUrl === 'string' && drmData.licenseUrl.indexOf(UDRM_DOMAIN) > -1) {
              drmData.licenseUrl = updateSessionIdInUrl(drmData.licenseUrl, playerConfig.session && playerConfig.session.id, DRM_SESSION_ID);
              drmData.licenseUrl = addClientTag(drmData.licenseUrl);
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
