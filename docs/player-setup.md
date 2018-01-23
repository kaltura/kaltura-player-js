# Player Setup
Player setup requires the following steps to create a player instance:
### Step 1 - Load the Library
```html
<script src="//PATH/TO/PLAYER/LIB/FILENAME.js"></script>
```
### Step 2 - Create the Player Container
```html
<div id="player-container"></div>
```
### Step 3 - Define Your Configuration
```js
var config = {
	targetId: "player-container",
	player: { ... }, // player configuration
	provider: { // provider configuration
		...
		partnerId: YOUR_PARTNER_ID
		...
	},
	ui: { ... } // ui configuration
};
```

**@AnnaAleksandrowicz - Need to add some intro sentences about common/important examples**

#### Example: Using a Kaltura Session
If you need to use a ks for your media requests, configure it inside your provider configuration:
```js
var config = {
	...
	provider: { 
		...
		partnerId: YOUR_PARTNER_ID,
		ks: 'YOUR_KS'
		...
	}
	...
};
var player = KalturaPlayer.setup(config);
``` 

#### Example: Using Server Configuration
If you want to use server configuration you'll need to provide the `uiConfId` in your provider configuration:
```js
var config = {
	...
	provider: {
		...
		partnerId: YOUR_PARTNER_ID,
		uiConfId: YOUR_UI_CONF_ID
		...
	}
	...
};
var player = KalturaPlayer.setup(config);
``` 

#### Example: Using Environment
If you want to refer to a specific backend URL, you can specify it in your provider configuration:
```js
var config = {
	...
	provider: {
		...
		partnerId: YOUR_PARTNER_ID,
		env: {
			serviceUrl: 'YOUR_SERVICE_URL'
		}
		...
	}
	...
};
var player = KalturaPlayer.setup(config);
``` 
> For full configuration details see [this]() document. 


### Step 4 - Set Up the Player
To get your player instance, use the `setup` factory method and pass it your player configuration: 
```js
var player = KalturaPlayer.setup(config);
```

## Next Step
To start playing your video, visit [Playing Your Video]().

