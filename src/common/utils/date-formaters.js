/**
 * @public
 * @param {string} durationInSeconds - duration in Seconds
 * @return {string} - The evaluated string
 */
export function convertDurationToISO8601(durationInSeconds) {
  const seconds = Math.floor(durationInSeconds % 60);
  const minutes = Math.floor((durationInSeconds / 60) % 60);
  const hours = Math.floor((durationInSeconds / (60 * 60)) % 24);
  const days = Math.floor(durationInSeconds / (60 * 60 * 24));

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  const isoDuration = `P${days || ''}DT${paddedHours}H${paddedMinutes}M${seconds}S`;
  return isoDuration;
}

/**
 * @public
 * @param {string} unixTimestamp - date  in unixTimestamp format
 * @return {string} - The evaluated string
 */
export function convertUnixTimestampToISO8601(unixTimestamp) {
  const milliseconds = unixTimestamp * 1000;
  const date = new Date(milliseconds);
  const iso8601Date = date.toISOString();
  return iso8601Date;
}
