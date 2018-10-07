// @flow
declare type KPPlaylistConfigObject = {
  id: string,
  metadata: KPPlaylistMetadata,
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<KPPlaylistItem>
};
