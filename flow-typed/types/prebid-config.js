// @flow

declare type KPAdPrebidConfig = {
  adUnit: Object,
  params?: Object,
  options?: Object,
  timeout: number
};

declare type KPPrebidConfig = KPAdPrebidConfig & {
  libUrl: string,
  disable: boolean
};
