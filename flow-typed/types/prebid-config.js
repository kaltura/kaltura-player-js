// @flow

declare type KPAdPrebidConfig = {
  adUnit: Object,
  params?: Object,
  options?: Object
}
declare type KPPrebidConfig = KPAdPrebidConfig & {
  libUrl: string,
  disable: boolean,
  timeout: number
};
