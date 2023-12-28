export interface NetworkConfig {
  requestFilter?: () => void;
  responseFilter?: () => void;
  maxStaleLevelReloads: number;
}
