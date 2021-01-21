# Request and Response Manipulation

An application may have to manipulate the player requests and responses to adjust them to its own specific environment (e.g. for DRM license wrapping).  
To achieve this ability Kaltura-player exposes a dedicated configuration which allows the application to pass a request filter to get the request object just before it is sent to the server, and a response filter to get the response object just after it returned from the server.

There are 3 types of requests the application can manipulate: DRM license, manifest and segments fetching.

## Request Params

Each request object contains the followings:

`url: string` - The request URL.  
`body: string || ArrayBuffer` - The request body, the type depends on the request type.  
`headers: Object` - A mapping of headers of the request. e.g.: {'HEADER': 'VALUE'}.

## Response Params

Each response object contains the followings:

`url: string` - The URI which was loaded.  
`originalUrl: string` - The original URI before any redirects.  
`data: ArrayBuffer` - The body of the response.  
`headers: Object` - A mapping of headers of the response. e.g.: {'HEADER': 'VALUE'}.

##

> The request/response filter can run both **synchronously** by returning void and **asynchronously** by returning a promise.
> More details about filters can be found in the [player documentation](https://github.com/kaltura/playkit-js/blob/master/docs/configuration.md#confignetwork).

## Examples

Here's an example of license wrapping using **synchronous** request and response filters passed on the player configuration:

```js
var config = {
  ...,
  network: {
    requestFilter: function(type, request) {
      if (type === KalturaPlayer.core.RequestType.LICENSE) {
        // Sending a custom data which required by the license server
        request.headers['customData'] = CUSTOM_DATA
      }
    },
    responseFilter: function(type, response) {
      if (type === KalturaPlayer.core.RequestType.LICENSE) {
        // Adjusting the drm data to the drm mechanism (e.g. base64 encode/decode)
        response.data = MANIPULATED_DATA;
      }
    }
  }
};
var kalturaPlayer = KalturaPlayer.setup(config);
...
```

Here's an example of **asynchronous** request filter on the manifest and segments fetching, passed on the player configuration:

```js
var config = {
  ...,
  network: {
    requestFilter: function(type, request) {
       if (type === KalturaPlayer.core.RequestType.MANIFEST || type === KalturaPlayer.core.RequestType.SEGMENT) {
        return new Promise(function (resolve) {
          setTimeout(() => {
            // Sending a custom data as query parameter and request header
            request.url += '&' + CUSTOM_DATA;
            request.headers['customData'] = CUSTOM_DATA;
            resolve(request);
          });
        });
      }
    }
  }
};
var kalturaPlayer = KalturaPlayer.setup(config);
...
```
