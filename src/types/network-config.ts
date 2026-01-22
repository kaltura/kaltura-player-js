export interface NetworkConfig {
  requestFilter?: (type: number, request: any) => void;
  responseFilter?: (type: number, response: any) => void;
  maxStaleLevelReloads: number;
}
