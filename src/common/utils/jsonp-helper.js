// @flow
import {Env} from 'playkit-js'

/**
 * jsonp callback function, returns the direct manifest uri
 * @param {Object} data - the json object that returns from the server
 * @param {string} uri - original request uri
 * @returns {string} returns the direct uri
 */
function getDirectManfiestUri(data: Object, uri: string): string {
  const getHostName = uri => {
    const parser = document.createElement('a');
    parser.href = uri;
    return parser.hostname
  };
  // if the json contains one url, it means it is a redirect url. if it contains few urls, it means its the flavours
  //so we should use the original url.
  const uriHost = getHostName(uri);
  const flavorUriHost = getHostName(data.flavors[0].url);
  if (data.flavors && data.flavors.length === 1 && uriHost !== flavorUriHost) {
    return data.flavors[0].url;
  } else {
    return uri;
  }
}

/**
 * returns if we should use our jsonp http plugin
 * @param {Object} config - configuration relevant to jsonp
 * @returns {boolean} should or not use jsonp requests on manifests
 */
function shouldUseJsonp(config: Object): boolean {
  const affectedBrowsers = ['IE', 'Edge'];
  const affectedVendors = ['panasonic'];
  if ((config && config.forceRedirectForExternalStreams) || affectedBrowsers.includes(Env.browser.name) || (Env.device.vendor && affectedVendors.includes(Env.device.vendor))) {
    return true;
  }
  return false;
}

/**
 * add jsonp configuration to the general config
 * @param {Object} config - configuration relevant to jsonp
 * @returns {void}
 */
function configureExternalStreamRedirect(config: Object): void {
  config.playback.options = config.playback.options || {};
  config.playback.options.adapters = config.playback.options.adapters || {};
  config.playback.options.adapters.forceRedirectForExternalStreams = shouldUseJsonp(config.playback.options.adapters);
  config.playback.options.adapters.redirectForExternalStreamsCallback = getDirectManfiestUri;
}

export {configureExternalStreamRedirect}
