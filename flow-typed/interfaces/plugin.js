//@flow
declare interface IPlugin {
  getConfig(attr?: string): any;
  updateConfig(update: Object): void;
  loadMedia(): void;
  destroy(): void;
  reset(): void;
}
