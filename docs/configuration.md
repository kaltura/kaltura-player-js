
## Configuration
Player configuration parameters are provided whenever a player instance is created.
```js
var config = {
  // Configuration here
};
var player = KalturaPlayer.setup(config);
```

#### Configuration Structure  

The configuration uses the following structure:

```js
{
  targetId: string,
  logLevel: string,
  disableUserCache: boolean,
  player: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui: UIOptionsObject
}
```
##
>### config.targetId
>##### Type: `string`
>##### Default: `-`
>##### Description: Defines the ID of the DOM element to which the player will be added.
##
>### config.logLevel
>##### Type: `string`
>##### Default: `"ERROR"`
>##### Description: Defines the player log level.
>Possible values: `"DEBUG", "INFO", "TIME", "WARN", "ERROR", "OFF"`
## 
>### config.disableUserCache
>##### Type: `boolean`
>##### Default: `false`
>##### Description: Indicates whether to stop using the saved user preferences.
>User preferences are actions that triggered by the user and produce a configurable value that is saved in the browser's local storage. The player uses those values to enable consistent use of the player. For example, if the last watched media was muted, the next media will be muted also, even if the user refreshed the page.
<br>More on user preferences in the player can be found [here]().
## 
>### config.player
>##### Type: `PKPlayerOptionsObject`
>##### Description: Defines the player configuration.
>Full configuration documentation for the config.player can be found [here](). 
##
>### config.provider
>##### Type: `ProviderOptionsObject`
>##### Description: Defines the provider configuration.
>Full configuration documentation for the config.provider can be found [here](). 
##
>### config.ui
>##### Type: `UIOptionsObject`
>##### Description: Defines the user interface (UI) configuration.
>Full configuration documentation for the config.ui can be found [here](). 

## Configuration Strength
In the player setup flow, the configuration described above (partially or in full) can be provided by a number of different sources. Each source has a different "strength", meaning has a greater or less impact on how the player is configured.

Available sources include:

* **Application** - This is the application that embeds the player and can configures the player inline upon instantiation.
* **Server** - A partner configuration that is saved on the server. The partner can use this configuration when configuring the player by suppling the `uiConfId` value.
* **Local Storage (Browser)** - This is the user preferences configuration, which is saved in the local storage of the browser. 
* **Default Player Configuration** - The default player configuration is defined internally by the player. 

When the player builds its runtime configuration, it will need to how to built the configuration correctly according to the strength of each configuration, which is as follows (#1 is strongest; #4 is weakest):

1. **Local Storage**
2. **Application **
3. **Server **
4. **Default Player Configuration***

![configuration-strength](./images/configuration-strength.jpg)

#### Example
Let's assume the following configurations from each source to see how they affect the configuration:

Local Storage
```js
{
	muted: true,
	audioLanguage: 'spa'
}
```
Application
```js
{
	muted: false,
	volume: 0.7
}
```
Server
```js
{
	audioLanguage: 'eng'
	autoplay: true
}
```
Default Player Configuration
```js
{
	audioLanguage: '',
	textLanguage: '',
	muted: false,
	volume: 1,
	autoplay: false
}
```

**The resulting runtime configuration will, therefore, be as follows:**

```js
{
	audioLanguage: 'spa',
	textLanguage: '',
	muted: true,
	volume: 0.7,
	autoplay: true
}
```
