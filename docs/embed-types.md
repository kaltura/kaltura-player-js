# Embed Types

The Embed Code type includes several options Auto Embed, Dynamic Embed, and Iframe Embed.<br> You may want to use diffrent embed code types in different situations. Here is a summary of the types. 

## Auto Embed
This is the default recommended embed code for the Kaltura Player.<br>
Auto embed is concise code and is good for quickly getting a player or widget onto the page without any runtime customizations.<br>
Auto embed has been heavily optimized for packing lots of resources into the initial request, allowing the player to be rendered quickly. 
```html
<script type="text/javascript" src="http://www.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}?autoembed=true&targetId={TARGET_ID}&entry_id={ENTRY_ID}&config={"player":{"playback":{"autoplay":true}"></script>
```

## Dynamic Embed
Dynamic embed is recommended for cases where you want to dynmaically control runtime configuration and or have more control over the embed call.<br>
Basic Embed codes look like this:
```html
<div id="{TARGET_ID}" style="width: 640px;height: 360px"></div>
<script type="text/javascript" src="http://www.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}"></script>
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
iframe embed is good for sites that do not allow 3rd party JavaScript to be embed on their pages.<br>
This mode fits more stringent page security requirements.<br>
If using this iframe only embed mode, the page won't be able to access the player API.
```html
<iframe type="text/javascript" src="http://www.kaltura.com/p/{PARTNER_ID}/embedPlaykitJs/uiconf_id/{UICONF_ID}?autoembed=true&targetId={TARGET_ID}&entry_id={ENTRY_ID}&config={"player":{"playback":{"autoplay":true}"></iframe>
```

