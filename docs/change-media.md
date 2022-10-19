# Change Media

The Player enables you to play several different media in the same instance of the player,
All you have to do is call the `setMeida()` or `loadMeida()` API with the new `entryId / source`

for example:

```html
<div id="{TARGET_ID}" style="width: 640px;height: 360px"></div>
<script type="text/javascript" src="https://cdnapisec.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}"></script>
<script type="text/javascript">
  try {
    var kalturaPlayer = KalturaPlayer.setup({
      targetId: '{TARGET_ID}',
      provider: {
        partnerId: {PARTNER_ID},
        uiConfId: {UICONF_ID}
      },
      playback: {
        autoplay: true
      }
    });
    kalturaPlayer.loadMedia({entryId: '{ENTRY_ID}'});

    setTimeout((
      kalturaPlayer.loadMedia({entryId: '{ANOTHER_ENTRY_ID}'});
    ), 5000);

  } catch (e) {
    console.error(e.message);
  }
</script>
```

In that case, the player resets, and will play the newly provided media.

The reset only includes everything related to the source / source metadata, **but keep the reset of the settings** which are not media specific, such as configuration / plugins

If you want to also change any settings or plugins configuration between different media, you can do this by using `configure` API

Example:

```js
kalturaPlayer.loadMedia({entryId: '{ENTRY_ID}'});

setTimeout(() => {
  kalturaPlayer.configure({
    playback: {
      muted: true,
      volume: 5
    }
  });

  kalturaPlayer.loadMedia({entryId: '{ANOTHER_ENTRY_ID}'});
}, 5000);
```
