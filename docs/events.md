# Player Events  

The player event system uses an event target-like API to register, unregister and dispatch events. The event's main purpose is to notify the player components about changes to the player state, ads, video progress, etc.

## Table of Contents
  * [Player Event Types](#player-event-types)
  * [Registering to Player Events](#registering-to-player-events)
  * [Dispatching Events From the Player](#dispatching-events-from-the-player)
      - [Dispatch Your Own Custom Event](#dispatch-your-own-custom-event)
      - [Dispatch An Existing Player Event](#dispatch-an-existing-player-event)
  * [Player Readiness](#player-readiness)
  * [Events List](#events-list)
  
## Player Event Types  

Player events consist of two event types:

* **HTML5 Video Events** - These are various events sent by the browser when handling media that is embedded using the `<video>` element. The player runs on top of the HTML video element, which may trigger the events. Information about these types of events can be found [here](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events).
* **Player Custom Events** - These are **special** events that indicate a change in the state of the player that **does not exist in the HTML5 video event list** and that are related to the integral behavior of the player. These can include ads, switching to fullscreen, and tracks events.

## Registering to Player Events

You can listen to player events by adding an event listener to the player object.

```javascript
player.addEventListener(player.Event.TRACKS_CHANGED, event => {
  const payload = event.payload;
  // Do something with the payload
});
```

> **A full list of player events can be found [here](https://github.com/kaltura/playkit-js/blob/master/src/event/events.js)**.
## Dispatching Events From the Player

To dispatch an event from the player instance, type the following code:

#### Dispatch Your Own Custom Event
```javascript
player.dispatchEvent(new FakeEvent('myEventName', {
  ... // Fill your payload
}));
```

#### Dispatch An Existing Player Event
```javascript
player.dispatchEvent(new FakeEvent(player.Event.SEEKED, null}));
```

## Player Readiness  

The player ready promise indicates the that player has done loading the media and can start playing. The promise is resolved when the `TRACKS_CHANGED` event is dispatched.
A basic usage of this feature looks like this:

```javascript
player.ready().then(() => {
  var tracks = player.getTracks();
});
```

## Events List

The full events list, which updates from time to time, can be found [here](https://github.com/kaltura/playkit-js/blob/master/src/event/events.js).
