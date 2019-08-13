export class Provider {
  getMediaConfig() {
    return Promise.resolve(EMPTY_CONFIG_RESPONSE);
  }
  getPlaylistConfig() {}
  getEntryListConfig() {}
}

export let EMPTY_CONFIG_RESPONSE = {session: {}, plugins: {}, sources: {poster: '', hls: [], dash: [], progressive: []}};
