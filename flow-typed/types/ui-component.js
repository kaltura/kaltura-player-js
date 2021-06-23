// @flow
declare type KPUIAddComponent = {|
  label: string,
  presets: Array<string>,
  area: string,
  get: Function | string,
  props?: {},
  beforeComponent?: string,
  afterComponent?: string,
  replaceComponent?: string
|};

declare type KPUIRemoveComponent = {|
  removeComponent: string,
  presets: Array<string>,
  area: string
|};

declare type KPUIComponent = KPUIAddComponent | KPUIRemoveComponent;
