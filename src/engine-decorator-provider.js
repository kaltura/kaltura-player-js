// @flow
export default class EngineDecoratorProvider implements IEngineDecoratorProvider {
  constructor(plugin) {
    this.name = plugin.getName();
    this.handler = plugin.getEngineDecorator.bind(plugin);
  }

  getEngineDecorator(...args) {
    return this.handler(...args);
  }

  getName() {
    return this.name;
  }
}
