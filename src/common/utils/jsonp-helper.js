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
  const hasOneFlavor = data && data.flavors && (data.flavors.length === 1);
  const flavorUriHost = hasOneFlavor && getHostName(data.flavors[0].url);
  if (hasOneFlavor && (uriHost !== flavorUriHost)) {
    return data.flavors[0].url;
  } else {
    return uri;
  }
}

/**
 * returns if we should use our jsonp http plugin
 * @returns {boolean} should use external stream requests redirect on manifests
 */
function shouldUseExternalStreamRedirect(): boolean {
  const affectedBrowsers = ['IE', 'Edge'];
  const affectedVendors = ['panasonic'];
  return (affectedBrowsers.includes(Env.browser.name) ||
    (Env.device.vendor && affectedVendors.includes(Env.device.vendor)));
}

/**
 * add jsonp configuration to the general config
 * @param {Object} config - configuration relevant to jsonp
 * @returns {void}
 */
function configureExternalStreamRedirect(config: Object): void {
  config.playback.options = config.playback.options || {};
  let adapters = config.playback.options.adapters = config.playback.options.adapters || {};
  if (typeof adapters.forceRedirectExternalStreams !== "boolean") {
    config.playback.options.adapters.forceRedirectExternalStreams = shouldUseExternalStreamRedirect();
  }
  config.playback.options.adapters.redirectExternalStreamsCallback = getDirectManfiestUri;
}

export {configureExternalStreamRedirect}
