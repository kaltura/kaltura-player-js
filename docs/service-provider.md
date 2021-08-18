# Service Provider

Service provider enables cross service registration and accessing.

For example - Plugin A gives service to Plugin B -
Without the Service Provider, Plugin A is inaccessible to Plugin B and vise versa.

We exposed three new API methods in Kaltura Player -

- registerService
- hasService
- getService

## How to register as a service
In this example plugin A will register `doSomethingInstance` as a service called 'pluginAService'
```js
player.registerService('pluginAService', doSomethingInstance);
```

## How to use a registered service
In this example plugin B will use some method `doSomething` from `doSomethingInstance` in plugin A
```js
if (player.hasService('pluginAService')){
  player.getService('pluginAService').doSomething()
}
```
