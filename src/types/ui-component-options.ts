export interface KPUIComponentOptions {
  label: string;
  presets: Array<string>;
  area: string;
  /** @deprecated Use area instead. */
  container?: string;
  beforeComponent?: string;
  afterComponent?: string;
  replaceComponent?: string;
}
