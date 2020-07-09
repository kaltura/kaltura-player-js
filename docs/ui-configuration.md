## UI Configuration

In elaboration to the [Player configuration parameters](./docs/configuration.md), this section will detail the UI configuration.

The UI configuration supports the following params:

- As defined in type [UIOptionsObject](https://github.com/kaltura/playkit-js-ui/blob/master/docs/configuration.md)
- css - Applying an external style sheet URL is possible as described in [External CSS](#External-CSS)

##

### External CSS

An external style sheet URL can be given in the configuration as follows:

```js
{
  ui: {
    css: '###'; // place a valid css file URL String
  }
}
```

The styling will be applied on the entire page.
The main use case of this parameter is for [Auto Embed](./docs/embed-types.md#auto-embed) and [IFrame Embed](./docs/embed-types.md#iframe-embed)

##
