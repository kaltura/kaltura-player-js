# Adding preview thumbnails using VTT files

Kaltura player supports the loading of preview thumbnails using VTT files,

#### In the next examples, a configuration for the VTT file is provided as a part of the mediaOptions or mediaConfig objects parameters As seen in the examples, we include:

- vttUrl: URL to the WebVTT file that refers to the thumbnails.
- imgBaseUrl (optional): the base image url where the images / sprite image are served from.

NOTE: The URL is relative to the application domain by default

### exemple 1 - provided as a part of the mediaOptions

```js
var kalturaPlayer = KalturaPlayer.setup(playerConfig);
kalturaPlayer.loadMedia(
  {entryId: '0_wifqaipd'},
  {
    thumbnails: {
      vttUrl: 'https://www.radiantmediaplayer.com/media/vtt/thumbnails/bbb-thumbnails.vtt',
      imgBaseUrl: 'https://www.radiantmediaplayer.com/media/vtt/thumbnails'
    }
  }
);
```

### exemple 2 - provided as a part of the mediaConfig

```js
var kalturaPlayer = KalturaPlayer.setup(playerConfig);
kalturaPlayer.setMedia({
  plugins: {...},
  sources: {
    options: {},
    thumbnails : {
      vttUrl: 'https://www.radiantmediaplayer.com/media/vtt/thumbnails/bbb-thumbnails.vtt',
      imgBaseUrl:'https://www.radiantmediaplayer.com/media/vtt/thumbnails'
    }
  }
});
```

### The supported formats

####a Sprite Image file

```js
00:05.000 --> 00:10.000
/assets/preview2.jpg
```

The Player will render the thumbnails in the tooltip using their original dimensions. Thumbnails of 100-150 pixels wide tend to work well. Smaller thumbnails are hard to decipher and larger thumbnails are too much of a distraction to the main content.

####Single Image files

```js
00:00:00.000 --> 00:00:10.000
/preview/sprite.png#xywh=0,0,128,72
```

NOTE: The Player only supports pixel-based fragments, not percentage-based ones.
