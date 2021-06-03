// @flow
import {Utils} from '@playkit-js/playkit-js';

/**
 * JSONP handler function, returns the direct manifest uri.
 * @private
 * @param {Object} data - The json object that returns from the server.
 * @param {string} uri - Original request uri.
 * @returns {string} - The direct uri.
 */
function getDirectManifestUri(data: Object, uri: string): string {
  const getHostName = uri => {
    const parser = document.createElement('a');
    parser.href = uri;
    return parser.hostname;
  };
  // if the json contains one url, it means it is a redirect url. if it contains few urls, it means its the flavours
  // so we should use the original url.
  const uriHost = getHostName(uri);
  let hasOneFlavor = false;
  let redirectedUriHost = '';
  let redirectedUri = '';
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
  if (hasOneFlavor && uriHost !== redirectedUriHost) {
    return redirectedUri;
  }
  return uri;
}

/**
 * Get the redirect external stream handler.
 * @public
 * @param {KPOptionsObject} playerOptions - The player config.
 * @param {KPOptionsObject} mediaOptions - The media config.
 * @returns {void}
 */
function getRedirectExternalStreamsHandler(playerOptions: KPOptionsObject, mediaOptions: KPOptionsObject = {}): Object {
  const configObj = {};
  const playerRedirectExternalStreamsHandler = Utils.Object.getPropertyPath(playerOptions, 'sources.options.redirectExternalStreamsHandler');
  const mediaRedirectExternalStreamsHandler = Utils.Object.getPropertyPath(mediaOptions, 'sources.options.redirectExternalStreamsHandler');
  if (typeof playerRedirectExternalStreamsHandler !== 'function' && typeof mediaRedirectExternalStreamsHandler !== 'function') {
    Utils.Object.mergeDeep(configObj, {
      sources: {
        options: {
          redirectExternalStreamsHandler: getDirectManifestUri
        }
      }
    });
  }
  return configObj;
}

export {getRedirectExternalStreamsHandler};
