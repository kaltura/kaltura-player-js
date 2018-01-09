// @flow
declare type PartialKalturaPlayerOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject
};

declare type KalturaPlayerOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui: UIOptionsObject
};

