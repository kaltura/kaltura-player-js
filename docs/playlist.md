# Playlist

Kaltura Player exposes several API's to load a playlist, configure and manipulate it. 

## Table of Contents

- [Load A Playlist](#load-a-playlist)
  - [By Playlist Id](#by-playlist-id)
  - [By Entry List](#by-entry-list)
  - [By Configuration](#by-configuration)
- [Config the Playlist](#config-the-playlist)
- [Switch Item](#switch-item)
- [Change Playlist](#change-playlist)

### Load A Playlist

Before loading a playlist you have to setup a Kaltura Player instance. 

```javascript
const config = PLAYER_CONFIG;
const kalturaPlayer = KalturaPlayer.setup(config);
```

To learn how to setup a Kaltura Player see [Player Setup](./player-setup.md).
<br>Once you have a Kaltura Player instance, you can load a playlist by the following ways: 

#### By Playlist Id (OVP Only)

To load a playlist by id use [`loadPlaylist`](./api.md#loadplaylist) method.

```javascript
kalturaPlayer.loadPlaylist({playlistId: '123456'});
```

#### By Entry List

To load a playlist by entry list use [`loadPlaylistByEntryList`](./api.md#loadplaylistbyentrylist) method.
<br>This method creates a playlist according the given entries.

```javascript
kalturaPlayer.loadPlaylistByEntryList({entries: [{entryId: '01234'}, {entryId: '56789'}]});
```

#### By Configuration

You can load a playlist by config explicitly the playlist data and items, using [`configure`](./api.md#configure) method.
```javascript
kalturaPlayer.configure({
  playlist: {
    metadata: {
      name: 'my playlist name',
      description: 'my playlist desc'
    },
    items: [{
      sources: {
        poster: 'poster_1_url',
        hls: [
          {
            id: "id1",
            mimetype: "application/x-mpegURL",
            url: "source_1_url"
          }
        ]
      }
    },{
      sources: {
        poster: 'poster_2_url',
        hls: [
          {
            id: "id2",
            mimetype: "application/x-mpegURL",
            url: "source_2_url"
          }
        ]
      }
    }]
  }
});
```
For full playlist options see [`KPPlaylistObject`](./api.md#kpplaylistobject).

## Config the Playlist

### Auto Continue

By default once the current item is ended, the playlist continues to the next item automatically.
<br>To change this behavior, config the playlist [`options`](./api.md#kpplaylistoptions) via the API:
```javascript
kalturaPlayer.loadPlaylist({playlistId: '123456'}, {options: {autoContinue: false}});
```
```javascript
kalturaPlayer.loadPlaylistByEntryList({entries: [{entryId: '01234'}, {entryId: '56789'}]}, {options: {autoContinue: false}});
```
Or by configuration: 
```javascript
kalturaPlayer.configure({
  playlist: {
    options: {autoContinue: false}
  }
});
```
> Note: `autoContinue` property is relevant only for the second item onwards.
<br>For play the first entry automatically use [`autoplay`](https://github.com/kaltura/playkit-js/blob/master/docs/autoplay.md) configuration.        

### Countdown

When the current item is about to end, and the playlist set to auto continue,
A countdown will display to the user, through he can skip to the next immediately, or to cancel the switching.
![playlist-countdown](./images/playlist-countdown.png)

By default the countdown is display for 10 seconds until the end. 
<br>To change this behavior, config the playlist [`countdown`](./api.md#kpplaylistcountdownoptions).
<br> For example, to show the countdown for 20 seconds until the end, config via the API:
```javascript
kalturaPlayer.loadPlaylist({playlistId: '123456'}, {countdown: {duration: 20}});
```
```javascript
kalturaPlayer.loadPlaylistByEntryList({entries: [{entryId: '01234'}, {entryId: '56789'}]}, {countdown: {duration: 20}});
```
Or by configuration: 
```javascript
kalturaPlayer.configure({
  playlist: {
    countdown: {
      duration: 20
    }
  }
});
```
To show the countdown in a specific moment (usually to enable the user to skip the end subtitles) config:
```javascript
kalturaPlayer.loadPlaylist({playlistId: '123456'}, {countdown: {timeToShow: 600}});
```
In this case the countdown will display at the 600's second for 10 seconds, then will skip th the next item.

## Switch Item

Via [`playlist`](./api.md#playlist) api the user can get the playlist data and switch between the items.
```javascript
// switch to the next item
kalturaPlayer.playlist.playNext();
 
// switch to the previous item
kalturaPlayer.playlist.playPrev();
 
// switch to a specific item by index
const lastItem = kalturaPlayer.playlist.items.length - 1;
kalturaPlayer.playlist.playItem(lastItem); 
```
For full `playlist` api see [PlaylistManager](./api.md#playlistmanager).

## Change Playlist

To clean the playlist data need to call to [`playlist.reset`](./api.md#reset) method.
Here an example how to replace the playlist using the playlist [`events`](./api.md#playlisteventtype) and `reset` method. 
```javascript
kalturaPlayer.loadPlaylist({playlistId: '01234'});
kalturaPlayer.addEventListener(KalturaPlayer.playlist.PlaylistEventType.PLAYLIST_ENDED, () => {
  kalturaPlayer.playlist.reset();
  kalturaPlayer.loadPlaylist({playlistId: '56789'});
});
``` 

> Note: The playlist [config](./api.md#KPPlaylistConfigObject) is not removed on reset. 
```javascript
kalturaPlayer.loadPlaylist({playlistId: '01234'}, {options: {autoContinue: false}});
kalturaPlayer.playlist.reset();
kalturaPlayer.loadPlaylist({playlistId: '56789'}).then(() => {
  console.log(kalturaPlayer.playlist.options.autoContinue) // false
});
```  
>To change the behavior need to override the config:
```javascript
kalturaPlayer.loadPlaylist({playlistId: '01234'}, {options: {autoContinue: false}});
kalturaPlayer.playlist.reset();
kalturaPlayer.loadPlaylist({playlistId: '56789'}, {options: {autoContinue: true}}).then(() => {
  console.log(kalturaPlayer.playlist.options.autoContinue) // true
});
```
