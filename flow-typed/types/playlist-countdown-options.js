// @flow
/**
 * @typedef {Object} KPPlaylistCountdownOptions
 * @param {number} [timeToShow] - When the countdown will appear (by default is towards the end)
 * @param {number} [duration=10] - How match time the countdown will appear
 * @param {boolean} [showing=true] - Whether to show the countdown
 */
type _KPPlaylistCountdownOptions = {
  timeToShow?: number,
  duration: number,
  showing: boolean
};

declare type KPPlaylistCountdownOptions = _KPPlaylistCountdownOptions;
