// @flow
const namespace = 'kaltura-player';

/**
 * @const {Object} CuePointEventType
 *
 * @example
 * // How to use
 * player.addEventListener(KalturaPlayer.cuepoint.Event.TIMED_METADATA_ADDED, e => {
 *   console.log(e.payload);
 * };
 */
const CuePointEventType: {[event: string]: string} = {
  /**
   * Fires when new cue-points added to text-track.
   * @event TIMED_METADATA_ADDED
   * @memberof CuePointEventType
   */
  TIMED_METADATA_ADDED: `${namespace}-timedmetadataadded`
};

export {CuePointEventType};
