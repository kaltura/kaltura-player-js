// @flow
import {Utils} from 'playkit-js'

/**
 * JSONP handler function, returns the direct manifest uri.
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
  let hasOneFlavor = false;
  let redirectedUriHost = "";
  let redirectedUri = "";
  if (data) {
    if (data.flavors && Array.isArray(data.flavors)) {
      hasOneFlavor = data.flavors.length === 1;
      redirectedUriHost = hasOneFlavor && getHostName(data.flavors[0].url);
      redirectedUri = data.flavors[0].url;
    } else if (data.result) {
      hasOneFlavor = true;
      redirectedUriHost = getHostName(data.result.url);
      redirectedUri = data.result.url;
    }
  }
  if (hasOneFlavor && (uriHost !== redirectedUriHost)) {
    return redirectedUri;
  }
  return uri;
}

/**
 * Add external stream redirect configuration to the general config.
 * @param {KPOptionsObject} options - kaltura player options.
 * @returns {void}
 */
function configureExternalStreamRedirect(options: KPOptionsObject): void {
  let sourceOptions = Utils.Object.getPropertyPath(options, 'sources.options');
  if (!sourceOptions) {
    Utils.Object.mergeDeep(options, {
      sources: {
        options: {}
      }
    });
    sourceOptions = options.sources && options.sources.options;
  }
  if (sourceOptions && typeof sourceOptions.redirectExternalStreamsHandler !== 'function') {
    sourceOptions.redirectExternalStreamsHandler = getDirectManifestUri;
  }
}

export {configureExternalStreamRedirect};
