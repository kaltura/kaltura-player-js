// @flow
import {Env, Utils} from 'playkit-js'

/**
 * JSONP callback function, returns the direct manifest uri.
 * @param {Object} data - The json object that returns from the server.
 * @param {string} uri - Original request uri.
 * @returns {string} - The direct uri.
 */
function getDirectManifestUri(data: Object, uri: string): string {
  const getHostName = uri => {
    const parser = document.createElement('a');
    parser.href = uri;
    return parser.hostname
  };
  // if the json contains one url, it means it is a redirect url. if it contains few urls, it means its the flavours
  // so we should use the original url.
  const uriHost = getHostName(uri);
  const hasOneFlavor = data && data.flavors && (data.flavors.length === 1);
  const flavorUriHost = hasOneFlavor && getHostName(data.flavors[0].url);
  if (hasOneFlavor && (uriHost !== flavorUriHost)) {
    return data.flavors[0].url;
  }
  return uri;
}

/**
 * Whether we should use our JSONP http plugin.
 * @returns {boolean} - Should use external stream requests redirect on manifests.
 */
function shouldUseExternalStreamRedirect(): boolean {
  const affectedBrowsers = ['IE', 'Edge'];
  const affectedVendors = ['panasonic'];
  return (affectedBrowsers.includes(Env.browser.name) ||
    (Env.device && affectedVendors.includes(Env.device.vendor)));
}

/**
 * Add JSONP configuration to the general config.
 * @param {Object} config - Configuration relevant to JSONP.
 * @returns {void}
 */
function configureExternalStreamRedirect(config: Object): void {
  let sourceOptions = Utils.Object.getPropertyPath(config, 'sources.options');
  if (!sourceOptions) {
    Utils.Object.mergeDeep(config, {
      sources: {
        options: {}
      }
    });
    sourceOptions = config.sources.options;
  }

  if (typeof sourceOptions.forceRedirectExternalStreams !== "boolean") {
    sourceOptions.forceRedirectExternalStreams = shouldUseExternalStreamRedirect();
  }
  if (typeof sourceOptions.redirectExternalStreamsCallback !== "function") {
    sourceOptions.redirectExternalStreamsCallback = getDirectManifestUri;
  }
}

export {configureExternalStreamRedirect};
