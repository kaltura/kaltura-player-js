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
  provider: { // provider configuration
    ...
    partnerId: 'YOUR_PARTNER_ID',
    uiConfId: 'YOUR_UICONF_ID'
    ...
  },
  playback: { ... }, // playback configuration
  plugins: { ... }, // plugins configuration
  ui: { ... } // ui configuration
};
```

The following sections are examples of common (and important) configurations for the player setup.

#### Example: Using a Kaltura Session (KS)

If you need to use a KS for your media requests, configure it inside your provider configuration:

```js
var config = {
  ...
  provider: {
    ...
    partnerId: 'YOUR_PARTNER_ID',
    ks: 'YOUR_KS'
    ...
  }
  ...
};
```

See this [article](https://developer.kaltura.com/api-docs/VPaaS-API-Getting-Started/how-to-create-kaltura-session.html) to learn more about how to create a KS.

#### Example: Using Server Configuration

If you want to use a server configuration, you'll need to provide the `uiConfId` in your provider configuration:

```js
var config = {
  ...
  provider: {
    ...
    partnerId: 'YOUR_PARTNER_ID',
    uiConfId: 'YOUR_UI_CONF_ID'
    ...
  }
  ...
};
```

#### Example: Using an Environment

If you want to refer to a specific backend URL, you can specify it in your provider configuration:

```js
var config = {
  ...
  provider: {
    ...
    partnerId: 'YOUR_PARTNER_ID',
    env: {
        serviceUrl: 'YOUR_SERVICE_URL'
      }
    ...
  }
  ...
};
```

> For full configuration details see [this](./configuration.md) document.

### Step 4 - Set Up the Player

To get your player instance, use the `setup` factory method and pass it your player configuration:

```js
var player = KalturaPlayer.setup(config);
```

## Next Step

You're now ready to start playing your video; see [Playing Your Video](./playing-your-video.md) for details.
