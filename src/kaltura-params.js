//@flow
import {Utils, VERSION} from 'playkit-js'

const PLAY_MANIFEST = 'playmanifest/';
const PLAY_SESSION_ID = 'playSessionId=';
const REFERRER = 'referrer=';
const CLIENT_TAG = 'clientTag=html5:v';
const PROGRESSIVE = 'video/mp4';

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @public
 */
function handleSessionId(selectedSource: Object = {}, player: Player): void {
  if (player.config.session && player.config.session.id) { // on change media
    updateSessionId(selectedSource, player);
  } else { // on first playback
    addSessionId(selectedSource, player);
  }
}

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function addSessionId(selectedSource: Object, player: Player): void {
  let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
  let primaryGUID = Utils.Generator.guid();
  let secondGUID = Utils.Generator.guid();
  let sessionId = primaryGUID + ':' + secondGUID;
  selectedSource.url += delimiter + PLAY_SESSION_ID + sessionId;
  player.sessionId = sessionId;
}

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function updateSessionId(selectedSource: Object, player: Player): void {
  let newSessionId: string = "";
  let secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
  let secondGuidInSessionId = secondGuidInSessionIdRegex.exec(player.config.session.id);
  if (secondGuidInSessionId && secondGuidInSessionId[1]) {
    newSessionId = player.config.session.id.replace(secondGuidInSessionId[1], Utils.Generator.guid());
    player.sessionId = newSessionId;
  }
  updateSessionIdInUrl(selectedSource, newSessionId);
}

/**
 * @param {Object} selectedSource - selected source
 * @param {string} newSessionId - new session id
 * @return {void}
 * @private
 */
function updateSessionIdInUrl(selectedSource: Object, newSessionId: string): void {
  let sessionIdInUrlRegex = /playSessionId=((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)/i;
  let sessionIdInUrl = sessionIdInUrlRegex.exec(selectedSource.url);
  if (sessionIdInUrl && sessionIdInUrl[1]) { // this url has session id (has already been played)
    selectedSource.url = selectedSource.url.replace(sessionIdInUrl[1], newSessionId);
  } else {
    let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
    selectedSource.url += delimiter + PLAY_SESSION_ID + newSessionId;
  }
}

/**
 * @param {Object} selectedSource - selected source
 * @return {void}
 * @private
 */
function addReferrer(selectedSource: Object) {
  if (selectedSource.url.indexOf(REFERRER) === -1) {
    let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
    selectedSource.url += delimiter + REFERRER + btoa(document.referrer || document.URL);
  }
}

/**
 * @param {Object} selectedSource - selected source
 * @return {void}
 * @private
 */
function addClientTag(selectedSource: Object) {
  if (selectedSource.url.indexOf(CLIENT_TAG) === -1) {
    let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
    selectedSource.url += delimiter + CLIENT_TAG + VERSION;
  }
}

/**
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function copyParamsToProgressiveSources(player: Player) {
  player.config.sources.progressive.forEach((source) => {
    updateSessionIdInUrl(source, player.config.session.id);
    addReferrer(source);
    addClientTag(source);
  });
}

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function addKalturaParams(selectedSource: Object = {}, player: Player): void {
  if (typeof selectedSource.url === 'string' && selectedSource.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1) {
    handleSessionId(selectedSource, player);
    addReferrer(selectedSource);
    addClientTag(selectedSource);
    if (selectedSource.mimetype === PROGRESSIVE) { // in progressive playback we have to update all progressive sources
      copyParamsToProgressiveSources(player);
    }
  }
}

export {addKalturaParams, handleSessionId, addReferrer, addClientTag, copyParamsToProgressiveSources}
