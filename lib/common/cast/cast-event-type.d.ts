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
declare const CastEventType: {
  [event: string]: string;
};
export { CastEventType };
//# sourceMappingURL=cast-event-type.d.ts.map
