# Playing Your Video 
To start playing your video, you'll need first to create your media info object and then to use the `loadMedia` API.

### Step 1 - Create a Media Info Object
First, define your media info object:
```js
var mediaInfo = {
	...
};
```

<details><summary><b>mediaInfo Documentation - OVP</b></summary>
<p>

### `mediaInfo` Structure:

```js
{
	entryId: string,
	ks: string
}
```


**Parameters**

|  Name | Type  |Required| Description| Possible Values | Default Value |
|---|---|---|---|---|---|
| `entryId` | `string` | V | The entry id of the media|
| `ks` | `string` | | The ks secret|

### Examples
#### Using KS
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	ks: 'YOUR_KS'
	...
};
```

</p>
</details>

<details><summary><b>mediaInfo Documentation - OTT</b></summary>
<p>

### `mediaInfo` Structure:
```js
{
	entryId: string,
	ks: string,
	mediaType: string, 
	contextType: string, 
	protocol: string, 
	fileIds: string, 
	formats: Array<string> 
}
```

**Parameters**

|  Name | Type  |Required| Description| Possible Values | Default Value
|---|---|---|---|---|---|
| `entryId` | `string` | V | The entry id of the media
| `mediaType` | `string` | | The type of the specific media | `"MEDIA"`, `"EPG"`, `"RECORDING"` | `"MEDIA"`
| `contextType` | `string` | | The playback context type | `"PLAYBACK"`, `"CATCHUP"`, `"START_OVER"`, `"TRAILER"` | `"PLAYBACK"`
| `ks` | `string` | | The ks secret
| `protocol` | `string` | | The protocol of the specific media | `"https"`, `"http"`  
| `fileIds` | `string` | | List of comma separated media file IDs
| `formats` | `Array<string>` | | Device types as defined in the system.


### Examples
#### Using KS
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	ks: 'YOUR_KS'
	...
};
```
####   Specify a Protocol
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	protocol: 'https'
	...
};
```
#### Specify Media Type
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	mediaType: 'EPG'
	...
};
```

#### Specify Context Type
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	contextType: 'TRAILER'
	...
};
```
#### Specify File IDs
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	fileIds: 'FILE_ID1,FILE_ID2'
	...
};
```
#### Specify Device Formats
```js
var mediaInfo = {
	...
	entryId: 'YOUR_ENTRY_ID',
	formats: ['Device_Format_1', 'Device_Format_2', 'Device_Format_3']
	...
};
```

</p>
</details>


After your media info has been created, you are ready to load your media.

## 2. Load the Media
To load your media, call `loadMedia` API. <br>The `loadMedia` method returns a promise, since its an asynchronies operation that access to a server. When the promise has been resolved, you can manipulate the player:
```js
player.loadMedia(mediaInfo).then(() => {
	player.play();
});
```


## Load Media API
### `loadMedia(mediaInfo)`

**Parameters**
|  Name|Type  |Description|
|--|--|--|
| `mediaInfo` | `Object` | The media info

Returns: `Promise` - Will be resolved after the server request has been completed and the player has been received playable sources.
