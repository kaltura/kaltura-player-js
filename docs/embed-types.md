# Embed Code Types

When using embed codes, you can select from one of three options: Auto Embed, Dynamic Embed and Iframe Embed. You may want to use different embed code types in different situations, according to the explanations below. 

## Auto Embed  

Auto embed is the recommended embed code for the Kaltura Player. It uses precise code and is good for getting a player or widget onto the page quickly and easily without any runtime customizations.<br>

Auto embed is optimized for packing a lots of resources into the initial request, allowing the player to be rendered quickly.
<br>Here's how to use the auto embed code:

```html
<div id="{TARGET_ID}" style="width: 640px;height: 360px"></div>
<script type="text/javascript" src='https://cdnapisec.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}?autoembed=true&targetId={TARGET_ID}&entry_id={ENTRY_ID}&config[playback]={"autoplay":true}'></script>
```

## Dynamic Embed  

Dynamic embed is recommended for cases where you want to control runtime configuration dynamically and/or have more control over the embed call.<br>

Basic dynamic embed codes look like this:

```html
<div id="{TARGET_ID}" style="width: 640px;height: 360px"></div>
<script type="text/javascript" src="https://cdnapisec.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}"></script>
  <script type="text/javascript">
    try {
      var kalturaPlayer = KalturaPlayer.setup({
        targetId: "{TARGET_ID}",
        provider: {
          partnerId: {PARTNER_ID},
          uiConfId: {UICONF_ID}
        },
        player: {
          playback:{
            autoplay: true
          }
        }
      });
      kalturaPlayer.loadMedia({entryId: '{ENTRY_ID}'});
    } catch (e) {
      console.error(e.message)
    }
  </script>
```

## IFrame Embed  

The iframe embed is good for sites that don't allow third-party JavaScript to be embedded in their pages. This makes the iFrame embed a better fit for sites that have stringent page security requirements.<br>

Note that if you use the iframe only embed mode, the page won't be able to access the player API:

```html
<iframe type="text/javascript" src='https://cdnapisec.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}?iframeembed=true&entry_id={ENTRY_ID}&config[playback]={"autoplay":true}'
   style="width: 640px;height: 360px" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0">
</iframe>
```

