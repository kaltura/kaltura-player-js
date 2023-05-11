// @flow
declare type KPUIAddComponent = KPUIComponentOptions & {
  get: Function,
  props?: {}
};

declare type KPUIRemoveComponent = {
  removeComponent: string,
  presets: Array<string>,
  area: string
};

declare type KPUIComponent = KPUIAddComponent & KPUIRemoveComponent;
