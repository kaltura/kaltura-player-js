# Getting Started Guide - Using the TV Platform Player Studio to Create a Player

### Table of Contents

- [Creating a New Kaltura Player](#create)
- [Generating the Kaltura Player Embed Code](#generate)
- [Embedding the Kaltura Player into Your Website](#embed)
- [Configuring Your Player](#config)

To create a new Kaltura Player using the TV Platform Player Studio, you'll need to have an active Kaltura Management Console (KMC) account. For more information on getting an account, see [here](https://corp.kaltura.com/Products/Video-Applications/Kaltura-Video-Management-Console).

## Creating a New Kaltura Player <a name="create"></a>

1.  Open the [KMC](https://kmc.kaltura.com/index.php/kmcng/login) and select the **Studio** tab.
    ![kmc](./images/kmc.png)

2.  Next, select **TV Platform Studio**.
    ![studio](./images/studio.png)
    <br>This displays a list of available players, including the players you've already created.

3.  To create a new player, click **Add New Player**.
    ![tv platform](images/tv-platform-add.png)
    <br>After creating the new player, you can customize it using the Studio; however, for now, creating a player with the default settings is enough.<br>

4.  Call the new player _"My first Kaltura Player"_ and click **Save Player Settings**.
    ![player](./images/player-save.png)

That's it - you've created a new Kaltura Player.

## Generating a Kaltura Player Embed Code <a name="generate"></a>

1.  To generate an embed code, go to the **Content** tab, where you can manage your loaded entries, playlists, etc.
    ![content tab](./images/content-tab.png)

2.  Select the entry you wish to embed, click on the _3 dots_ button and select **Share & Embed**.
    ![content preview & embed](./images/content-share-and-embed.png)
    <br>Here you can choose the player you want to use in the embed code as well as the embed type - Auto, Dynamic or iframe. See [Embed Code Types](./embed-types.md) for more information.<br>

3.  From the player list, select _My first Kaltura Player_, which is the player you just created.
4.  Expand **Advanced Settings** and choose **Dynamic Embed** from the **Embed Type** dropdown list.
5.  Click **Copy** to copy the embed code to the clipboard.
    ![preview & embed](images/share-and-embed-dynamic-copy.png)

## Embedding the Kaltura Player into Your Website <a name="embed"></a>

1.  First, create a simple html file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<head>
<body>
</body>
</html>
```

2.  Add a `div` element for the player (the `id` must be compatible with the `targetId` of the embed code):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<head>
<body>
  <div id="my-player" style="width: 640px;height: 360px"></div>
</body>
</html>
```

3.  Paste the embed code from the clipboard to the `body`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<head>
<body>
  <div id="my-player" style="width: 640px;height: 360px"></div>
  <script type="text/javascript" src="http://www.kaltura.com/p/2196781/embedPlaykitJs/uiconf_id/41483031"></script>
  <script type="text/javascript">
  try {
    var config = {
      targetId: "my-player",
      provider: {
        partnerId: 2196781,
        uiConfId: 41483031
      }
    };
    var kalturaPlayer = KalturaPlayer.setup(config);
    kalturaPlayer.loadMedia({entryId: '1_aoofesd2'});
  } catch (e) {
    console.error(e.message)
  }
  </script>
</body>
</html>
```

**You now have an embedded player in your website.**

## Configuring the Player <a name="config"></a>

After creating a player and embedding it in your site, you may want to configure it using the wide range of configuration options. To learn more, see player [configuration](./configuration.md).
