## UI Configuration

In elaboration to the [Player configuration parameters](https://github.com/kaltura/kaltura-player-js/blob/master/docs/configuration.md), this section will detail the UI configuration.

The UI configuration supports the following params:

1.  As defined in type [UIOptionsObject](./docs/configuration.md)
2.  css - Applying an external style sheet URL is possible as described [here](#ExternalCSS)

##

### <a name="ExternalCSS"></a>External CSS

An external style sheet URL can be given in the configuration as follows:

```js
{
  ui: {
    css: '###'; // place a valid URL String
  }
}
```

The styling will be applied on the entire page.
The main use case of this parameter is for embedded players.

##
