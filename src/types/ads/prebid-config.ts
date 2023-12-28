export interface KPAdPrebidConfig {
  adUnit: any;
  params?: Object;
  options?: Object;
  timeout: number;
}

export interface KPPrebidConfig extends KPAdPrebidConfig {
  libUrl: string;
}
