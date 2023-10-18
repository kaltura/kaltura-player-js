export interface AdPrebidConfig {
  adUnit: Object;
  params?: Object;
  options?: Object;
  timeout: number;
}

export interface PrebidConfig extends AdPrebidConfig {
  libUrl: string;
}
