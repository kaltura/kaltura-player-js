# Change Media

The Player enables you to play several different media in the same instance of the player,
All you have to do is to call the [player.setMeida()](https://github.com/kaltura/kaltura-player-js/blob/master/docs/api.md#loadmedia-4) or [player.loadMeida()](<(https://github.com/kaltura/kaltura-player-js/blob/master/docs/api.md#loadmedia-4)>) API with the new `entryId / source`

For example:

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

In that case, the player will call reset internally and will play the newly provided media.

The reset only includes data related to the source / source metadata, **but keep the rest of the settings** which are not media specific, such as configuration / plugins

### Update config

If you want to change any settings or plugins configuration between different media, you can do this by using [player.configure() API](https://github.com/kaltura/kaltura-player-js/blob/master/docs/api.md#configure-1)

> **note:** `player.configure()` gets the same parameter as the `player.setup()`, see [here](./configuration.md#configuration-structure) the full configuration options.

_**Example:**_

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

### Update plugin config

Another common usage is changing the plugin config, this is also can be done using [player.configure()](https://github.com/kaltura/kaltura-player-js/blob/master/docs/api.md#configure-1) API

_**Example:**_

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
      plugins: {
        ima: {
          adTagUrl:
            'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1&cust_params=sample_ct%3Dlinear&correlator=[timestamp]'
        }
      }
    });
    kalturaPlayer.loadMedia({entryId: '{ENTRY_ID}'});

    setTimeout(() => {
      kalturaPlayer.configure({
        plugins: {
          ima: {
            adTagUrl:
              'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpostonly&cmsid=496&vid=short_onecue&correlator=[timestamp]'
          }
        }
      });

      kalturaPlayer.loadMedia({entryId: '{ANOTHER_ENTRY_ID}'});
    }, 5000);
  } catch (e) {
    console.error(e.message);
  }
</script>
```

In this example we use [Ima Plugin](https://github.com/kaltura/playkit-js-ima), and changing from _preroll_ ad tag to _postroll_ ad tag.
