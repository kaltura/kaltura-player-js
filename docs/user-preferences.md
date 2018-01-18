# User Preferences
User preferences are actions that triggered by the user and produced a configurable value which saved in the browser's local storage. The player uses those values to enable users keep their last choices when played media.
<br>For example, if the last played media was muted, the next media will begin muted also, even if the user refreshed the page.

## Saved Values as User Preferences
* Muted
* Volume
* Audio Language Track
* Text Language Track
* Captions Text Style

## Workflow
Upon instantiation of the player, accordingly to the saved values found in the local storage, a partial configuration is created internally by the `StorageManager` and supplied to the player. 
<br>The structure of this configuration is as bellow:
```js
{
	muted: string,
	volume: number,
	audioLanguage: string,
	textLanguage: string,
	textStyle: TextStyle
}
```
<br>This type of configuration is enabled by default and to disable it, you'll need to configure the `disableUserCache` value with true when creating the player instance.
```js
{
	...
	disableUserCache: true // Disable user preferences
	...
}
```
An high-level workflow can be seen in the following flow-chart diagram:
![setup-flow-local-storage](./images/setup-flow-local-storage.jpg)

After the player has started to play, the `StorageManager` will track any user interaction with the UI and update the storage value accordingly, as you can see in the following sequence diagram:
<br><br>
![save-value-flow-local-storage](./images/save-value-flow-local-storage.png)

## Browser Compatibility
This feature can work on all browsers that supports localStorage.
<br>For full list of browser compatibility with localStorage see [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## View and Edit Values
> This example based on Chrome browser but can be done on any supported browser.

1. Open your test page.
2. Right click -> Inspect.
3. Go to _Application_ tab.
4. In the left menu, choose _Local Storage_ and click the arrow button.
5. Choose your test page domain.

Now you can view your saved player values in the local storage:
![chrome-local-storage](./images/chrome-local-storage.png)

To clear those values, click on the clear button:
![clear-button-local-storage](./images/clear-button-local-storage.png)
<br>To edit those values, click on any value in the right column and edit.
