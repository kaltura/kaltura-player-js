/* eslint-disable require-jsdoc */
function _setItem(activeItem: PlaylistItem): Promise<*> {
  const {index} = activeItem;
  PlaylistManager._logger.debug(`Playing item number ${index}`, activeItem);
  const playback: Object = {loop: false};
  if (this._playlist.current) {
    // from the second item onwards
    playback['autoplay'] = true;
  }

  this._player.configure({playback});
  this._playlist.activeItemIndex = index;

  // item was already played
  if (activeItem.isPlayable()) {
    // reset plugins to app config plugins
    this._resetProviderPluginsConfig();
    this._player.reset();

    const mergedPluginsConfigAndFromApp = mergeProviderPluginsConfig(activeItem.plugins, this._player.config.plugins);
    const providerPlugins = mergedPluginsConfigAndFromApp[0];
    this._appPluginConfig = mergedPluginsConfigAndFromApp[1];
    const media = ({session: this._player.config.session, plugins: providerPlugins, sources: activeItem.sources}: any);
    this._player.setMedia(media);
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index, activeItem}));
    return Promise.resolve();
  } else {
    if (this._mediaInfoList[index]) {
      this._resetProviderPluginsConfig();
      this._player.reset();
      const media = ({sources: activeItem.sources}: any);
      this._player.setMedia(media);

      return this._player.loadMedia(this._mediaInfoList[index]).then(mediaConfig => {
        this._playlist.updateItemSources(index, mediaConfig.sources);
        this._playlist.updateItemPlugins(index, mediaConfig.plugins);
        this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index, activeItem}));
      });
    }
  }
  return Promise.reject();
}
