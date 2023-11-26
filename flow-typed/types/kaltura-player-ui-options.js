// @flow
declare type KPUIOptionsObject = {
  disable?: boolean,
  css?: string,
  customPreset?: Array<{template: Function, condition: Function}>
} & UIOptionsObject;
