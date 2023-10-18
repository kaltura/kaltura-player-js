// TODO extends UIOptionsObject {
export interface UiConfig {
  disable?: boolean;
  css?: string;
  customPreset?: { template: () => any; condition: () => any }[];
  // TODO - omit after extending
  targetId: string;
}
