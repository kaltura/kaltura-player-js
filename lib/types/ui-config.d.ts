export interface UiConfig {
  disable?: boolean;
  css?: string;
  customPreset?: {
    template: () => any;
    condition: () => any;
  }[];
  targetId: string;
}
//# sourceMappingURL=ui-config.d.ts.map
