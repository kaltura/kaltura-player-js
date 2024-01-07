import { UIOptionsObject } from '@playkit-js/playkit-js-ui';

export interface UiConfig extends UIOptionsObject {
  disable?: boolean;
  css?: string;
  customPreset?: { template: () => any; condition: () => any }[];
}
