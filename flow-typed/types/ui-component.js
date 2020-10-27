// @flow
declare type KPUIComponent = {
  label: string,
  presets: Array<string>,
  area: string,
  get: Function,
  props?: {},
  beforeComponent?: string,
  afterComponent?: string,
  replaceComponent?: string
};
