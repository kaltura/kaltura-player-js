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
    updateSessionId(player);
  } else { // on first playback
    addSessionId(player);
  }
  updateSessionIdInUrl(selectedSource, player.config.session.id);
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
 * @param {Object} selectedSource - selected source
 * @param {string} sessionId - session id
 * @return {void}
 * @private
 */
function updateSessionIdInUrl(selectedSource: Object, sessionId: string): void {
  let sessionIdInUrlRegex = new RegExp(PLAY_SESSION_ID + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
  let sessionIdInUrl = sessionIdInUrlRegex.exec(selectedSource.url);
  if (sessionIdInUrl && sessionIdInUrl[1]) { // this url has session id (has already been played)
    selectedSource.url = selectedSource.url.replace(sessionIdInUrl[1], sessionId);
  } else {
    let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
    selectedSource.url += delimiter + PLAY_SESSION_ID + sessionId;
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
