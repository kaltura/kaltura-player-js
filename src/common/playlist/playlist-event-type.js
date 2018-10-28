// @flow
const namespace = 'kaltura-player';

const PlaylistEventType: {[event: string]: string} = {
  PLAYLIST_LOADED: `${namespace}-playlistloaded`,
  PLAYLIST_ITEM_CHANGED: `${namespace}-playlistitemchanged`,
  PLAYLIST_ENDED: `${namespace}-playlistended`
};

export {PlaylistEventType};
