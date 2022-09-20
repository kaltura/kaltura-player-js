# Adding preview thumbnails using VTT files

Kaltura player supports the loading of preview thumbnails using VTT files,

#### A configuration for the VTT file is provided as a part of the mediaOptions or mediaConfig objects parameters As seen in the examples, we include:

- vttUrl: URL to the WebVTT file that refers to the thumbnails.

NOTE: The urls specified in the WebVTT file are relative to the vtt file address.

### Example 1 - provided as a part of the mediaOptions

```js
var kalturaPlayer = KalturaPlayer.setup(playerConfig);
kalturaPlayer.loadMedia(
  {entryId: '0_wifqaipd'},
  {
    thumbnails: {
      vttUrl: 'https://somedomain/media/thumbnails/thumbnails.vtt'
    }
  }
);
```

### Example 2 - provided as a part of the mediaConfig

```js
var kalturaPlayer = KalturaPlayer.setup(playerConfig);
kalturaPlayer.setMedia({
  plugins: {...},
  sources: {
    options: {},
    thumbnails : {
      vttUrl: 'https://somedomain/media/thumbnails/thumbnails.vtt',
    }
  }
});
```

### The supported formats

#### Sprite Image file

```js
00:05.000 --> 00:10.000
/assets/preview2.jpg
```

The Player will render the thumbnails in the tooltip using their original dimensions. Thumbnails of 100-150 pixels wide tend to work well. Smaller thumbnails are hard to decipher and larger thumbnails are too much of a distraction to the main content.

#### Single Image files

```js
00:00:00.000 --> 00:00:10.000
/preview/sprite.png#xywh=0,0,128,72
```

NOTE: The Player only supports pixel-based fragments, not percentage-based ones.

# Adding preview thumbnails using images file

Kaltura player supports the loading of preview thumbnails using image file.

### A configuration for the images file and more is provided as a part of the player ui objects config:

#### Example:

```js
 ui: {
          components: {
            seekbar: {
              thumbsSprite: "https://images_url",

            }
          }
}
```

### Referance:

[Seekbar config](https://github.com/kaltura/playkit-js-ui/blob/master/docs/configuration.md#configcomponentsseekbar)
