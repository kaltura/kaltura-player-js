# Playing Your Video

To start playing your video, you'll need to create your media info object and then use the `loadMedia` API. Here are the required steps.

## Step 1 - Create a Media Info Object

First, define your media info object:

```js
var mediaInfo = {
     ...
};
```

To learn how to fill your media info object correctly, click the relevant media information documentation below.

> Note: For OVP players, you'll only need to fill the entryId or referenceId (at least one is mandatory)
> and the KS (optional). If both entryid and referenceId are provided, the entryid has precendence.
> For Cloud TV players, you'll need to provide these parameters and more. See details below.

<details><summary><b>MediaInfo Documentation - OVP</b></summary>
<p>

### `mediaInfo` Structure

```js
{
  entryId: string,
  ks: string,
  referenceId: string
}
```

**Parameters**

| Name          | Type     | Description                                           | Possible Values | Default Value |
| ------------- | -------- | ----------------------------------------------------- | --------------- | ------------- |
| `entryId`     | `string` | The entry ID of the media                             |
| `referenceId` | `string` | A reference ID of the media (instead of the entry ID) |
| `ks`          | `string` | The KS (Kaltura Session) secret                       |

> Note: \*\*\* Either entryId or referenceId must be supplied (if both will be supplied, the media will be loaded by mediaId)

### Examples

#### Basic Usage

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID'
};
```

#### Using the KS

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  ks: 'YOUR_KS'
};
```

#### Using the reference Id

```js
var mediaInfo = {
  referenceId: 'YOUR_REFERENCE_ID'
};
```

</p>
</details>

<details><summary><b>MediaInfo Documentation - Cloud TV</b></summary>
<p>

### `mediaInfo` Structure

```js
{
  entryId: string,
  ks: string,
  mediaType: string,
  contextType: string,
  assetReferenceType: string,
  protocol: string,
  fileIds: string,
  streamerType: string,
  urlType: string,
  formats: Array<string>
}
```

**Parameters**

| Name                 | Type            | Description                                             | Possible Values                                                    | Default Value |
| -------------------- | --------------- | ------------------------------------------------------- | ------------------------------------------------------------------ | ------------- |
| `entryId`            | `string`        | The entry ID of the media                               |
| `referenceId`        | `string`        | The reference ID of the media (instead of the entry ID) |
| `mediaType`          | `string`        | The type of the specific media                          | `"media"`, `"epg"`, `"recording"`                                  | `"media"`     |
| `assetReferenceType` | `string`        | The asset type of the specific media                    | `"media"`, `"epg_internal"`, `"epg_external"`                      | `"media"`     |
| `contextType`        | `string`        | The playback context type                               | `"PLAYBACK"`, `"CATCHUP"`, `"START_OVER"`, `"TRAILER"`             | `"PLAYBACK"`  |
| `ks`                 | `string`        | The KS (Kaltura Session) secret                         |
| `protocol`           | `string`        | The protocol of the specific media                      | `"https"`, `"http"`                                                |
| `fileIds`            | `string`        | List of comma-separated media file IDs                  |
| `streamerType`       | `string`        | The playback streamer type                              | `"applehttp"`, `"mpegdash"`, `"url"`, `"smothstreaming"`, `"none"` |
| `urlType`            | `string`        | The playback url type                                   | `"PLAYMANIFEST"`, `"DIRECT"`                                       |
| `formats`            | `Array<string>` | Device types as defined in the system.                  |

> Note: \*\*\* Either entryId or referenceId must be supplied (if both will be supplied, the media will be loaded by mediaId)

## Examples

Let's look at some examples.

### Basic Usage

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID'
};
```

### Using the KS

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  ks: 'YOUR_KS'
  ...
};
```

### Specify a Protocol

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  protocol: 'https'
  ...
};
```

### Specify a Media Type

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  mediaType: 'epg'
  ...
};
```

### Specify a Context Type

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  contextType: 'TRAILER'
  ...
};
```

### Specify the File IDs

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  fileIds: 'FILE_ID1,FILE_ID2'
  ...
};
```

### Specify Device Formats

```js
var mediaInfo = {
  entryId: 'YOUR_ENTRY_ID',
  formats: ['Device_Format_1', 'Device_Format_2', 'Device_Format_3']
  ...
};
```

</p>
</details>

<br>After you've created your media info, you're ready to load your media.

## Step 2 - Load the Media

To load your media, call the `loadMedia` API.
<br>The `loadMedia` method returns a promise, since it's an asynchronous operation that accesses a server. When the promise has been resolved, you can manipulate the player as follows:

```js
player.loadMedia(mediaInfo).then(() => {
  player.play();
});
```

Click [here](api.md#loadmedia) to see the full `loadMedia` API.

### Media Options

In addition to `mediaInfo`, you can also pass media options to the `loadMedia` API. Those options will override the default options supplied from the backend or those configured in the player.
Example:

```javascript
const mediaOptions = {
  ...
  poster: 'my/poster/url',
  startTime: 30,
  ...
};
player.loadMedia(mediaInfo, mediaOptions);
```

## Next Step

Continue to learn how to manage player tracks, events, states and more using the development [guides](./guides.md).
