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
  const hasOneFlavor = data && data.flavors && (data.flavors.length === 1);
  const flavorUriHost = hasOneFlavor && getHostName(data.flavors[0].url);
  if (hasOneFlavor && (uriHost !== flavorUriHost)) {
    return data.flavors[0].url;
  }
  return uri;
}

/**
 * Add external stream redirect configuration to the general config.
 * @param {Object} config - Player config.
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
  if (sourceOptions.forceRedirectExternalStreams) {
    if (typeof sourceOptions.redirectExternalStreamsHandler !== "function") {
      sourceOptions.redirectExternalStreamsHandler = getDirectManifestUri;
    }
  }
}

export {configureExternalStreamRedirect};
