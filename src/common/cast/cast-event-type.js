// @flow
const namespace = 'kaltura-player';

/**
 * @const {Object} CastEventType
 *
 * @example
 * // Events lifecycle
 * 1. CAST_AVAILABLE
 * 2. CAST_SESSION_STARTING
 * 3. CAST_SESSION_STARTED || CAST_SESSION_START_FAILED -> X
 * 4. CAST_SESSION_ENDING
 * 5. CAST_SESSION_ENDED
 * @example
 * // How to use
 * player.addEventListener(KalturaPlayer.cast.CastEventType.CAST_SESSION_STARTED, e => {
 *   console.log(e.session);
 * };
 */
const CastEventType: {[event: string]: string} = {
  /**
   * Fires when cast session start failed.
   * @event CAST_SESSION_START_FAILED
   * @memberof CastEventType
   */
  CAST_SESSION_START_FAILED: `${namespace}-castsessionstartfailed`,
  /**
   * Fires when cast session starting.
   * @event CAST_SESSION_STARTING
   * @memberof CastEventType
   */
  CAST_SESSION_STARTING: `${namespace}-castsessionstarting`,
  /**
   * Fires when cast session started.
   * @event CAST_SESSION_STARTED
   * @memberof CastEventType
   */
  CAST_SESSION_STARTED: `${namespace}-castsessionstarted`,
  /**
   * Fires when cast session ending.
   * @event CAST_SESSION_ENDING
   * @memberof CastEventType
   */
  CAST_SESSION_ENDING: `${namespace}-castsessionending`,
  /**
   * Fires when cast session ended.
   * @event CAST_SESSION_ENDED
   * @memberof CastEventType
   */
  CAST_SESSION_ENDED: `${namespace}-castsessionended`,
  /**
   * Fires when cast is available.
   * @event CAST_AVAILABLE
   * @memberof CastEventType
   */
  CAST_AVAILABLE: `${namespace}-castavailable`
};

export {CastEventType};
