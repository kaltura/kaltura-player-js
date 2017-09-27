//@flow
import {Utils} from 'playkit-js'
import {VERSION} from "../index";

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const REFERRER = 'referrer=';
const CLIENT_TAG = 'clientTag=html5:v';

/**
 * @param {Player} player - player
 * @return {void}
 * @public
 */
function handleSessionId(player: Player): void {
  if (player.config.session && player.config.session.id) { // on change media
    updateSessionId(player);
  } else { // on first playback
    addSessionId(player);
  }
}

/**
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function addSessionId(player: Player): void {
  let primaryGUID = Utils.Generator.guid();
  let secondGUID = Utils.Generator.guid();
  player.sessionId = primaryGUID + ':' + secondGUID;
}

/**
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function updateSessionId(player: Player): void {
  let secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
  let secondGuidInSessionId = secondGuidInSessionIdRegex.exec(player.config.session.id);
  if (secondGuidInSessionId && secondGuidInSessionId[1]) {
    player.sessionId = player.config.session.id.replace(secondGuidInSessionId[1], Utils.Generator.guid());
  }
}

/**
 * @param {Object} source - source
 * @param {string} sessionId - session id
 * @return {void}
 * @private
 */
function updateSessionIdInUrl(source: Object = {}, sessionId: string): void {
  let sessionIdInUrlRegex = new RegExp(PLAY_SESSION_ID + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
  let sessionIdInUrl = sessionIdInUrlRegex.exec(source.url);
  if (sessionIdInUrl && sessionIdInUrl[1]) { // this url has session id (has already been played)
    source.url = source.url.replace(sessionIdInUrl[1], sessionId);
  } else {
    let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
    source.url += delimiter + PLAY_SESSION_ID + sessionId;
  }
}

/**
 * @param {Object} source - source
 * @return {void}
 * @private
 */
function addReferrer(source: Object) {
  if (source.url.indexOf(REFERRER) === -1) {
    let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
    source.url += delimiter + REFERRER + btoa(document.referrer || document.URL);
  }
}

/**
 * @param {Object} source - source
 * @return {void}
 * @private
 */
function addClientTag(source: Object) {
  if (source.url.indexOf(CLIENT_TAG) === -1) {
    let delimiter = source.url.indexOf('?') === -1 ? '?' : '&';
    source.url += delimiter + CLIENT_TAG + VERSION;
  }
}

/**
 * @param {Object} sources - player sources
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function addKalturaParams(sources: Object, player: Player): void {
  handleSessionId(player);
  Object.keys(sources).forEach((key) => {
    sources[key].forEach((source) => {
      if (typeof source.url === 'string' && source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1) {
        updateSessionIdInUrl(source, player.config.session.id);
        addReferrer(source);
        addClientTag(source);
      }
    });
  });
}

export {addKalturaParams, handleSessionId, updateSessionIdInUrl, addReferrer, addClientTag}
