## UI Configuration

The UI configuration supports the following params:

- As defined in type [UIOptionsObject](https://github.com/kaltura/playkit-js-ui/blob/master/docs/configuration.md)
- css - Applying an external style sheet URL is possible as described in [External CSS](#External-CSS)

##

### External CSS

An external style sheet URL can be given in the configuration as follows:

```js
{
  ui: {
    css: 'https://myDomain.com/path/to/css'; // place a valid css file URL String
  }
}
```

The styling will be applied on the entire page.
The main use case of this parameter is for [Auto Embed](./embed-types.md#auto-embed) and [IFrame Embed](./embed-types.md#iframe-embed)

##
