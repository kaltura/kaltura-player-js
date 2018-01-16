
# How to Build a Plugin

To build your own plugin, you'll have to go through a few simple steps.
First, you'll need to import the player library. Then, you'll need to write your plugin logic and implement the plugin API methods and properties, and finally, you'll need to register the plugin in the player framework.

In this guide we will go through and elaborate each step with examples of both Plain JavaScript & ES6 ways.

## Table of Contents
  * [Base Plugin API](#base-plugin-api)
      - [```constructor(name, player, config)```](#constructorname-player-config)
    + [Properties](#properties)
      - [```config```](#config)
      - [```player```](#player)
      - [```name```](#name)
      - [```logger```](#logger)
      - [```eventManager```](#eventmanager)
    + [Properties to Implement](#properties-to-implement)
      - [```(static) defaultConfig```](#static-defaultconfig)
    + [Methods](#methods)
      - [```getConfig(attr)```](#getconfigattr)
      - [```updateConfig(update)```](#updateconfigupdate)
      - [```getName()```](#getname)
      - [```dispatchEvent(name, payload)```](#dispatcheventname-payload)
    + [Methods to Implement](#methods-to-implement)
      - [```(static) isValid(player)```](#static-isvalidplayer)
      - [```destroy()```](#destroy)
      - [```reset()```](#reset)
  * [Register Plugin API](#register-plugin-api)
      - [`registerPlugin(pluginName, pluginClass)`](#registerpluginpluginname-pluginclass)
- [Writing a Basic Plugin](#writing-a-basic-plugin)
  * [Step 1 - Import the Player Library](#step-1---import-the-player-library)
  * [Step 2 - Create Your Plugin Class](#step-2-------create-your-plugin-class)
    + [*Plain JavaScript*](#plain-javascript)
    + [*ES6*](#es6)
  * [Step 3 - Override `BasePlugin` Methods](#step-3-------override-baseplugin-methods)
    + [*Plain JavaScript*](#plain-javascript-1)
    + [*ES6*](#es6-1)
  * [Step 4 - Fill Simple Implementation](#step-4-------fill-simple-implementation)
    + [*Plain JavaScript*](#plain-javascript-2)
    + [*ES6*](#es6-2)
  * [Step 5 - Register Your Plugin](#step-5-------register-your-plugin)
  * [Step 5 - Configure Your Plugin](#step-5-------configure-your-plugin)
 - [Writing an Advanced Plugin](#writing-an-advanced-plugin)
 The player core library exposing two main utils:
1. `BasePlugin` - The class which your plugin will inherit from.
2. `registerPlugin` - Static player method that will register your plugin in the player registry.

First, lets take a look on the `BasePlugin` API.

## Base Plugin API
> #### ```constructor(name, player, config)```
**Parameters**

|  Name|Type  |Description
|------|------|-----------
| `name` | `string` | Plugin name
| `player` | `playkit.core.Player` | Player instance
| `config` | `Object` | Plugin config
#
### Properties
> #### ```config```
Type: ```Object``` - The runtime plugin config.
> #### ```player```
Type: ```playkit.core.Player``` - The player instance.
> #### ```name```
Type: ```string``` - The plugin registry name.
> #### ```logger```
Type: ```playkit.core.Logger``` - The logger of the plugin.
> #### ```eventManager```
Type: ```playkit.core.EventManager``` - The plugin event manager.
#
### Properties to Implement
> #### ```(static) defaultConfig```
Type: ```Object``` - The default plugin config.
#
### Methods
> #### ```getConfig(attr)```
**Parameters**

|  Name|Type  |Description
|------|------|---
| `attr` | `string` | config key (optional)

Returns: ```any``` - If attribute is provided, returns the value of the config attribute. If not, returns the plugin config.

> #### ```updateConfig(update)```
**Parameters**

|  Name|Type  |Description
|------|------|----
| `update` | `Object` | New full or partial config

Returns: ```void``` - Merges the update config with the existing config.

> #### ```getName()```
Returns: ```string``` - The plugin name.

> #### ```dispatchEvent(name, payload)```
**Parameters**

|  Name|Type  |Description
|------|------|----
| `name` | `string` | The event name
| `payload` | `Object` | The event payload object

Returns: ```void``` - Dispatches an event from the player.
#
### Methods to Implement
> #### ```(static) isValid(player)```

**Parameters**

|  Name|Type  |Description
|------|------|----------
| `player` | `playkit.core.Player` | Player instance

Returns: ```boolean``` - Whether the plugin is valid or not.

You can help the player instance API with your decision logic. For example, if you want to enable your plugin only on Chrome browser, you can simply do:
```js
// Plain JavaScript
MyPlugin.isValid = function() {
	return player.env.browser.name === 'Chrome';
}
```
```js
// ES6
class MyPlugin extends BasePlugin {
	static isValid(player) {
		return player.env.browser.name === 'Chrome';
	}
}
```
> #### ```destroy()```
Returns: ```void``` - Runs the plugin destroy logic.

The player will call this method before destroying himself.

> #### ```reset()```
Returns: ```void``` - Runs the plugin reset logic.

The player will call this method before changing media.
#
Second, lets take a look on the `registerPlugin` API.

## Register Plugin API
> #### `registerPlugin(pluginName, pluginClass)`

**Parameters**

|  Name|Type  |Description
|------|------|----
| `pluginName` | `string` | The plugin name
| `pluginClass` | `playkit.core.BasePlugin` | The plugin class



# Writing a Basic Plugin
Let's see how we can write a simple plugin, such that does not required any installation or setup steps except of a player script in our hand (remotely or locally).

Our steps will follow both Vanilla JavaScript & ES6 examples.

> If you're using ES6 already, you can use that syntax with your transpiler/language of choice (`Babel`, `TypeScript`, `Flow`, etc).

## Step 1 - Import the Player Library
In your ***index.html*** file, include a path to the player script:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPlugin</title>
    <script src="PATH/TO/PLAYER/LIB/FILENAME.js"></script>
</head>
</html>
```

Create a new file called ***my-plugin.js*** and include it also in your `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPlugin</title>
    <script src="PATH/TO/PLAYER/LIB/FILENAME.js"></script>
    <script src="PATH/TO/FILE/my-plugin.js"></script>
</head>
<body>
</body>
</html>
```
## Step 2 - 	Create Your Plugin Class
### *Plain JavaScript*
In ***my-plugin.js***, define the plugin class:
```js
var MyPlugin = function (name, player, config) {
}
```
And add the code which will inherit from `BasePlugin`:
```js
var MyPlugin = function (name, player, config) {
    KalturaPlayer.core.BasePlugin.call(this, name, player, config);
};

MyPlugin.createPlugin = KalturaPlayer.core.BasePlugin.createPlugin;

MyPlugin.prototype = new KalturaPlayer.core.BasePlugin();
```

### *ES6*
In ***my-plugin.js***, define the plugin class:
```typescript
class MyPlugin {
	constructor(name, player, config) {
	}
}
```
And add some code which will inherit from `BasePlugin`:
```typescript
class MyPlugin extends KalturaPlayer.core.BasePlugin {
	constructor(name, player, config) {
		super(name, player, config);
	}
}
```

## Step 3 - 	Override `BasePlugin` Methods

In ***my-plugin.js***, add the necessary methods and properties to override as explained above:

### *Plain JavaScript*
```js
var MyPlugin = function (name, player, config) {
    KalturaPlayer.core.BasePlugin.call(this, name, player, config);
};

MyPlugin.createPlugin = KalturaPlayer.core.BasePlugin.createPlugin;

MyPlugin.prototype = new KalturaPlayer.core.BasePlugin();

MyPlugin.defaultConfig = {};

MyPlugin.isValid = function (player) {};

MyPlugin.prototype.destroy = function () {};

MyPlugin.prototype.reset = function () {};
```

### *ES6*
```typescript
class MyPlugin extends KalturaPlayer.core.BasePlugin {

	static defaultConfig = {};

	static isValid(player) {}

	constructor(name, player, config) {
		super(name, player, config);
	}

	destroy() {}

	reset() {}
}
```

## Step 4 - 	Fill Simple Implementation
To see our plugin in action, lets fill some simple implementation:
### *Plain JavaScript*
```js
var MyPlugin = function (name, player, config) {
    KalturaPlayer.core.BasePlugin.call(this, name, player, config);
    this.logger.debug('Hello from ' + this.getName() + ' plugin constructor!');
    this._myCollection = [this.config.myValue];
    this._addBindings();
};

MyPlugin.createPlugin = KalturaPlayer.core.BasePlugin.createPlugin;

MyPlugin.prototype = new KalturaPlayer.core.BasePlugin();

MyPlugin.defaultConfig = {
    myValue: 1
};

MyPlugin.isValid = function (player) {
    return true;
};

MyPlugin.prototype.destroy = function () {
    this.logger.debug("Empty collection");
    this._myCollection = [];
};

MyPlugin.prototype.reset = function () {
    this.logger.debug("Reset collection");
    this._myCollection = [this.config.myValue];
};

MyPlugin.prototype._addBindings = function () {
    this.eventManager.listen(this.player, this.player.Event.SEEKED, function () {
        this.logger.debug(this.player.currentTime + " Added to my collection");
        this._myCollection.push(this.player.currentTime);
        this.dispatchEvent("collectionUpdate", {collection: this._myCollection});
    }.bind(this));
};
```

### *ES6*

```typescript
class MyPlugin extends KalturaPlayer.core.BasePlugin {
    _myCollection;

    static defaultConfig = {
        myValue: 1
    };

    static isValid(player): boolean {
        return true;
    }

    constructor(name, player, config) {
        super(name, player, config);
        this.logger.debug('Hello from ' + this.getName() + ' plugin constructor!');
        this._myCollection = [this.config.myValue];
        this._addBindings();
    }

    destroy() {
        this.logger.debug("Empty collection");
        this._myCollection = [];
    };

    reset() {
        this.logger.debug("Reset collection");
        this._myCollection = [this.config.myValue];
    }

    _addBindings() {
        this.eventManager.listen(this.player, this.player.Event.SEEKED, () => {
            this.logger.debug(this.player.currentTime + " Added to my collection");
            this._myCollection.push(this.player.currentTime);
            this.dispatchEvent("collectionUpdate", {collection: this._myCollection});
        });
    }
}
```

## Step 5 - 	Register Your Plugin
Use the factory `registerPlugin` method to register your plugin in the player framework:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPlugin</title>
    <script src="PATH/TO/PLAYER/LIB/FILENAME.js"></script>
    <script src="PATH/TO/FILE/my-plugin.js"></script>
</head>
<body>
<script>
	KalturaPlayer.core.registerPlugin("myPlugin", MyPlugin);
</script>
</body>
</html>
```

## Step 5 - 	Configure Your Plugin
All that's left now is to make sure the player will activate the plugin in runtime. To do so, we should include our new plugin name and plugin configuration in the player configuration. i.e:
```js
var config = {
	plugins: {
		myPlugin: {
			myValue: 10
		}
	}
};
```

Let's expand our test page and add:

1. Placeholder div to the player.
```html
<div id="player-div" style="width: 360px; height: 640px;"></div>
```
2. Basic player configuration.
```js
var config = {
	logLevel: "DEBUG",
	sources: {
		progressive: [
			{
				mimetype: "video/mp4",
				url: "http://www.html5videoplayer.net/videos/toystory.mp4"
			}
		]
	},
	plugins: {
		myPlugin: {
			myValue: 10
			}
		}
};
```
3. Setup code.
```js
var playerDiv = document.getElementById("player-div");
var player = KalturaPlayer.core.loadPlayer(config);
playerDiv.appendChild(player.getView());
player.play();
```

Connect everything together and we'll get:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyPlugin</title>
    <script src="PATH/TO/PLAYER/LIB/FILENAME.js"></script>
    <script src="PATH/TO/FILE/my-plugin.js"></script>
</head>
<body>
<script>
	KalturaPlayer.core.registerPlugin("myPlugin", MyPlugin);

    var config = {
        logLevel: "DEBUG",
        sources: {
            progressive: [
                {
                    mimetype: "video/mp4",
                    url: "http://www.html5videoplayer.net/videos/toystory.mp4"

                }
            ]
        },
        plugins: {
            myPlugin: {
                myValue: 10
            }
        }
    };

    var playerDiv = document.getElementById("player-div");
    var player = KalturaPlayer.core.loadPlayer(config);
    playerDiv.appendChild(player.getView());
    player.play();
</script>
</body>
</html>
```

**That's it! the player starts to play and our plugin is in action!**

# Writing an Advanced Plugin
An advanced plugin is such that comes as a self project and handles a version, tests, documentation, dev scripts and so on.
All of the goods describes above can be achieved by using the `PlayKit JS Plugin Generator` tool. Read [here](https://github.com/kaltura/playkit-js-plugin-generator)  to learn how to do it!
