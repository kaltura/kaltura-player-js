//@flow
import {Utils} from 'playkit-js'

const defaultConfig = {
  "youbora": {
    "playerVersion": "{{pVersion}}",
    "playerName": "{{pName}}",
    "entryId": "{{entryId}}",
    "entryName": "{{entryName}}",
    "entryType": "{{entryType}}",
    "sessionId": "{{sessionId}}",
    "uiConfId": "{{uiConfId}}"
  },
  "kanalytics": {
    "playerVersion": "{{pVersion}}",
    "entryId": "{{entryId}}",
    "entryType": "{{entryType}}",
    "sessionId": "{{sessionId}}",
    "ks": "{{ks}}",
    "uiConfId": "{{uiConfId}}",
    "partnerId": "{{partnerId}}",
    "referrer": "{{referrer}}"
  },
  "googleAnalytics": {
    "entryId": "{{entryId}}",
    "entryName": "{{entryName}}",
    "uiConfId": "{{uiConfId}}",
    "partnerId": "{{partnerId}}"
  },
  "ottAnalytics": {
    "entryId": "{{entryId}}",
    "ks": "{{ks}}",
    "isAnonymous": "{{isAnonymous}}",
    "partnerId": "{{partnerId}}",
    "serviceUrl": "{{serviceUrl}}"
  },
  "ima": {
    "playerVersion": "{{pVersion}}",
    "playerName": "{{pName}}"
  },
  "kava": {
    "playerVersion": "{{pVersion}}",
    "playerName": "{{pName}}",
    "partnerId": "{{partnerId}}",
    "entryId": "{{entryId}}",
    "entryType": "{{entryType}}",
    "sessionId": "{{sessionId}}",
    "ks": "{{ks}}",
    "uiConfId": "{{uiConfId}}",
    "referrer": "{{referrer}}"
  },
  "comscore": {
    "playerVersion": "{{pVersion}}"
  },
  "vr": {
    "rootElement": "{{domRootElementId}}"
  }
};

let config = Utils.Object.copyDeep(defaultConfig);
const templateRegex = new RegExp(('{{.*}}'));
const isObject = val => typeof val === 'object' && !Array.isArray(val);
const resolveNewConfig = (obj = {}): Object =>
  Object.entries(obj)
    .reduce(
      (product, [key, value]): Object => {
        if (isObject(value)) {
          product[key] = resolveNewConfig(value)
        } else if (typeof value === "string" && templateRegex.test(value)) {
          product[key] = value;
        } else {
          product[key] = undefined
        }
        return product;
      },
      {}
    );
const removeUndefineds = (obj = {}): Object =>
  Object.entries(obj)
    .reduce(
      (product, [key, value]): Object => {
        if (isObject(value)) {
          product[key] = removeUndefineds(value)
        } else if (value) {
          product[key] = value;
        }
        return product;
      },
      {}
    );

const pluginConfig = {
  get: (): Object => {
    return config;
  },
  set: (pluginsConfig: ?Object): void => {
    if (pluginsConfig) {
      const newConfig = resolveNewConfig(pluginsConfig);
      config = removeUndefineds(Utils.Object.mergeDeep(config, newConfig));
    }
  },
  reset: (): void => {
    config = Utils.Object.copyDeep(defaultConfig);
  }
};

export {pluginConfig};
