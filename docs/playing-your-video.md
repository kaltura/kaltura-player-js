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

> Note: For OVP players, you'll only need to fill the entryid (mandatory) and the KS (optional). For Cloud TV players, you'll need to provide these parameters and more. See details below.

<details><summary><b>MediaInfo Documentation - OVP</b></summary>
<p>

### `mediaInfo` Structure

```js
{
  entryId: string,
  ks: string
}
```

**Parameters**

| Name      | Type     | Required | Description                     | Possible Values | Default Value |
| --------- | -------- | -------- | ------------------------------- | --------------- | ------------- |
| `entryId` | `string` | V        | The entry ID of the media       |
| `ks`      | `string` |          | The KS (Kaltura Session) secret |

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

| Name                 | Type            | Required | Description                            | Possible Values                                                    | Default Value |
| -------------------- | --------------- | -------- | -------------------------------------- | ------------------------------------------------------------------ | ------------- |
| `entryId`            | `string`        | V        | The entry ID of the media              |
| `mediaType`          | `string`        |          | The type of the specific media         | `"media"`, `"epg"`, `"recording"`                                  | `"media"`     |
| `assetReferenceType` | `string`        |          | The asset type of the specific media   | `"media"`, `"epg_internal"`, `"epg_external"`                      | `"media"`     |
| `contextType`        | `string`        |          | The playback context type              | `"PLAYBACK"`, `"CATCHUP"`, `"START_OVER"`, `"TRAILER"`             | `"PLAYBACK"`  |
| `ks`                 | `string`        |          | The KS (Kaltura Session) secret        |
| `protocol`           | `string`        |          | The protocol of the specific media     | `"https"`, `"http"`                                                |
| `fileIds`            | `string`        |          | List of comma-separated media file IDs |
| `streamerType`       | `string`        |          | The playback streamer type             | `"applehttp"`, `"mpegdash"`, `"url"`, `"smothstreaming"`, `"none"` |
| `urlType     `       | `string`        |          | The playback url type                  | `"PLAYMANIFEST"`, `"DIRECT"`                                       |
| `fileIds`            | `string`        |          | List of comma-separated media file IDs |
| `formats`            | `Array<string>` |          | Device types as defined in the system. |

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

Click ~~here~~ to see the full `loadMedia` API.

## Next Step

Continue to learn how to manage player tracks, events, states and more using the development [guides](./guides.md).
