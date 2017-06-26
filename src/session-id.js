//@flow
/**
 * @return {string} - GUID
 * @private
 */
function _generateGUID(): string {
  let S4 = () => {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function _addSessionId(selectedSource: Object, player: Player): void {
  let delimiter = selectedSource.url.indexOf('?') === -1 ? '?' : '&';
  let primaryGUID = _generateGUID();
  let secondGUID = _generateGUID();
  let sessionId = primaryGUID + ':' + secondGUID;
  selectedSource.url += delimiter + 'playSessionId=' + sessionId;
  player.sessionId = sessionId;
}

/**
 * @param {Object} selectedSource - selected source
 * @param {string} sessionId - session id
 * @param {Player} player - player
 * @return {void}
 * @private
 */
function _replaceSecondGUID(selectedSource: Object, sessionId: string, player: Player): void {
  let secondGUIDRegex = /:((?:[a-z0-9]|-)*)/i;
  let secondGUID = secondGUIDRegex.exec(sessionId);
  if (secondGUID && secondGUID[1]) {
    let newSessionId = sessionId.replace(secondGUID[1], _generateGUID());
    selectedSource.url = selectedSource.url.replace(sessionId, newSessionId);
    player.sessionId = newSessionId;
  }
}

/**
 * @param {Object} selectedSource - selected source
 * @param {Player} player - player
 * @return {void}
 * @public
 */
function handleSessionId(selectedSource: Object = {}, player: Player): void {
  if (typeof selectedSource.url === 'string' && selectedSource.url.toLowerCase().indexOf('playmanifest/') !== -1) {
    let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
    let sessionId = sessionIdRegex.exec(selectedSource.url);
    if (sessionId && sessionId[1]) {
      _replaceSecondGUID(selectedSource, sessionId[1], player);
    } else {
      _addSessionId(selectedSource, player);
    }
  }
}

export default handleSessionId
