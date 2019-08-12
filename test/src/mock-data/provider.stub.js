export class Provider {
  getMediaConfig() {}
  getPlaylistConfig() {}
  getEntryListConfig() {}
}

export let EMPTY_CONFIG_RESPONSE = {session: {}, plugins: {}, sources: {poster: '', hls: [], dash: [], progressive: []}};
