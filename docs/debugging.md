# Debugging & Troubleshooting

To debug the player and view explicit messages in the console, you'll need to use debug mode.
<br>In order to run the player in debug mode you'll need to set one of the following options:
#### 1. Define a Global Window Debug Variable
In your application, define at the top of your page the following window debug variable:
```js
window.DEBUG_KALTURA_PLAYER = true;
```
#### 2. Add a Query String Parameter to the Page URL
In your page URL, add the `debugKalturaPlayer` query string parameter:
```js
http://my/page/url?debugKalturaPlayer
```
#
Once you've done one of the above options, open your browser develoer tools and observe player logs:

![player console logs](./images/console-logs-example.png)

## Log Conventions
As you can see in the figure above, our player log conventions build with the following template:
```bash
[Component] Message
```
Try to stick those conventions in you application so debugging & troubleshooting will be easy to understand.
## Controlling the Log Level
If you want to use different log level than `DEBUG`,
you'll need to configure the player with the desired log level. 
<br>For example:
```js
var config = {
    ...
    logLevel: "WARN"
    ...
};
KalturaPlayer.setup(config);
```
This for example, will display only logs from a warning level and above in the console.



