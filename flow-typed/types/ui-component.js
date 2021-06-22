// @flow
declare type KPUIAddComponent = {|
  label: string,
  get: Function,
  props?: {},
  beforeComponent?: string,
  afterComponent?: string,
  replaceComponent?: string,
  presets: Array<string>,
  area: string
|};

declare type KPUIRemoveComponent = {|
  removeComponent?: string,
  presets: Array<string>,
  area: string
|};

declare type KPUIComponent = KPUIAddComponent | KPUIRemoveComponent;
