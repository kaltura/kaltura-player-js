type dataStoreType = {
  [pluginName: string]: Object;
};
declare const templateRegex: RegExp;
declare class BasePluginConfigStore {
  _basePluginsConfig: dataStoreType;
  _config: dataStoreType;
  /**
   * constructor
   * @constructor
   */
  constructor();
  /**
   * return the token store object
   * @returns {*|any} - token store object
   */
  get(): dataStoreType;
  /**
   * recalculate the token store data, if new config with token is passed then add it to the data store, and if
   * an existing token needs to be removed then remove it
   * @param {?dataStoreType} pluginsConfig - the new config object
   * @returns {void}
   */
  set(pluginsConfig?: dataStoreType): void;
  /**
   * reset the config store to its initial state
   * @returns {void}
   */
  reset(): void;
}
export { BasePluginConfigStore, templateRegex };
//# sourceMappingURL=plugins-config-store.d.ts.map
