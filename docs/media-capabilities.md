# Media Capabilities API

It is possible to get the media capabilities and to decide which action to take accordingly.

This API will give you the following information:

- Whether the browser is supporting HEVC
- Whether the browser is supporting DRM
- Which DRM schemas, if any, are supported by the browser (widevine, fairplay, playready)
- Whether the playback of the media will be power efficient

It is optional to pass an object parameter to the API, which will contain the HEVC configuration to test.
See below a list of the optional properties:

- `width` (number) - Optional width of the video. default is `1920`.
- `height` (number) - Optional height of the video. default is `1080`.
- `bitrate` (number) - Optional number of bits used to encode a second of video. default is `1200000`.
- `framerate` (number) - Optional number of frames used in one second. default is `30`.

The Media Capabilities API is returning the following object structure:

- `isHEVCSupported` (number) - Specifies the HEVC supported type by the browser
- `isPowerEfficient` (number) - Specifies power efficiency supported type
- `isDRMSupported` (number) - Specifies the DRM supported type by the browser
- `supportedDRMs` (Array) - List of supported DRMs (optional values: widevine, playready, fairplay)

Note - the optional numbers for the flags are:

- 1 - SUPPORTED
- 0 - NOT_SUPPORTED
- -1 - MAYBE_SUPPORTED in case there was a problem with getting the information

### Example - how to use Media Capabilities API and its response

```js
// after calling KalturaPlayer.setup().....
kalturaPlayer.getMediaCapabilities({width: 1280, height: 720}).then(mediaCapabilities => {
  // print the media capabilities result to the console
  console.log('media capabilities result --> ', {mediaCapabilities});
  // load drm media or clear media, based on the API response
  kalturaPlayer.loadMedia({entryId: mediaCapabilities.isDRMSupported === 1 ? DRM_ENTRY_ID : CLEAR_ENTRY_ID});
});
```

Note: the API should be invoked after calling KalturaPlayer.setup() API

### You want to pass HEVC configuration to the API, but you don't know which values to choose

See below a list of online resources to help you choose the values you need:

- optional values for [width and height][1]
- optional values for [bitrate][2]
- optional values for [framerate][3]

[1]: https://support.google.com/youtube/answer/6375112
[2]: https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cbitrate
[3]: https://support.google.com/youtube/answer/1722171?hl=en#zippy=%2Cframe-rate
