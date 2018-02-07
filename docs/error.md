
# Errors

Errors are used to notify a user when a critical issue has occurred or to log recoverable issues. An error object consists of three mandatory parameters: 

- Error Severity
- Error Category
- Error Code
- Error Custom Data - An optional object with additional information about the issue.

> There are two severities to an error: **critical** and **recoverable**.
> - A critical error is triggered in an error event and is shown to the user as error overlay in the player itself.
> - A recoverable error is not shown to an end user, but appears in the console.

## Error Lists
You'll find the full lists of errors here:
- [Error Severity List](https://github.com/kaltura/playkit-js/blob/master/src/error/severity.js)
- [Error Category List](https://github.com/kaltura/playkit-js/blob/master/src/error/category.js)
- [Error Code List](https://github.com/kaltura/playkit-js/blob/master/src/error/code.js)

## Listening to an Error Event
You can listen to errors the player emits by listening to an '`error`' event as follows:

```javascript
player.addEventListener(player.Event.ERROR, event => {
  const error = e.payload;
  console.log('The error severity is: ' + error.severity);
  console.log('The error category is: ' + error.category);
  console.log('The error code is: ' + error.code);
  console.log('The error data is', error.data);
});
```

## Creating an Error 

If you wish to change / emit an error event, you'll need to create an error object in the following manner:

```javascript
const myError = new Error(
  Error.Severity.CRITICAL, 
  Error.Category.NETWORK,
  Error.Code.HTTP_ERROR,
  {url: 'www.some-bad-url.com'}
  );
```

Next, you'll need to dispatch an `Error` event:
```js
player.dispatchEvent(new FakeEvent(player.Event.Error, myError));
```

> You'll find additional information about dispatching events [here](./events.md).



## Using Debug Mode to see Explicit Error Messages

Use the debug mode in the player to view explicit error messages in the console. To run the player in debug mode, set config.debugLevel to **true**.

> You'll find additional information about debugging and troubleshooting the player [here](./debugging.md).

## Error Message Example

Here's an example of an error message that can be observed in the console:

    [Error] Player error NETWORK.HTTP_ERROR 'url':'www.some-bad-url.com'


